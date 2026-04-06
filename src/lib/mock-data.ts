export interface Course {
  id: string;
  title: string;
  description: string;
  subject: string;
  thumbnail: string;
  instructor: string;
  duration: string;
  lessons: number;
  students: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  isFree: boolean;
  price?: number;
  rating: number;
  units: Unit[];
}

export interface Unit {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  youtubeUrl: string;
  duration: string;
  completed?: boolean;
  hasQuiz?: boolean;
  hasAssignment?: boolean;
}

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

export interface Assignment {
  id: string;
  lessonId: string;
  title: string;
  description: string;
  dueDate: string;
  submitted?: boolean;
  grade?: number;
  feedback?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  enrolledCourses: string[];
  progress: Record<string, number>;
  joinedDate: string;
}

export const subjects = [
  { id: "quran", name: "Quran Studies", icon: "📖", count: 4 },
  { id: "hadith", name: "Hadith Sciences", icon: "📜", count: 3 },
  { id: "fiqh", name: "Fiqh (Jurisprudence)", icon: "⚖️", count: 3 },
  { id: "arabic", name: "Arabic Language", icon: "🔤", count: 2 },
  { id: "seerah", name: "Seerah (Prophet's Life)", icon: "🕌", count: 2 },
  { id: "aqeedah", name: "Aqeedah (Theology)", icon: "🌙", count: 2 },
];

export const courses: Course[] = [
  {
    id: "quran-101",
    title: "Quran Recitation for Beginners",
    description: "Learn the fundamentals of Quran recitation with proper Tajweed rules. This course covers the Arabic alphabet, basic pronunciation, and essential Tajweed rules to help you read the Quran beautifully.",
    subject: "quran",
    thumbnail: "",
    instructor: "Ustadha Fatima",
    duration: "12 weeks",
    lessons: 24,
    students: 156,
    level: "Beginner",
    isFree: true,
    rating: 4.9,
    units: [
      {
        id: "u1",
        title: "Introduction to Arabic Letters",
        lessons: [
          { id: "l1", title: "The Arabic Alphabet - Part 1", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "15:30", completed: true, hasQuiz: true },
          { id: "l2", title: "The Arabic Alphabet - Part 2", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "18:45", completed: true },
          { id: "l3", title: "Connecting Letters", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "20:00", hasAssignment: true },
        ],
      },
      {
        id: "u2",
        title: "Basic Tajweed Rules",
        lessons: [
          { id: "l4", title: "Introduction to Tajweed", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "22:15", hasQuiz: true },
          { id: "l5", title: "Noon Sakinah Rules", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "25:00" },
          { id: "l6", title: "Meem Sakinah Rules", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "19:30", hasQuiz: true, hasAssignment: true },
        ],
      },
    ],
  },
  {
    id: "hadith-intro",
    title: "Introduction to Hadith Sciences",
    description: "Understand the methodology of Hadith classification, authentication, and the great scholars who preserved the prophetic traditions. Study the six major Hadith collections.",
    subject: "hadith",
    thumbnail: "",
    instructor: "Ustadha Fatima",
    duration: "8 weeks",
    lessons: 16,
    students: 89,
    level: "Intermediate",
    isFree: false,
    price: 49,
    rating: 4.7,
    units: [
      {
        id: "u3",
        title: "Foundations of Hadith",
        lessons: [
          { id: "l7", title: "What is Hadith?", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "30:00", hasQuiz: true },
          { id: "l8", title: "Chain of Narration", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "28:00" },
        ],
      },
    ],
  },
  {
    id: "fiqh-salah",
    title: "Fiqh of Salah (Prayer)",
    description: "A comprehensive study of the Islamic prayer including its pillars, obligations, and recommended acts according to the four major schools of thought.",
    subject: "fiqh",
    thumbnail: "",
    instructor: "Ustadha Fatima",
    duration: "6 weeks",
    lessons: 12,
    students: 210,
    level: "Beginner",
    isFree: true,
    rating: 4.8,
    units: [
      {
        id: "u4",
        title: "Prerequisites of Salah",
        lessons: [
          { id: "l9", title: "Purification (Wudu)", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "20:00", hasQuiz: true },
          { id: "l10", title: "Times of Prayer", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "15:00", hasAssignment: true },
        ],
      },
    ],
  },
  {
    id: "arabic-basics",
    title: "Arabic for Quran Understanding",
    description: "Learn essential Arabic grammar and vocabulary to understand the Quran directly. Focus on the most frequently used words and grammatical structures in the Holy Quran.",
    subject: "arabic",
    thumbnail: "",
    instructor: "Ustadha Fatima",
    duration: "16 weeks",
    lessons: 32,
    students: 134,
    level: "Beginner",
    isFree: false,
    price: 79,
    rating: 4.9,
    units: [
      {
        id: "u5",
        title: "Essential Vocabulary",
        lessons: [
          { id: "l11", title: "Most Common Quran Words", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "25:00", hasQuiz: true },
          { id: "l12", title: "Pronouns & Prepositions", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "22:00" },
        ],
      },
    ],
  },
  {
    id: "seerah-101",
    title: "Life of Prophet Muhammad ﷺ",
    description: "An inspiring journey through the life of the Prophet Muhammad ﷺ from birth to the establishment of the Muslim community in Madinah.",
    subject: "seerah",
    thumbnail: "",
    instructor: "Ustadha Fatima",
    duration: "10 weeks",
    lessons: 20,
    students: 178,
    level: "Beginner",
    isFree: true,
    rating: 4.9,
    units: [
      {
        id: "u6",
        title: "Early Life",
        lessons: [
          { id: "l13", title: "Arabia Before Islam", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "35:00", hasQuiz: true },
          { id: "l14", title: "Birth & Childhood", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "30:00" },
        ],
      },
    ],
  },
  {
    id: "aqeedah-101",
    title: "Fundamentals of Islamic Belief",
    description: "Study the six pillars of faith and the core theological concepts that every Muslim should know, presented in a clear and engaging manner.",
    subject: "aqeedah",
    thumbnail: "",
    instructor: "Ustadha Fatima",
    duration: "8 weeks",
    lessons: 16,
    students: 95,
    level: "Intermediate",
    isFree: false,
    price: 39,
    rating: 4.6,
    units: [
      {
        id: "u7",
        title: "Pillars of Faith",
        lessons: [
          { id: "l15", title: "Belief in Allah", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "40:00", hasQuiz: true },
          { id: "l16", title: "Belief in Angels", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "28:00", hasAssignment: true },
        ],
      },
    ],
  },
];

export const sampleQuiz: Quiz = {
  id: "q1",
  lessonId: "l1",
  title: "Arabic Alphabet Quiz",
  questions: [
    {
      id: "qq1",
      question: "How many letters are in the Arabic alphabet?",
      options: ["26", "28", "30", "32"],
      correctAnswer: 1,
    },
    {
      id: "qq2",
      question: "Which direction is Arabic written?",
      options: ["Left to right", "Right to left", "Top to bottom", "Bottom to top"],
      correctAnswer: 1,
    },
    {
      id: "qq3",
      question: "What is the first letter of the Arabic alphabet?",
      options: ["Ba", "Alif", "Ta", "Tha"],
      correctAnswer: 1,
    },
  ],
};

export const sampleAssignments: Assignment[] = [
  {
    id: "a1",
    lessonId: "l3",
    title: "Practice Connecting Letters",
    description: "Write out the first 10 letters of the Arabic alphabet in their connected forms. Submit a photo or PDF of your handwriting practice.",
    dueDate: "2026-04-15",
  },
  {
    id: "a2",
    lessonId: "l6",
    title: "Identify Tajweed Rules",
    description: "Listen to the attached recitation and identify all instances of Idghaam, Ikhfaa, and Iqlaab in Surah Al-Baqarah verses 1-5.",
    dueDate: "2026-04-20",
    submitted: true,
    grade: 92,
    feedback: "Excellent work! You correctly identified most rules. Review Ikhfaa with Shaddah for improvement.",
  },
];

export const sampleStudents: Student[] = [
  { id: "s1", name: "Aisha Rahman", email: "aisha@email.com", enrolledCourses: ["quran-101", "fiqh-salah"], progress: { "quran-101": 65, "fiqh-salah": 30 }, joinedDate: "2026-01-15" },
  { id: "s2", name: "Omar Hassan", email: "omar@email.com", enrolledCourses: ["quran-101", "arabic-basics"], progress: { "quran-101": 40, "arabic-basics": 20 }, joinedDate: "2026-02-01" },
  { id: "s3", name: "Khadijah Ali", email: "khadijah@email.com", enrolledCourses: ["seerah-101", "hadith-intro"], progress: { "seerah-101": 80, "hadith-intro": 55 }, joinedDate: "2026-01-20" },
  { id: "s4", name: "Yusuf Ahmed", email: "yusuf@email.com", enrolledCourses: ["quran-101"], progress: { "quran-101": 90 }, joinedDate: "2026-03-01" },
  { id: "s5", name: "Maryam Khan", email: "maryam@email.com", enrolledCourses: ["fiqh-salah", "aqeedah-101"], progress: { "fiqh-salah": 100, "aqeedah-101": 45 }, joinedDate: "2026-02-15" },
];

export const testimonials = [
  { name: "Aisha R.", text: "This platform transformed my Quran learning journey. The structured approach and clear explanations make complex topics accessible.", rating: 5 },
  { name: "Omar H.", text: "As a revert, I found the Fiqh courses incredibly helpful. The teacher explains everything with patience and wisdom.", rating: 5 },
  { name: "Khadijah A.", text: "The Seerah course brought tears to my eyes. Such a beautiful and engaging way to learn about our beloved Prophet ﷺ.", rating: 5 },
];
