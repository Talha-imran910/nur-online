import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { getCourses, getAssignments, getStudents, onStoreUpdate } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, PlayCircle, CheckCircle, LogOut } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-animations";
import elafLogo from "@/assets/elaf-logo.png";
import AssignmentSubmission from "@/components/AssignmentSubmission";
import LiveClassBanner from "@/components/LiveClassBanner";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function StudentDashboard() {
  const [, setTick] = useState(0);
  const statsRef = useScrollReveal();
  const coursesRef = useScrollReveal(0.1);
  const assignRef = useScrollReveal(0.1);

  // Re-render on store changes
  useEffect(() => {
    return onStoreUpdate(() => setTick((t) => t + 1));
  }, []);

  // Get current student from localStorage
  const currentUser = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("elaf_user") || "{}"); } catch { return {}; }
  }, []);

  const allStudents = getStudents();
  const allCourses = getCourses();
  const allAssignments = getAssignments();

  // Find this student in the store
  const studentRecord = allStudents.find(
    (s) => s.email.toLowerCase() === (currentUser.email || "").toLowerCase()
  );

  const enrolledCourseIds = studentRecord?.enrolledCourses || [];
  const courseProgress = studentRecord?.progress || {};

  const enrolledCourses = allCourses.filter((c) => enrolledCourseIds.includes(c.id));
  const myAssignments = allAssignments.filter((a) => enrolledCourseIds.includes(a.courseId));
  const completedCount = Object.values(courseProgress).filter((p) => p >= 100).length;

  return (
    <div className="min-h-screen bg-background">
      <LiveClassBanner />
      <header className="bg-primary border-b border-border sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={elafLogo} alt="" className="h-9 w-9 object-contain brightness-200" />
            <span className="font-serif text-lg font-bold text-primary-foreground">Elaf-ul-Quran</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-primary-foreground/70">Assalamu Alaikum, {currentUser.name || "Student"} 🌙</span>
            <Link to="/"><Button variant="ghost" size="sm" className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"><LogOut className="h-4 w-4" /></Button></Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-slide-up">
          <h1 className="font-serif text-3xl font-bold text-foreground">My Learning Dashboard</h1>
          <p className="text-muted-foreground mt-1">Continue your journey with the Quran ✨</p>
        </div>

        <div ref={statsRef} className="stagger-children grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { icon: BookOpen, label: "Enrolled", value: enrolledCourses.length, color: "text-primary" },
            { icon: PlayCircle, label: "In Progress", value: enrolledCourses.length - completedCount, color: "text-gold" },
            { icon: CheckCircle, label: "Completed", value: completedCount, color: "text-emerald" },
          ].map((s) => (
            <div key={s.label} className="glass-card rounded-xl p-5 hover-lift">
              <s.icon className={`h-6 w-6 ${s.color} mb-2`} />
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {enrolledCourses.length === 0 && (
          <div className="text-center py-12 glass-card rounded-xl mb-8">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-serif text-xl font-bold text-foreground mb-2">No courses yet</h3>
            <p className="text-muted-foreground mb-4">Browse our courses and start learning!</p>
            <Link to="/courses"><Button variant="emerald">Browse Courses</Button></Link>
          </div>
        )}

        {enrolledCourses.length > 0 && (
          <>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">My Courses</h2>
            <div ref={coursesRef} className="stagger-children grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
              {enrolledCourses.map((course) => {
                const progress = courseProgress[course.id] || 0;
                return (
                  <div key={course.id} className="glass-card rounded-xl overflow-hidden hover-lift">
                    <div className="h-32 overflow-hidden relative">
                      <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
                      <Badge className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm text-foreground">{progress}%</Badge>
                    </div>
                    <div className="p-5">
                      <h3 className="font-serif text-base font-bold text-foreground line-clamp-2">{course.title}</h3>
                      <Progress value={progress} className="h-2 my-3" />
                      <span className="text-xs text-muted-foreground">{course.lessons} lessons • {course.duration}</span>
                      <Link to={`/player/${course.id}`}>
                        <Button variant="emerald" size="sm" className="w-full mt-3 group">
                          <PlayCircle className="mr-1 h-4 w-4 transition-transform group-hover:scale-125" /> Continue
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {myAssignments.length > 0 && (
          <>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Assignments</h2>
            <div ref={assignRef} className="stagger-children space-y-3">
              {myAssignments.map((a) => (
                <AssignmentSubmission key={a.id} assignment={a} />
              ))}
            </div>
          </>
        )}
      </div>
      <WhatsAppButton />
    </div>
  );
}
