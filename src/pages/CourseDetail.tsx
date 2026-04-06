import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { courses, subjects } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Users, BookOpen, PlayCircle, CheckCircle, FileText, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import quranStudy from "@/assets/quran-study.jpg";

export default function CourseDetail() {
  const { courseId } = useParams();
  const course = courses.find((c) => c.id === courseId);
  const [openUnits, setOpenUnits] = useState<string[]>(course?.units.map((u) => u.id) || []);

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-3xl font-bold">Course Not Found</h1>
            <Link to="/courses" className="text-primary mt-4 inline-block">← Back to Courses</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const subject = subjects.find((s) => s.id === course.subject);
  const totalLessons = course.units.reduce((acc, u) => acc + u.lessons.length, 0);

  const toggleUnit = (id: string) => {
    setOpenUnits((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0">
          <img src={quranStudy} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 gradient-hero opacity-90" />
        </div>
        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="max-w-3xl">
            <div className="flex gap-2 mb-4">
              <Badge className="bg-gold/20 text-gold border-gold/30">{subject?.icon} {subject?.name}</Badge>
              <Badge className={course.isFree ? "bg-emerald/20 text-emerald-light border-emerald/30" : "bg-gold/20 text-gold border-gold/30"}>
                {course.isFree ? "Free" : `$${course.price}`}
              </Badge>
              <Badge className="bg-cream/10 text-cream/80 border-cream/20">{course.level}</Badge>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-cream">{course.title}</h1>
            <p className="mt-4 text-cream/70 text-lg leading-relaxed">{course.description}</p>

            <div className="mt-6 flex flex-wrap gap-6 text-cream/60 text-sm">
              <span className="flex items-center gap-2"><BookOpen className="h-4 w-4" />{totalLessons} lessons</span>
              <span className="flex items-center gap-2"><Clock className="h-4 w-4" />{course.duration}</span>
              <span className="flex items-center gap-2"><Users className="h-4 w-4" />{course.students} students</span>
              <span className="flex items-center gap-2"><Star className="h-4 w-4 text-gold" />{course.rating} rating</span>
            </div>

            <div className="mt-8 flex gap-4">
              <Link to="/login">
                <Button variant="hero" size="lg">Enroll Now</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-8">Course Curriculum</h2>

          <div className="space-y-4">
            {course.units.map((unit) => (
              <div key={unit.id} className="glass-card rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleUnit(unit.id)}
                  className="w-full flex items-center justify-between p-5 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {openUnits.includes(unit.id) ? <ChevronDown className="h-5 w-5 text-primary" /> : <ChevronRight className="h-5 w-5 text-muted-foreground" />}
                    <h3 className="font-serif text-lg font-bold text-foreground">{unit.title}</h3>
                  </div>
                  <span className="text-sm text-muted-foreground">{unit.lessons.length} lessons</span>
                </button>

                {openUnits.includes(unit.id) && (
                  <div className="border-t border-border">
                    {unit.lessons.map((lesson) => (
                      <div key={lesson.id} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/20 transition-colors border-b border-border/50 last:border-b-0">
                        <PlayCircle className="h-5 w-5 text-primary shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{lesson.title}</p>
                          <p className="text-xs text-muted-foreground">{lesson.duration}</p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          {lesson.hasQuiz && <Badge variant="secondary" className="text-xs">Quiz</Badge>}
                          {lesson.hasAssignment && <Badge variant="secondary" className="text-xs">Assignment</Badge>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Instructor */}
          <div className="mt-16 glass-card rounded-xl p-8">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Your Instructor</h2>
            <div className="flex items-start gap-6">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-3xl shrink-0">
                🧕
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-foreground">{course.instructor}</h3>
                <p className="text-muted-foreground mt-2 leading-relaxed">
                  A dedicated Islamic scholar with years of experience in teaching Quran, Hadith, and Islamic studies.
                  Passionate about making authentic Islamic knowledge accessible to students of all levels.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
