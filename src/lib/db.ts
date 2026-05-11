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

function mapCourseRow(row: any, units: Unit[] = []): Course {
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
    students: 0,
    instructor: INSTRUCTOR_NAME,
  };
}

// ---------- Courses ----------
export async function fetchPublishedCourses(): Promise<Course[]> {
  const { data: courses, error } = await supabase
    .from("courses")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });
  if (error || !courses) return [];
  return Promise.all(courses.map(async (c) => mapCourseRow(c, await fetchUnitsForCourse(c.id))));
}

export async function fetchAllCourses(): Promise<Course[]> {
  const { data, error } = await supabase.from("courses").select("*").order("created_at", { ascending: false });
  if (error || !data) return [];
  return Promise.all(data.map(async (c) => mapCourseRow(c, await fetchUnitsForCourse(c.id))));
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
  const id = `course-${Date.now()}`;
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
    const newUnitId = `unit-${Date.now()}`;
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
    id: `lesson-${Date.now()}`,
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
  if (error || !data) return [];
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
  // Pull all students rows + their enrollments
  const { data: rows } = await supabase.from("students").select("*").order("name", { ascending: true });
  if (!rows) return [];
  const ids = rows.map((r: any) => r.id);
  const { data: enrolls } = ids.length
    ? await supabase.from("enrollments").select("student_id, course_id, progress").in("student_id", ids)
    : { data: [] as any[] };
  return rows.map((r: any) => {
    const myEnrolls = (enrolls || []).filter((e: any) => e.student_id === r.id);
    return {
      id: r.id,
      name: r.name,
      email: r.email,
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
  // Stop any active live first
  await supabase.from("live_class").update({ is_live: false }).eq("is_live", true);
  return supabase.from("live_class").insert({
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
