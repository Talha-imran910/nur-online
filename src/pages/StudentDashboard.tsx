import { Link } from "react-router-dom";
import { courses, sampleAssignments } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, PlayCircle, Clock, Award, CheckCircle, FileText, LogOut } from "lucide-react";
import bismillahLogo from "@/assets/bismillah-logo.png";

const enrolledCourseIds = ["quran-101", "fiqh-salah", "seerah-101"];
const courseProgress: Record<string, number> = { "quran-101": 65, "fiqh-salah": 30, "seerah-101": 10 };

export default function StudentDashboard() {
  const enrolledCourses = courses.filter((c) => enrolledCourseIds.includes(c.id));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary border-b border-border sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={bismillahLogo} alt="" className="h-8 w-8 object-contain brightness-200" />
            <span className="font-serif text-lg font-bold text-primary-foreground">Noor Academy</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-primary-foreground/70">Assalamu Alaikum, Student</span>
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10">
                <LogOut className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-foreground">My Learning Dashboard</h1>
          <p className="text-muted-foreground mt-1">Continue your journey of knowledge</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: BookOpen, label: "Enrolled", value: enrolledCourses.length, color: "text-primary" },
            { icon: PlayCircle, label: "In Progress", value: enrolledCourses.length - 1, color: "text-gold" },
            { icon: CheckCircle, label: "Completed", value: 0, color: "text-emerald" },
            { icon: Award, label: "Avg Score", value: "92%", color: "text-gold" },
          ].map((s) => (
            <div key={s.label} className="glass-card rounded-xl p-5">
              <s.icon className={`h-6 w-6 ${s.color} mb-2`} />
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* My Courses */}
        <h2 className="font-serif text-2xl font-bold text-foreground mb-4">My Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {enrolledCourses.map((course) => {
            const progress = courseProgress[course.id] || 0;
            return (
              <div key={course.id} className="glass-card rounded-xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-serif text-lg font-bold text-foreground line-clamp-2">{course.title}</h3>
                  <Badge variant="secondary" className="shrink-0 ml-2">{progress}%</Badge>
                </div>
                <Progress value={progress} className="h-2 mb-3" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{course.lessons} lessons • {course.duration}</span>
                </div>
                <Link to={`/player/${course.id}`}>
                  <Button variant="emerald" size="sm" className="w-full mt-4">
                    <PlayCircle className="mr-1 h-4 w-4" /> Continue Learning
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Recent Assignments */}
        <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Assignments</h2>
        <div className="space-y-3">
          {sampleAssignments.map((a) => (
            <div key={a.id} className="glass-card rounded-xl p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="h-5 w-5 text-primary shrink-0" />
                <div className="min-w-0">
                  <h4 className="font-medium text-foreground truncate">{a.title}</h4>
                  <p className="text-xs text-muted-foreground">Due: {a.dueDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {a.submitted ? (
                  <Badge className="bg-emerald/10 text-emerald-light border-emerald/30">
                    Graded: {a.grade}%
                  </Badge>
                ) : (
                  <Badge variant="secondary">Pending</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
