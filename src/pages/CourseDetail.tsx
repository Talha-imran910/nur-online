import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { subjects, INSTRUCTOR } from "@/lib/mock-data";
import { getCourses, enrollStudent } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Users, BookOpen, PlayCircle, ChevronDown, ChevronRight, Globe, Heart } from "lucide-react";
import { useState, useMemo } from "react";
import { useScrollReveal } from "@/hooks/use-animations";
import { IslamicDivider, ArabicQuote } from "@/components/IslamicDecorations";
import { useToast } from "@/hooks/use-toast";

export default function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const course = getCourses().find((c) => c.id === courseId);
  const [openUnits, setOpenUnits] = useState<string[]>(course?.units.map((u) => u.id) || []);
  const currRef = useScrollReveal(0.1);
  const instrRef = useScrollReveal();

  const currentUser = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("elaf_user") || "null"); } catch { return null; }
  }, []);

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
  const toggleUnit = (id: string) => setOpenUnits((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const handleEnroll = () => {
    if (!currentUser) {
      navigate("/register");
      return;
    }

    if (!course.isFree && course.price && course.price > 0) {
      // Redirect to WhatsApp for paid courses
      const whatsappNumber = "923001234567"; // Update with real number
      const message = encodeURIComponent(
        `Assalamu Alaikum! I want to enroll in "${course.title}" (${course.price} USD). My name: ${currentUser.name}, Email: ${currentUser.email}`
      );
      window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
      return;
    }

    // Free course — enroll directly
    enrollStudent(currentUser.email, course.id);
    toast({ title: "Enrolled Successfully! 🎉", description: `You're now enrolled in "${course.title}".` });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="relative overflow-hidden islamic-overlay">
        <div className="absolute inset-0 z-0">
          <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 gradient-hero opacity-92" />
        </div>
        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="max-w-3xl animate-slide-up">
            <div className="flex gap-2 mb-4">
              <Badge className="bg-gold/20 text-gold border-gold/30">{subject?.icon} {subject?.name}</Badge>
              <Badge className={course.isFree ? "bg-emerald/20 text-emerald-light border-emerald/30" : "bg-gold/20 text-gold border-gold/30"}>
                {course.isFree ? "Free" : `$${course.price}`}
              </Badge>
              <Badge className="bg-cream/10 text-cream/80 border-cream/20">{course.level}</Badge>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-cream">{course.title}</h1>
            <p className="mt-4 text-cream/65 text-lg leading-relaxed">{course.description}</p>
            <div className="mt-6 flex flex-wrap gap-6 text-cream/50 text-sm">
              <span className="flex items-center gap-2"><BookOpen className="h-4 w-4" />{totalLessons} lessons</span>
              <span className="flex items-center gap-2"><Clock className="h-4 w-4" />{course.duration}</span>
              <span className="flex items-center gap-2"><Users className="h-4 w-4" />{course.students} students</span>
              <span className="flex items-center gap-2"><Star className="h-4 w-4 text-gold" />{course.rating} rating</span>
            </div>
            <div className="mt-8 flex gap-4">
              <Button variant="hero" size="lg" className="animate-pulse-glow" onClick={handleEnroll}>
                {!currentUser ? "Register & Enroll" : course.isFree ? "Enroll Now — Free" : `Buy — $${course.price}`}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div ref={currRef} className="reveal">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-2">Course Curriculum</h2>
            <IslamicDivider className="mb-8" opacity={0.15} />
          </div>

          <div className="space-y-4">
            {course.units.map((unit, ui) => (
              <div key={unit.id} className="glass-card rounded-xl overflow-hidden animate-slide-up" style={{ animationDelay: `${ui * 0.1}s` }}>
                <button onClick={() => toggleUnit(unit.id)} className="w-full flex items-center justify-between p-5 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    {openUnits.includes(unit.id) ? <ChevronDown className="h-5 w-5 text-primary" /> : <ChevronRight className="h-5 w-5 text-muted-foreground" />}
                    <h3 className="font-serif text-lg font-bold text-foreground text-left">{unit.title}</h3>
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

          <div ref={instrRef} className="reveal mt-16 glass-card rounded-2xl p-8">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Your Instructor</h2>
            <div className="flex items-start gap-6">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-4xl shrink-0 animate-float">🧕</div>
              <div>
                <h3 className="font-serif text-xl font-bold text-foreground">{INSTRUCTOR.name}</h3>
                <p className="text-sm text-gold mb-3">{INSTRUCTOR.academy}</p>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Globe className="h-3 w-3" /> Online Worldwide</span>
                  <span className="flex items-center gap-1"><Heart className="h-3 w-3" /> Female & Kids Friendly</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Flexible Timings</span>
                </div>
              </div>
            </div>
          </div>

          <ArabicQuote text="فَاذْكُرُونِي أَذْكُرْكُمْ" className="mt-10" />
          <p className="text-xs text-muted-foreground text-center mt-1 italic">"Remember Me, and I will remember you" — Quran 2:152</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
