/**
 * Supabase data layer — single source of truth for all app data.
 * Pages should import from here, NOT from src/lib/store.ts (legacy).
 */
import { supabase } from "@/integrations/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

// ---------- Types (UI-shape, camelCased) ----------
export interface Lesson {
  id: string;
  title: string;
  youtubeUrl: string;
  pdfUrl?: string | null;
  duration: string;
  hasQuiz?: boolean;
  hasAssignment?: boolean;
  sortOrder?: number;
}

export interface Unit {
  id: string;
  title: string;
  sortOrder?: number;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  subject: string;          // subject_id
  thumbnail: string;
  level: "Beginner" | "Intermediate" | "Advanced" | string;
  isFree: boolean;
  price: number;
  rating: number;
  duration: string;
  isPublished: boolean;
  units: Unit[];
  lessons: number;          // total lesson count
  students: number;         // enrollment count (best effort)
  instructor: string;
}

export interface StudentRow {
  id: string;
  name: string;
  email: string;
  enrolledCourses: string[];
  progress: Record<string, number>;
  joinedDate: string;
}

export interface LiveClass {
  id: string;
  title: string;
  link: string;
  startTime: string;
  isLive: boolean;
  courseId?: string | null;
}

export interface AssignmentRow {
  id: string;
  courseId: string;
  lessonId?: string;
  title: string;
  description: string;
  dueDate: string;
  submitted?: boolean;
  submissionText?: string;
}

const INSTRUCTOR_NAME = "Ustadha Afshan Imran";

// ---------- Mappers ----------
function mapLesson(row: any): Lesson {
  return {
    id: row.id,
    title: row.title,
    youtubeUrl: row.youtube_url || "",
    pdfUrl: row.pdf_url,
    duration: row.duration || "",
    hasQuiz: !!row.has_quiz,
    hasAssignment: !!row.has_assignment,
    sortOrder: row.sort_order ?? 0,
  };
}

function mapCourseRow(row: any, units: Unit[] = [], studentsCount = 0): Course {
  const lessonCount = units.reduce((acc, u) => acc + u.lessons.length, 0);
  return {
    id: row.id,
    title: row.title,
    description: row.description || "",
    subject: row.subject_id || "",
    thumbnail: row.thumbnail_url || "/placeholder.svg",
    level: row.level || "Beginner",
    isFree: !!row.is_free,
    price: Number(row.price) || 0,
    rating: Number(row.rating) || 0,
    duration: row.duration || "",
    isPublished: row.is_published !== false,
    units,
    lessons: lessonCount,
    students: studentsCount,
    instructor: INSTRUCTOR_NAME,
  };
}

async function countEnrollments(courseId: string): Promise<number> {
  const { count } = await supabase
    .from("enrollments")
    .select("id", { count: "exact", head: true })
    .eq("course_id", courseId);
  return count || 0;
}

// Batched: 3 fixed queries (units + lessons + enrollments) regardless of course count.
async function hydrateCourses(courseRows: any[]): Promise<Course[]> {
  if (courseRows.length === 0) return [];
  const courseIds = courseRows.map((c) => c.id);

  const [{ data: allUnits }, { data: enrolls }] = await Promise.all([
    supabase.from("units").select("*").in("course_id", courseIds).order("sort_order", { ascending: true }),
    supabase.from("enrollments").select("course_id").in("course_id", courseIds),
  ]);

  const unitRows = allUnits || [];
  const unitIds = unitRows.map((u: any) => u.id);
  const { data: allLessons } = unitIds.length
    ? await supabase.from("lessons").select("*").in("unit_id", unitIds).order("sort_order", { ascending: true })
    : { data: [] as any[] };

  const lessonsByUnit = new Map<string, any[]>();
  for (const l of allLessons || []) {
    const arr = lessonsByUnit.get(l.unit_id) || [];
    arr.push(l);
    lessonsByUnit.set(l.unit_id, arr);
  }
  const unitsByCourse = new Map<string, Unit[]>();
  for (const u of unitRows) {
    const arr = unitsByCourse.get(u.course_id) || [];
    arr.push({
      id: u.id,
      title: u.title,
      sortOrder: u.sort_order ?? 0,
      lessons: (lessonsByUnit.get(u.id) || []).map(mapLesson),
    });
    unitsByCourse.set(u.course_id, arr);
  }
  const countsByCourse = new Map<string, number>();
  for (const e of enrolls || []) {
    countsByCourse.set(e.course_id, (countsByCourse.get(e.course_id) || 0) + 1);
  }

  return courseRows.map((c) => mapCourseRow(c, unitsByCourse.get(c.id) || [], countsByCourse.get(c.id) || 0));
}

// ---------- Courses ----------
export async function fetchPublishedCourses(): Promise<Course[]> {
  const { data: courses, error } = await supabase
    .from("courses")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });
  if (error) {
    if (import.meta.env.DEV) console.error("[db.fetchPublishedCourses]", error.message);
    return [];
  }
  return hydrateCourses(courses || []);
}

export async function fetchSubjects(): Promise<{ id: string; name: string }[]> {
  const { data } = await supabase.from("subjects").select("id, name").order("name");
  return (data || []).map((s: any) => ({ id: s.id, name: s.name }));
}

export async function fetchAllCourses(): Promise<Course[]> {
  const { data, error } = await supabase.from("courses").select("*").order("created_at", { ascending: false });
  if (error || !data) return [];
  return hydrateCourses(data);
}

export async function fetchCourseById(id: string): Promise<Course | null> {
  const { data, error } = await supabase.from("courses").select("*").eq("id", id).maybeSingle();
  if (error || !data) return null;
  const units = await fetchUnitsForCourse(id);
  return mapCourseRow(data, units);
}

export async function fetchUnitsForCourse(courseId: string): Promise<Unit[]> {
  const { data: units } = await supabase
    .from("units")
    .select("*")
    .eq("course_id", courseId)
    .order("sort_order", { ascending: true });
  if (!units) return [];

  const unitIds = units.map((u: any) => u.id);
  if (unitIds.length === 0) return [];

  const { data: lessons } = await supabase
    .from("lessons")
    .select("*")
    .in("unit_id", unitIds)
    .order("sort_order", { ascending: true });

  return units.map((u: any) => ({
    id: u.id,
    title: u.title,
    sortOrder: u.sort_order ?? 0,
    lessons: (lessons || []).filter((l: any) => l.unit_id === u.id).map(mapLesson),
  }));
}

export async function createCourse(input: {
  title: string;
  description: string;
  subject: string;
  thumbnail: string;
  level: string;
  price: number;
  duration: string;
}) {
  const id = (globalThis.crypto as any)?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
  const { error } = await supabase.from("courses").insert({
    id,
    title: input.title,
    description: input.description,
    subject_id: input.subject,
    thumbnail_url: input.thumbnail,
    level: input.level,
    price: input.price,
    is_free: input.price === 0,
    duration: input.duration,
    is_published: true,
    rating: 0,
  });
  return { id, error };
}

export async function updateCoursePrice(id: string, price: number, isFree: boolean) {
  return supabase.from("courses").update({ price, is_free: isFree }).eq("id", id);
}

export interface UpdateCourseInput {
  title: string;
  description: string;
  subject: string;
  thumbnail: string;
  level: string;
  duration: string;
  price: number;
  isFree: boolean;
}

export async function updateCourse(id: string, input: UpdateCourseInput) {
  const title = input.title?.trim();
  const description = input.description?.trim();
  if (!title) return { error: { message: "Title is required" } as any };
  if (!description) return { error: { message: "Description is required" } as any };
  if (input.thumbnail && !/^(https?:\/\/|data:image\/|\/)/i.test(input.thumbnail)) {
    return { error: { message: "Thumbnail must be a valid URL" } as any };
  }
  const price = Number(input.price);
  if (Number.isNaN(price) || price < 0) return { error: { message: "Price must be a non-negative number" } as any };
  return supabase.from("courses").update({
    title,
    description,
    subject_id: input.subject,
    thumbnail_url: input.thumbnail || "/placeholder.svg",
    level: input.level,
    duration: input.duration || "",
    price: input.isFree ? 0 : price,
    is_free: input.isFree || price === 0,
  }).eq("id", id);
}

export async function deleteCourse(id: string) {
  return supabase.from("courses").delete().eq("id", id);
}

// ---------- Units / Lessons ----------
export async function addLesson(input: {
  courseId: string;
  unitTitle?: string;
  lessonTitle: string;
  youtubeUrl: string;
  duration: string;
}) {
  const uuid = () => (globalThis.crypto as any)?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
  // Find or create a unit for the course
  let unitId: string | null = null;
  const { data: existing } = await supabase
    .from("units")
    .select("id")
    .eq("course_id", input.courseId)
    .order("sort_order", { ascending: true })
    .limit(1);
  if (existing && existing.length > 0) {
    unitId = existing[0].id;
  } else {
    const newUnitId = uuid();
    const { error } = await supabase.from("units").insert({
      id: newUnitId,
      course_id: input.courseId,
      title: input.unitTitle || "Lessons",
      sort_order: 0,
    });
    if (error) return { error };
    unitId = newUnitId;
  }

  return supabase.from("lessons").insert({
    id: uuid(),
    unit_id: unitId,
    title: input.lessonTitle,
    youtube_url: input.youtubeUrl,
    duration: input.duration,
    sort_order: 0,
  });
}

export async function removeLesson(lessonId: string) {
  return supabase.from("lessons").delete().eq("id", lessonId);
}

// ---------- Enrollments ----------
export async function fetchMyEnrollments(userId: string) {
  const { data, error } = await supabase
    .from("enrollments")
    .select("course_id, progress")
    .eq("student_id", userId);
  if (error) {
    if (import.meta.env.DEV) console.error("[db.fetchMyEnrollments]", error.message);
    return [];
  }
  if (!data) return [];
  return data.map((e: any) => ({ courseId: e.course_id, progress: e.progress || 0 }));
}

export async function enrollInCourse(userId: string, courseId: string) {
  return supabase.from("enrollments").upsert(
    { student_id: userId, course_id: courseId, progress: 0 },
    { onConflict: "student_id,course_id" }
  );
}

export async function unenroll(userId: string, courseId: string) {
  return supabase.from("enrollments").delete().eq("student_id", userId).eq("course_id", courseId);
}

// ---------- Students (teacher view) ----------
export async function fetchAllStudents(): Promise<StudentRow[]> {
  // Find teacher user_ids so we can exclude them from the student list
  const { data: teacherRoles } = await supabase
    .from("user_roles")
    .select("user_id")
    .eq("role", "teacher");
  const teacherIds = new Set((teacherRoles || []).map((r: any) => r.user_id));

  const { data: rows, error } = await supabase
    .from("students")
    .select("*")
    .order("name", { ascending: true });
  if (error || !rows) {
    if (import.meta.env.DEV) console.error("[db.fetchAllStudents]", error?.message);
    return [];
  }

  const filtered = rows.filter((r: any) => !teacherIds.has(r.id));
  const ids = filtered.map((r: any) => r.id);
  const { data: enrolls } = ids.length
    ? await supabase.from("enrollments").select("student_id, course_id, progress").in("student_id", ids)
    : { data: [] as any[] };
  return filtered.map((r: any) => {
    const myEnrolls = (enrolls || []).filter((e: any) => e.student_id === r.id);
    return {
      id: r.id,
      name: r.name || r.email || "Student",
      email: r.email || "",
      enrolledCourses: myEnrolls.map((e: any) => e.course_id),
      progress: Object.fromEntries(myEnrolls.map((e: any) => [e.course_id, e.progress || 0])),
      joinedDate: (r.created_at || "").split("T")[0] || "",
    };
  });
}

export async function teacherEnroll(studentId: string, courseId: string) {
  return enrollInCourse(studentId, courseId);
}

export async function teacherUnenroll(studentId: string, courseId: string) {
  return unenroll(studentId, courseId);
}

// ---------- Live class ----------
export async function fetchLiveClass(): Promise<LiveClass | null> {
  const { data } = await supabase
    .from("live_class")
    .select("*")
    .eq("is_live", true)
    .order("start_time", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!data) return null;
  return {
    id: String(data.id),
    title: data.title || "Live Class",
    link: data.link || "",
    startTime: data.start_time || new Date().toISOString(),
    isLive: !!data.is_live,
    courseId: data.course_id ?? null,
  };
}

export async function startLiveClass(input: { title: string; link: string; courseId?: string | null }) {
  // Clear any previous live rows entirely to avoid PK / unique conflicts
  await supabase.from("live_class").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  const id = (globalThis.crypto as any)?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
  return supabase.from("live_class").insert({
    id,
    title: input.title,
    link: input.link,
    start_time: new Date().toISOString(),
    is_live: true,
    course_id: input.courseId ?? null,
  });
}

export async function endLiveClass() {
  return supabase.from("live_class").update({ is_live: false }).eq("is_live", true);
}

// ---------- Assignments ----------
export async function fetchAssignmentsForCourses(courseIds: string[]): Promise<AssignmentRow[]> {
  if (courseIds.length === 0) return [];
  const { data } = await supabase.from("assignments").select("*").in("course_id", courseIds);
  if (!data) return [];
  return data.map((a: any) => ({
    id: a.id,
    courseId: a.course_id,
    title: a.title,
    description: a.description || "",
    dueDate: a.due_date || "",
  }));
}

// ---------- Profile ----------
export async function fetchMyProfile(userId: string) {
  const { data } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  return data;
}

export async function updateMyName(userId: string, name: string) {
  return supabase.from("profiles").update({ name }).eq("id", userId);
}

// ---------- Realtime ----------
export function subscribeToTable(table: string, cb: () => void): () => void {
  const channel: RealtimeChannel = supabase
    .channel(`rt-${table}-${Math.random().toString(36).slice(2)}`)
    .on("postgres_changes", { event: "*", schema: "public", table }, () => cb())
    .subscribe();
  return () => {
    supabase.removeChannel(channel);
  };
}

export function subscribeToTables(tables: string[], cb: () => void): () => void {
  const unsubs = tables.map((t) => subscribeToTable(t, cb));
  return () => unsubs.forEach((u) => u());
}

// ---------- Blog ----------
export interface QaItem { question: string; answer: string; }

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  qaItems: QaItem[] | null;
  isPublished: boolean;
  publishedAt: string | null;
  metaTitle: string;
  metaDescription: string;
  authorName: string;
  readingTimeMinutes: number;
  createdAt: string;
  updatedAt: string;
}

function mapBlogPost(row: any): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt || "",
    content: row.content || "",
    coverImage: row.cover_image_url || "",
    category: row.category || "teaching",
    tags: row.tags || [],
    qaItems: (row.qa_items as QaItem[] | null) ?? null,
    isPublished: !!row.is_published,
    publishedAt: row.published_at ?? null,
    metaTitle: row.meta_title || "",
    metaDescription: row.meta_description || "",
    authorName: row.author_name || "Ustadha Afshan Imran",
    readingTimeMinutes: row.reading_time_minutes || 1,
    createdAt: row.created_at || "",
    updatedAt: row.updated_at || "",
  };
}

function slugify(s: string): string {
  return s.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80) || "post";
}

function estimateReadingMinutes(html: string): number {
  const text = html.replace(/<[^>]*>/g, " ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

async function ensureUniqueSlug(base: string, excludeId?: string): Promise<string> {
  let candidate = base;
  let i = 2;
  while (true) {
    let q = supabase.from("blog_posts").select("id").eq("slug", candidate).limit(1);
    const { data } = await q;
    const rows = (data || []).filter((r: any) => !excludeId || r.id !== excludeId);
    if (rows.length === 0) return candidate;
    candidate = `${base}-${i++}`;
  }
}

export async function fetchPublishedBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });
  if (error || !data) return [];
  return data.map(mapBlogPost);
}

export async function fetchAllBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map(mapBlogPost);
}

export async function fetchBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data } = await supabase.from("blog_posts").select("*").eq("slug", slug).maybeSingle();
  return data ? mapBlogPost(data) : null;
}

export interface BlogPostInput {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  category?: string;
  tags?: string[];
  qaItems?: QaItem[] | null;
  isPublished?: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

export async function createBlogPost(input: BlogPostInput) {
  const baseSlug = slugify(input.slug || input.title);
  const slug = await ensureUniqueSlug(baseSlug);
  const readingTime = estimateReadingMinutes(input.content || "");
  const nowIso = new Date().toISOString();
  const { data, error } = await supabase.from("blog_posts").insert({
    slug,
    title: input.title,
    excerpt: input.excerpt || "",
    content: input.content || "",
    cover_image_url: input.coverImage || null,
    category: input.category || "teaching",
    tags: input.tags || [],
    qa_items: input.qaItems ?? null,
    is_published: !!input.isPublished,
    published_at: input.isPublished ? nowIso : null,
    meta_title: input.metaTitle || null,
    meta_description: input.metaDescription || null,
    reading_time_minutes: readingTime,
  }).select().maybeSingle();
  return { data: data ? mapBlogPost(data) : null, error };
}

export async function updateBlogPost(id: string, input: BlogPostInput) {
  const baseSlug = slugify(input.slug || input.title);
  const slug = await ensureUniqueSlug(baseSlug, id);
  const readingTime = estimateReadingMinutes(input.content || "");
  const nowIso = new Date().toISOString();
  // Fetch current to know if we're transitioning to published
  const { data: current } = await supabase.from("blog_posts").select("is_published, published_at").eq("id", id).maybeSingle();
  const nextPublished = !!input.isPublished;
  const published_at = nextPublished ? (current?.published_at || nowIso) : null;
  const { error } = await supabase.from("blog_posts").update({
    slug,
    title: input.title,
    excerpt: input.excerpt || "",
    content: input.content || "",
    cover_image_url: input.coverImage || null,
    category: input.category || "teaching",
    tags: input.tags || [],
    qa_items: input.qaItems ?? null,
    is_published: nextPublished,
    published_at,
    meta_title: input.metaTitle || null,
    meta_description: input.metaDescription || null,
    reading_time_minutes: readingTime,
  }).eq("id", id);
  return { error };
}

export async function deleteBlogPost(id: string) {
  return supabase.from("blog_posts").delete().eq("id", id);
}

export async function togglePublishBlogPost(id: string, isPublished: boolean) {
  const { data: current } = await supabase.from("blog_posts").select("published_at").eq("id", id).maybeSingle();
  return supabase.from("blog_posts").update({
    is_published: isPublished,
    published_at: isPublished ? (current?.published_at || new Date().toISOString()) : null,
  }).eq("id", id);
}

// ---------- Bulk lessons ----------
export interface ParsedBulkLesson {
  title: string;
  youtubeUrl: string;
  videoId: string;
}

/**
 * Parse "Title - https://youtube.com/watch?v=ID" lines.
 * Splits on the URL pattern (NOT on `-`), so titles containing hyphens
 * (e.g. "Surah Al-Baqarah, Ayah 1-5 - https://…") parse correctly.
 * Returns { parsed, skipped } — skipped is 1-indexed line numbers.
 */
export function parseBulkLessons(text: string): { parsed: ParsedBulkLesson[]; skipped: number[] } {
  const parsed: ParsedBulkLesson[] = [];
  const skipped: number[] = [];
  const urlRe = /(https?:\/\/(?:www\.|m\.)?(?:youtube\.com\/watch\?[^\s]*v=|youtu\.be\/)([A-Za-z0-9_-]{6,})[^\s]*)/i;
  text.split(/\r?\n/).forEach((raw, idx) => {
    const line = raw.trim();
    if (!line) return;
    const m = line.match(urlRe);
    if (!m) { skipped.push(idx + 1); return; }
    const url = m[1];
    const videoId = m[2];
    // Title = everything before the URL, trimming any trailing " - " separator.
    let title = line.slice(0, line.indexOf(url)).trim();
    title = title.replace(/[-–—:|]\s*$/, "").trim();
    if (!title) { skipped.push(idx + 1); return; }
    parsed.push({ title, youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`, videoId });
  });
  return { parsed, skipped };
}

export async function bulkInsertLessons(unitId: string, lessons: ParsedBulkLesson[]) {
  if (lessons.length === 0) return { error: null, count: 0 };
  const { data: existing } = await supabase.from("lessons").select("sort_order").eq("unit_id", unitId).order("sort_order", { ascending: false }).limit(1);
  const startOrder = existing && existing[0] ? (Number(existing[0].sort_order) || 0) + 1 : 0;
  const uuid = () => (globalThis.crypto as any)?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
  const rows = lessons.map((l, i) => ({
    id: uuid(),
    unit_id: unitId,
    title: l.title,
    youtube_url: l.youtubeUrl,
    duration: "",
    sort_order: startOrder + i,
  }));
  const { error } = await supabase.from("lessons").insert(rows);
  return { error, count: rows.length };
}

export async function createUnit(courseId: string, title: string) {
  const uuid = () => (globalThis.crypto as any)?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
  const { data: existing } = await supabase.from("units").select("sort_order").eq("course_id", courseId).order("sort_order", { ascending: false }).limit(1);
  const sortOrder = existing && existing[0] ? (Number(existing[0].sort_order) || 0) + 1 : 0;
  const id = uuid();
  const { error } = await supabase.from("units").insert({ id, course_id: courseId, title: title.trim() || "New Unit", sort_order: sortOrder });
  return { id, error };
}

// ---------- Reviews ----------
export interface Review {
  id: string;
  courseId: string;
  studentId: string;
  studentName: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

function mapReview(row: any, nameById?: Map<string, string>): Review {
  return {
    id: row.id,
    courseId: row.course_id,
    studentId: row.student_id,
    studentName: nameById?.get(row.student_id) || "Student",
    rating: Number(row.rating) || 0,
    comment: row.comment || "",
    isApproved: !!row.is_approved,
    createdAt: row.created_at || "",
    updatedAt: row.updated_at || "",
  };
}

async function hydrateReviewNames(rows: any[]): Promise<Review[]> {
  if (rows.length === 0) return [];
  const ids = Array.from(new Set(rows.map((r: any) => r.student_id).filter(Boolean)));
  const { data: students } = await supabase.from("students").select("id, name, email").in("id", ids);
  const map = new Map<string, string>();
  for (const s of students || []) map.set(s.id, s.name || s.email || "Student");
  return rows.map((r) => mapReview(r, map));
}

export async function fetchApprovedReviews(courseId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("course_id", courseId)
    .eq("is_approved", true)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return hydrateReviewNames(data);
}

export async function fetchMyReviewForCourse(courseId: string, studentId: string): Promise<Review | null> {
  const { data } = await supabase
    .from("reviews")
    .select("*")
    .eq("course_id", courseId)
    .eq("student_id", studentId)
    .maybeSingle();
  return data ? mapReview(data) : null;
}

export async function fetchAllReviews(): Promise<Review[]> {
  const { data, error } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
  if (error || !data) return [];
  return hydrateReviewNames(data);
}

export async function submitReview(courseId: string, studentId: string, rating: number, comment: string) {
  return supabase.from("reviews").upsert(
    { course_id: courseId, student_id: studentId, rating, comment, is_approved: false, updated_at: new Date().toISOString() },
    { onConflict: "course_id,student_id" }
  );
}

export async function approveReview(id: string) {
  return supabase.from("reviews").update({ is_approved: true }).eq("id", id);
}

export async function rejectReview(id: string) {
  return supabase.from("reviews").delete().eq("id", id);
}

