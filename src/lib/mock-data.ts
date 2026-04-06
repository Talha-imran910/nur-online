import quranStudy from "@/assets/quran-study.jpg";
import quranLearning from "@/assets/quran-learning.jpg";
import quranCalligraphy from "@/assets/quran-calligraphy.jpg";
import tajweedCourse from "@/assets/tajweed-course.jpg";

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
  courseId: string;
  title: string;
  description: string;
  dueDate: string;
  submitted?: boolean;
  submissionText?: string;
  submissionFile?: string;
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
  { id: "nazra", name: "Nazra Quran", icon: "📖", count: 2 },
  { id: "tajweed", name: "Tajweed", icon: "🎙️", count: 2 },
  { id: "tafseer", name: "Tafseer", icon: "📜", count: 2 },
  { id: "qaida", name: "Qaida & Basics", icon: "✏️", count: 1 },
  { id: "memorization", name: "Memorization", icon: "🧠", count: 1 },
  { id: "tarbiyat", name: "Spiritual Tarbiyat", icon: "🤲", count: 1 },
];

export const courses: Course[] = [
  {
    id: "nazra-beginners",
    title: "Nazra Quran — From Qaida to Fluent Reading",
    description: "Start from the very basics of Qaida Noorania and progress to reading the Holy Quran fluently with proper pronunciation. Ideal for children and adult beginners in a supportive, patient environment.",
    subject: "nazra",
    thumbnail: quranLearning,
    instructor: INSTRUCTOR.name,
    duration: "16 weeks",
    lessons: 32,
    students: 245,
    level: "Beginner",
    isFree: true,
    rating: 4.9,
    units: [
      {
        id: "n-u1",
        title: "Arabic Alphabet & Qaida Basics",
        lessons: [
          { id: "n-l1", title: "Introduction to Arabic Letters (Huroof)", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "18:00", completed: true, hasQuiz: true },
          { id: "n-l2", title: "Harakat — Fatha, Kasra, Damma", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "22:00", completed: true, hasAssignment: true },
          { id: "n-l3", title: "Tanween & Sukoon", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "20:00", hasQuiz: true },
          { id: "n-l4", title: "Connecting Letters & Reading Practice", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "25:00", hasAssignment: true },
        ],
      },
      {
        id: "n-u2",
        title: "Surah Reading Practice",
        lessons: [
          { id: "n-l5", title: "Surah Al-Fatiha — Word by Word", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "30:00", hasQuiz: true },
          { id: "n-l6", title: "Last 10 Surahs — Practice Session", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "35:00", hasAssignment: true },
          { id: "n-l7", title: "Surah Al-Baqarah — First 5 Ayaat", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "28:00" },
        ],
      },
      {
        id: "n-u3",
        title: "Building Reading Fluency",
        lessons: [
          { id: "n-l8", title: "Speed Reading Exercises", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "20:00" },
          { id: "n-l9", title: "Common Mistakes in Recitation", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "22:00", hasQuiz: true },
        ],
      },
    ],
  },
  {
    id: "tajweed-mastery",
    title: "Tajweed Mastery — Beautify Your Recitation",
    description: "Master the art of Tajweed with comprehensive lessons on Makharij, Sifaat, and all essential rules. Learn to recite the Quran as it was revealed — with beauty, precision, and devotion.",
    subject: "tajweed",
    thumbnail: tajweedCourse,
    instructor: INSTRUCTOR.name,
    duration: "12 weeks",
    lessons: 24,
    students: 189,
    level: "Intermediate",
    isFree: false,
    price: 49,
    rating: 4.8,
    units: [
      {
        id: "t-u1",
        title: "Makharij al-Huroof (Articulation Points)",
        lessons: [
          { id: "t-l1", title: "Throat Letters (Halqi)", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "25:00", hasQuiz: true },
          { id: "t-l2", title: "Tongue Letters (Lisani)", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "28:00", hasAssignment: true },
          { id: "t-l3", title: "Lip Letters (Shafawi)", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "20:00", hasQuiz: true },
        ],
      },
      {
        id: "t-u2",
        title: "Essential Tajweed Rules",
        lessons: [
          { id: "t-l4", title: "Noon Sakinah & Tanween Rules", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "30:00", hasQuiz: true },
          { id: "t-l5", title: "Meem Sakinah Rules", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "25:00" },
          { id: "t-l6", title: "Madd (Elongation) Rules", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "28:00", hasAssignment: true },
          { id: "t-l7", title: "Qalqala & Ghunna", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "22:00", hasQuiz: true },
        ],
      },
      {
        id: "t-u3",
        title: "Advanced Application",
        lessons: [
          { id: "t-l8", title: "Waqf & Ibtida (Stopping & Starting)", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "30:00" },
          { id: "t-l9", title: "Full Surah Recitation with Tajweed", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "35:00", hasAssignment: true },
        ],
      },
    ],
  },
  {
    id: "tafseer-understanding",
    title: "Tafseer — Understand the Message of Allah",
    description: "Go beyond recitation and understand what Allah is saying to you. This course covers Tafseer of selected Surahs with easy Urdu translation, spiritual reflections, and lessons for daily life.",
    subject: "tafseer",
    thumbnail: quranCalligraphy,
    instructor: INSTRUCTOR.name,
    duration: "20 weeks",
    lessons: 40,
    students: 156,
    level: "Intermediate",
    isFree: false,
    price: 69,
    rating: 4.9,
    units: [
      {
        id: "tf-u1",
        title: "Surah Al-Fatiha — The Opening",
        lessons: [
          { id: "tf-l1", title: "Introduction to Tafseer Sciences", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "35:00", hasQuiz: true },
          { id: "tf-l2", title: "Tafseer of Al-Fatiha — Verses 1-4", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "40:00", hasAssignment: true },
          { id: "tf-l3", title: "Tafseer of Al-Fatiha — Verses 5-7", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "38:00", hasQuiz: true },
        ],
      },
      {
        id: "tf-u2",
        title: "Surah Yaseen — The Heart of the Quran",
        lessons: [
          { id: "tf-l4", title: "Background & Context of Surah Yaseen", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "30:00" },
          { id: "tf-l5", title: "Lessons from Surah Yaseen — Part 1", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "35:00", hasQuiz: true },
          { id: "tf-l6", title: "Lessons from Surah Yaseen — Part 2", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "32:00", hasAssignment: true },
        ],
      },
    ],
  },
  {
    id: "daily-duas",
    title: "Daily Duas & Sunnah Practices",
    description: "Learn essential daily Duas, Namaz (Salah) procedures, and beautiful Sunnah practices that bring you closer to Allah in every moment of your day.",
    subject: "tarbiyat",
    thumbnail: quranStudy,
    instructor: INSTRUCTOR.name,
    duration: "6 weeks",
    lessons: 12,
    students: 312,
    level: "Beginner",
    isFree: true,
    rating: 4.9,
    units: [
      {
        id: "dd-u1",
        title: "Morning & Evening Adhkar",
        lessons: [
          { id: "dd-l1", title: "Morning Duas with Translation", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "20:00", hasQuiz: true },
          { id: "dd-l2", title: "Evening Duas with Translation", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "18:00" },
          { id: "dd-l3", title: "Sleeping & Waking Up Duas", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "15:00", hasQuiz: true },
        ],
      },
      {
        id: "dd-u2",
        title: "Namaz (Salah) Complete Guide",
        lessons: [
          { id: "dd-l4", title: "Wudu Step by Step", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "20:00", hasAssignment: true },
          { id: "dd-l5", title: "Complete Salah with Duas", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "30:00", hasQuiz: true },
        ],
      },
    ],
  },
  {
    id: "surah-memorization",
    title: "Surah Memorization — Hifz Program",
    description: "Memorize selected Surahs with proper Tajweed using proven memorization techniques. Includes revision schedules and recitation practice with the teacher.",
    subject: "memorization",
    thumbnail: quranLearning,
    instructor: INSTRUCTOR.name,
    duration: "24 weeks",
    lessons: 48,
    students: 98,
    level: "Advanced",
    isFree: false,
    price: 89,
    rating: 4.7,
    units: [
      {
        id: "hf-u1",
        title: "Juz Amma — Last Part of Quran",
        lessons: [
          { id: "hf-l1", title: "Memorization Techniques & Tips", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "25:00", hasQuiz: true },
          { id: "hf-l2", title: "Surah An-Nas to Al-Ikhlas", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "30:00", hasAssignment: true },
          { id: "hf-l3", title: "Surah Al-Falaq to Al-Kawthar", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "28:00" },
        ],
      },
    ],
  },
];

export const sampleQuiz: Quiz = {
  id: "q1",
  lessonId: "n-l1",
  title: "Arabic Letters Quiz",
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
      options: ["Ba (ب)", "Alif (ا)", "Ta (ت)", "Tha (ث)"],
      correctAnswer: 1,
    },
    {
      id: "qq4",
      question: "What does 'Fatha' sound like?",
      options: ["'oo' sound", "'ee' sound", "'ah' sound", "'oh' sound"],
      correctAnswer: 2,
    },
  ],
};

export const sampleAssignments: Assignment[] = [
  {
    id: "a1",
    lessonId: "n-l2",
    courseId: "nazra-beginners",
    title: "Practice Harakat Writing",
    description: "Write out each Arabic letter with Fatha, Kasra, and Damma. Submit a clear photo or PDF of your handwriting practice sheet.",
    dueDate: "2026-04-15",
  },
  {
    id: "a2",
    lessonId: "n-l4",
    courseId: "nazra-beginners",
    title: "Connected Letters Practice",
    description: "Practice connecting letters into words. Write the following words in Arabic: Bismillah, Alhamdulillah, SubhanAllah. Submit your work.",
    dueDate: "2026-04-20",
    submitted: true,
    submissionText: "I have practiced all the words and attached my handwriting sheet.",
    grade: 95,
    feedback: "MashaAllah! Beautiful handwriting. Your letter connections are very clean. Keep practicing daily!",
  },
  {
    id: "a3",
    lessonId: "t-l2",
    courseId: "tajweed-mastery",
    title: "Record Your Recitation",
    description: "Record yourself reciting Surah Al-Fatiha with proper Tajweed. Pay attention to the Makharij of each letter. Upload your audio/video recording.",
    dueDate: "2026-04-25",
  },
  {
    id: "a4",
    lessonId: "tf-l2",
    courseId: "tafseer-understanding",
    title: "Reflection on Al-Fatiha",
    description: "Write a 200-word reflection on what Surah Al-Fatiha means to you personally. How do its verses relate to your daily life?",
    dueDate: "2026-04-30",
    submitted: true,
    submissionText: "Surah Al-Fatiha is the opening chapter that we recite in every prayer...",
    grade: 88,
    feedback: "Good reflection, Alhamdulillah! Try to connect the concept of 'Siraat al-Mustaqeem' more deeply to daily decisions.",
  },
];

export const sampleStudents: Student[] = [
  { id: "s1", name: "Aisha Rahman", email: "aisha@email.com", enrolledCourses: ["nazra-beginners", "daily-duas"], progress: { "nazra-beginners": 65, "daily-duas": 30 }, joinedDate: "2026-01-15" },
  { id: "s2", name: "Omar Hassan", email: "omar@email.com", enrolledCourses: ["nazra-beginners", "tajweed-mastery"], progress: { "nazra-beginners": 40, "tajweed-mastery": 20 }, joinedDate: "2026-02-01" },
  { id: "s3", name: "Khadijah Ali", email: "khadijah@email.com", enrolledCourses: ["tafseer-understanding", "surah-memorization"], progress: { "tafseer-understanding": 80, "surah-memorization": 55 }, joinedDate: "2026-01-20" },
  { id: "s4", name: "Yusuf Ahmed", email: "yusuf@email.com", enrolledCourses: ["nazra-beginners"], progress: { "nazra-beginners": 90 }, joinedDate: "2026-03-01" },
  { id: "s5", name: "Maryam Khan", email: "maryam@email.com", enrolledCourses: ["daily-duas", "tajweed-mastery"], progress: { "daily-duas": 100, "tajweed-mastery": 45 }, joinedDate: "2026-02-15" },
  { id: "s6", name: "Zainab Hussain", email: "zainab@email.com", enrolledCourses: ["nazra-beginners", "tafseer-understanding", "daily-duas"], progress: { "nazra-beginners": 75, "tafseer-understanding": 30, "daily-duas": 60 }, joinedDate: "2026-03-10" },
];

export const testimonials = [
  { name: "Aisha R.", text: "Ustadha Afshan's patience and love for teaching is truly inspiring. My daughter went from not knowing the alphabet to reading Quran fluently in just a few months. JazakAllah Khair!", rating: 5 },
  { name: "Khadijah A.", text: "The Tafseer course opened my eyes to the depth of Allah's words. Every lesson feels like a spiritual journey. I cry tears of gratitude after every class.", rating: 5 },
  { name: "Maryam K.", text: "As a working mother, the flexible timing is a blessing. The Tajweed course helped me correct years of incorrect recitation. Highly recommended for everyone!", rating: 5 },
  { name: "Zainab H.", text: "SubhanAllah, the Daily Duas course has transformed my daily routine. My children now recite Duas before eating, sleeping, and travelling. Beautiful experience!", rating: 5 },
];
