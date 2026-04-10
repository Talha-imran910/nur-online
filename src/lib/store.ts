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
  const student = students.find((s) => s.email === studentEmail);
  if (student && !student.enrolledCourses.includes(courseId)) {
    student.enrolledCourses.push(courseId);
    student.progress[courseId] = 0;
  }
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
