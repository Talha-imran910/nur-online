/**
 * Static UI constants + TypeScript types only.
 * Runtime data (courses, students, assignments) comes from Supabase via src/lib/db.ts.
 */

// Re-export UI types for backwards compatibility with existing components.
export type { Course, Unit, Lesson, StudentRow as Student, AssignmentRow as Assignment, LiveClass } from "@/lib/db";

export interface Quiz {
  id: string;
  lessonId: string;
  title: string;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export const INSTRUCTOR = {
  name: "Ustadha Afshan Imran",
  academy: "Elaf-ul-Quran Academy",
  bio: "Ustadha Afshan Imran is the founder of Elaf-ul-Quran Academy — a platform dedicated to spreading the light of the Holy Quran with love, understanding, and spiritual guidance. With years of devotion to Quranic education, she teaches Nazra Quran with proper Tajweed, Tafseer with easy Urdu translation, and spiritual Tarbiyat including Duas, Sunnah practices, and Islamic values. Her warm, patient teaching style creates a nurturing environment for students of all ages — from young children to adults, beginners to advanced learners. She offers flexible online classes worldwide 🌍 in a female and kids-friendly environment.",
  specialties: [
    "Nazra Quran with proper Tajweed",
    "Tafseer & Translation in easy Urdu",
    "Spiritual Tarbiyat (Duas, Sunnah life, Islamic values)",
    "Qaida, Namaz, Daily Duas, Surahs Memorization",
  ],
};

export const subjects = [
  { id: "nazra", name: "Nazra Quran", icon: "📖", count: 0 },
  { id: "tajweed", name: "Tajweed", icon: "🎙️", count: 0 },
  { id: "tafseer", name: "Tafseer", icon: "📜", count: 0 },
  { id: "qaida", name: "Qaida & Basics", icon: "✏️", count: 0 },
  { id: "memorization", name: "Memorization", icon: "🧠", count: 0 },
  { id: "tarbiyat", name: "Spiritual Tarbiyat", icon: "🤲", count: 0 },
];

export const testimonials = [
  { name: "Aisha R.", text: "Ustadha Afshan's patience and love for teaching is truly inspiring. My daughter went from not knowing the alphabet to reading Quran fluently in just a few months. JazakAllah Khair!", rating: 5 },
  { name: "Khadijah A.", text: "The Tafseer course opened my eyes to the depth of Allah's words. Every lesson feels like a spiritual journey. I cry tears of gratitude after every class.", rating: 5 },
  { name: "Maryam K.", text: "As a working mother, the flexible timing is a blessing. The Tajweed course helped me correct years of incorrect recitation. Highly recommended for everyone!", rating: 5 },
  { name: "Zainab H.", text: "SubhanAllah, the Daily Duas course has transformed my daily routine. My children now recite Duas before eating, sleeping, and travelling. Beautiful experience!", rating: 5 },
];

// Static fallback quiz used by CoursePlayer demo. Replace with real DB-backed quizzes later.
export const sampleQuiz: Quiz = {
  id: "q1",
  lessonId: "demo",
  title: "Sample Quiz",
  questions: [
    { id: "qq1", question: "How many letters are in the Arabic alphabet?", options: ["26", "28", "30", "32"], correctAnswer: 1 },
    { id: "qq2", question: "Which direction is Arabic written?", options: ["Left to right", "Right to left", "Top to bottom", "Bottom to top"], correctAnswer: 1 },
  ],
};
