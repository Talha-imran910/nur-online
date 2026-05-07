/**
 * Reactive localStorage-based store that syncs data across all views.
 * Since there's no backend, this acts as our "database".
 */
import { courses as defaultCourses, sampleStudents as defaultStudents, sampleAssignments as defaultAssignments, Course, Student, Assignment, Lesson } from "./mock-data";

const KEYS = {
  courses: "elaf_courses",
  students: "elaf_students",
  assignments: "elaf_assignments",
  liveClass: "elaf_live_class",
} as const;

// ── Helpers ──────────────────────────────────────────────
function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
  // Dispatch a custom event so other open tabs/components can react
  window.dispatchEvent(new CustomEvent("elaf_store_update", { detail: { key } }));
}

// ── Courses ──────────────────────────────────────────────
export function getCourses(): Course[] {
  return read(KEYS.courses, defaultCourses);
}

export function saveCourses(courses: Course[]) {
  write(KEYS.courses, courses);
}

export function addCourse(course: Course) {
  const list = getCourses();
  list.push(course);
  saveCourses(list);
}

export function deleteCourse(id: string) {
  saveCourses(getCourses().filter((c) => c.id !== id));
}

export function updateCourse(id: string, updates: Partial<Course>) {
  saveCourses(getCourses().map((c) => (c.id === id ? { ...c, ...updates } : c)));
}

export function addLessonToCourse(courseId: string, unitId: string, lesson: Lesson) {
  const courses = getCourses();
  const course = courses.find((c) => c.id === courseId);
  if (!course) return;
  const unit = course.units.find((u) => u.id === unitId);
  if (unit) {
    unit.lessons.push(lesson);
  } else {
    // Create a new unit
    course.units.push({ id: unitId, title: "New Lessons", lessons: [lesson] });
  }
  course.lessons = course.units.reduce((acc, u) => acc + u.lessons.length, 0);
  saveCourses(courses);
}

export function removeLessonFromCourse(courseId: string, lessonId: string) {
  const courses = getCourses();
  const course = courses.find((c) => c.id === courseId);
  if (!course) return;
  course.units.forEach((u) => {
    u.lessons = u.lessons.filter((l) => l.id !== lessonId);
  });
  course.lessons = course.units.reduce((acc, u) => acc + u.lessons.length, 0);
  saveCourses(courses);
}

export function updateLessonInCourse(courseId: string, lessonId: string, updates: Partial<Lesson>) {
  const courses = getCourses();
  const course = courses.find((c) => c.id === courseId);
  if (!course) return;
  course.units.forEach((u) => {
    u.lessons = u.lessons.map((l) => (l.id === lessonId ? { ...l, ...updates } : l));
  });
  saveCourses(courses);
}

export function unenrollStudent(studentEmail: string, courseId: string) {
  const students = getStudents();
  const student = students.find((s) => s.email === studentEmail);
  if (student) {
    student.enrolledCourses = student.enrolledCourses.filter((id) => id !== courseId);
    delete student.progress[courseId];
    saveStudents(students);
  }
}

// ── Students ─────────────────────────────────────────────
export function getStudents(): Student[] {
  return read(KEYS.students, defaultStudents);
}

export function saveStudents(students: Student[]) {
  write(KEYS.students, students);
}

export function addStudent(student: Student) {
  const list = getStudents();
  // Prevent duplicates by email
  if (list.some((s) => s.email === student.email)) return;
  list.push(student);
  saveStudents(list);
}

export function enrollStudent(studentEmail: string, courseId: string) {
  const students = getStudents();
  let student = students.find((s) => s.email.toLowerCase() === studentEmail.toLowerCase());
  if (!student) {
    // Auto-create a student record if missing (e.g., user logged in without registering)
    let name = studentEmail.split("@")[0];
    try {
      const u = JSON.parse(localStorage.getItem("elaf_user") || "{}");
      if (u?.name) name = u.name;
    } catch {}
    student = {
      id: `s-${Date.now()}`,
      name,
      email: studentEmail,
      enrolledCourses: [],
      progress: {},
      joinedDate: new Date().toISOString().split("T")[0],
    };
    students.push(student);
  }
  if (!student.enrolledCourses.includes(courseId)) {
    student.enrolledCourses.push(courseId);
    student.progress[courseId] = 0;
  }
  saveStudents(students);
}

/** Ensure a student record exists for the given user (used after login) */
export function ensureStudent(user: { email: string; name?: string; phone?: string }) {
  if (!user?.email) return;
  const students = getStudents();
  const exists = students.find((s) => s.email.toLowerCase() === user.email.toLowerCase());
  if (exists) return;
  const freeCourses = getCourses().filter((c) => c.isFree).map((c) => c.id);
  students.push({
    id: `s-${Date.now()}`,
    name: user.name || user.email.split("@")[0],
    email: user.email,
    enrolledCourses: freeCourses,
    progress: Object.fromEntries(freeCourses.map((id) => [id, 0])),
    joinedDate: new Date().toISOString().split("T")[0],
  });
  saveStudents(students);
}

// ── Assignments ──────────────────────────────────────────
export function getAssignments(): Assignment[] {
  return read(KEYS.assignments, defaultAssignments);
}

export function saveAssignments(assignments: Assignment[]) {
  write(KEYS.assignments, assignments);
}

// ── Live Class ───────────────────────────────────────────
export interface LiveClass {
  id: string;
  title: string;
  link: string;
  startTime: string;
  isLive: boolean;
  courseId?: string; // Target specific course
}

export function getLiveClass(): LiveClass | null {
  try {
    const data = localStorage.getItem(KEYS.liveClass);
    if (!data) return null;
    const parsed = JSON.parse(data) as LiveClass;
    return parsed.isLive ? parsed : null;
  } catch {
    return null;
  }
}

export function setLiveClass(liveClass: LiveClass | null) {
  if (liveClass) {
    write(KEYS.liveClass, liveClass);
  } else {
    localStorage.removeItem(KEYS.liveClass);
    window.dispatchEvent(new CustomEvent("elaf_store_update", { detail: { key: KEYS.liveClass } }));
  }
}

// ── Hook helper: subscribe to store changes ──────────────
export function onStoreUpdate(callback: () => void) {
  const handler = () => callback();
  window.addEventListener("elaf_store_update", handler);
  window.addEventListener("storage", handler); // cross-tab sync
  return () => {
    window.removeEventListener("elaf_store_update", handler);
    window.removeEventListener("storage", handler);
  };
}
