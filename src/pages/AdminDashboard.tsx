import { useState } from "react";
import { Link } from "react-router-dom";
import { courses, sampleStudents, sampleAssignments, INSTRUCTOR, Course } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen, Users, FileText, BarChart3, Plus, Edit, Eye, LogOut,
  GraduationCap, Star, Upload, Video, CheckCircle2, Clock,
  Save
} from "lucide-react";
import elafLogo from "@/assets/elaf-logo.png";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose,
} from "@/components/ui/dialog";
import { useScrollReveal } from "@/hooks/use-animations";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const statsRef = useScrollReveal();
  const { toast } = useToast();

  return (
    <div className="min-h-screen bg-background">
      {/* Simple header */}
      <header className="bg-navy border-b border-navy-light sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={elafLogo} alt="" className="h-9 w-9 object-contain brightness-200" />
            <div>
              <span className="font-serif text-base font-bold text-cream block leading-tight">Teacher Panel</span>
              <span className="text-[9px] text-cream/40 tracking-wider uppercase">Elaf-ul-Quran</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-cream/70 hidden sm:block">🌙 {INSTRUCTOR.name}</span>
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-cream/70 hover:text-cream hover:bg-cream/10">
                <LogOut className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Welcome banner */}
      <div className="bg-primary/5 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <h1 className="font-serif text-xl font-bold text-foreground">
            Assalamu Alaikum, Ustadha! 🌙
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your courses, view students, and grade assignments — all in one place.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 bg-muted/50 flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="overview" className="gap-1.5">
              <BarChart3 className="h-4 w-4" /> Overview
            </TabsTrigger>
            <TabsTrigger value="courses" className="gap-1.5">
              <BookOpen className="h-4 w-4" /> My Courses
            </TabsTrigger>
            <TabsTrigger value="upload" className="gap-1.5">
              <Upload className="h-4 w-4" /> Add Content
            </TabsTrigger>
            <TabsTrigger value="students" className="gap-1.5">
              <Users className="h-4 w-4" /> Students
            </TabsTrigger>
            <TabsTrigger value="assignments" className="gap-1.5">
              <FileText className="h-4 w-4" /> Grading
            </TabsTrigger>
          </TabsList>

          {/* ===== OVERVIEW ===== */}
          <TabsContent value="overview">
            <div ref={statsRef} className="stagger-children grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { icon: BookOpen, label: "Total Courses", value: courses.length, color: "text-primary" },
                { icon: Users, label: "Total Students", value: sampleStudents.length, color: "text-gold" },
                { icon: GraduationCap, label: "Completion Rate", value: "72%", color: "text-primary" },
                { icon: Star, label: "Avg Rating", value: "4.8", color: "text-gold" },
              ].map((s) => (
                <div key={s.label} className="glass-card rounded-xl p-5 hover-lift">
                  <s.icon className={`h-6 w-6 ${s.color} mb-2`} />
                  <p className="text-2xl font-bold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>

            <h3 className="font-serif text-xl font-bold text-foreground mb-4">Recent Students</h3>
            <div className="glass-card rounded-xl overflow-hidden overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-3 font-medium text-muted-foreground">Student</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Courses</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Progress</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleStudents.map((s) => (
                    <tr key={s.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                      <td className="p-3 font-medium">{s.name}</td>
                      <td className="p-3 text-muted-foreground">{s.enrolledCourses.length}</td>
                      <td className="p-3">
                        <Progress
                          value={Math.round(Object.values(s.progress).reduce((a, b) => a + b, 0) / Object.values(s.progress).length)}
                          className="h-2 w-24"
                        />
                      </td>
                      <td className="p-3 text-muted-foreground">{s.joinedDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* ===== MY COURSES ===== */}
          <TabsContent value="courses">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-bold text-foreground">Your Courses</h2>
            </div>
            <div className="space-y-3">
              {courses.map((c) => (
                <div key={c.id} className="glass-card rounded-xl p-5 flex items-center justify-between gap-4 hover-lift">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <img src={c.thumbnail} alt="" className="h-16 w-24 rounded-lg object-cover shrink-0 hidden sm:block" />
                    <div className="min-w-0">
                      <h3 className="font-serif text-base font-bold text-foreground truncate">{c.title}</h3>
                      <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                        <span>📚 {c.lessons} lessons</span>
                        <span>👥 {c.students} students</span>
                        <span>⭐ {c.rating}</span>
                      </div>
                    </div>
                  </div>
                  <Badge className={c.isFree ? "bg-primary/10 text-primary" : "bg-gold/10 text-gold"}>
                    {c.isFree ? "Free" : `$${c.price}`}
                  </Badge>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* ===== ADD CONTENT (SIMPLE!) ===== */}
          <TabsContent value="upload">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <h2 className="font-serif text-2xl font-bold text-foreground">Add New Content</h2>
                <p className="text-muted-foreground mt-2">
                  Upload a new course or add a lesson to existing courses. It's very simple! ✨
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 mb-8">
                <AddCourseDialog />
                <AddLessonDialog />
              </div>

              {/* Quick guide for mom */}
              <div className="glass-card rounded-xl p-6">
                <h3 className="font-serif text-lg font-bold text-foreground mb-4">📋 Quick Guide</h3>
                <div className="space-y-3">
                  {[
                    { step: "1", title: "Create a Course", desc: "Give it a name like 'Tajweed Basics' and a description" },
                    { step: "2", title: "Add YouTube Link", desc: "Upload your video to YouTube, then paste the link here" },
                    { step: "3", title: "Students can watch", desc: "Students will see your course and watch lessons automatically" },
                    { step: "4", title: "Grade assignments", desc: "Go to the 'Grading' tab to see and grade student work" },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-3">
                      <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                        {item.step}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ===== STUDENTS ===== */}
          <TabsContent value="students">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-6">All Students</h2>
            <div className="glass-card rounded-xl overflow-hidden overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-3 font-medium text-muted-foreground">Name</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Email</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Courses</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleStudents.map((s) => {
                    const avg = Math.round(Object.values(s.progress).reduce((a, b) => a + b, 0) / Object.values(s.progress).length);
                    return (
                      <tr key={s.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                        <td className="p-3 font-medium">{s.name}</td>
                        <td className="p-3 text-muted-foreground">{s.email}</td>
                        <td className="p-3">{s.enrolledCourses.length}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <Progress value={avg} className="h-2 w-20" />
                            <span className="text-xs text-muted-foreground">{avg}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* ===== GRADING ===== */}
          <TabsContent value="assignments">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-2">Grade Student Work</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Review student submissions and give them grades and feedback ✨
            </p>
            <div className="space-y-3">
              {sampleAssignments.map((a) => (
                <div key={a.id} className="glass-card rounded-xl p-5 hover-lift">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif text-lg font-bold text-foreground">{a.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{a.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">📅 Due: {a.dueDate}</p>
                      {a.submissionText && (
                        <div className="mt-3 p-3 bg-muted/50 rounded-lg text-sm">
                          <p className="text-xs font-medium text-muted-foreground mb-1">📝 Student's Answer:</p>
                          <p className="text-foreground">{a.submissionText}</p>
                        </div>
                      )}
                    </div>
                    <div className="shrink-0">
                      {a.submitted ? (
                        <div className="text-right">
                          <Badge className="bg-primary/10 text-primary">
                            <CheckCircle2 className="h-3 w-3 mr-1" /> Graded: {a.grade}%
                          </Badge>
                          {a.feedback && (
                            <p className="text-xs text-muted-foreground mt-2 max-w-xs text-right">{a.feedback}</p>
                          )}
                        </div>
                      ) : (
                        <Badge variant="secondary">
                          <Clock className="h-3 w-3 mr-1" /> Waiting
                        </Badge>
                      )}
                    </div>
                  </div>
                  {a.submitted && (
                    <div className="mt-4 pt-4 border-t border-border flex gap-2">
                      <GradeDialog assignment={a} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

/* ========== ADD COURSE DIALOG (SUPER SIMPLE) ========== */
function AddCourseDialog() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Course Created! ✅", description: "Your new course has been added successfully." });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="glass-card rounded-xl p-6 text-center hover-lift cursor-pointer border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors w-full">
          <Plus className="h-8 w-8 text-primary mx-auto mb-2" />
          <p className="font-serif font-bold text-foreground">New Course</p>
          <p className="text-xs text-muted-foreground mt-1">Create a brand new course</p>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Create New Course ✨</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSave} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label>Course Name *</Label>
            <Input placeholder="e.g., Tajweed Basics for Beginners" required />
            <p className="text-xs text-muted-foreground">Give your course a simple, clear name</p>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea placeholder="What will students learn in this course?" rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Subject</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option>Tajweed</option>
                <option>Tafseer</option>
                <option>Nazra Quran</option>
                <option>Qaida & Basics</option>
                <option>Memorization</option>
                <option>Spiritual Tarbiyat</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Level</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>First Video Link (YouTube)</Label>
            <div className="flex items-center gap-2">
              <Video className="h-5 w-5 text-destructive shrink-0" />
              <Input placeholder="Paste YouTube link here" />
            </div>
            <p className="text-xs text-muted-foreground">Upload your video to YouTube first, then paste the link</p>
          </div>
          <div className="flex gap-2 pt-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="flex-1">Cancel</Button>
            </DialogClose>
            <Button type="submit" variant="emerald" className="flex-1">
              <Save className="h-4 w-4 mr-1" /> Create Course
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ========== ADD LESSON DIALOG (SUPER SIMPLE) ========== */
function AddLessonDialog() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Lesson Added! ✅", description: "Your new lesson has been added to the course." });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="glass-card rounded-xl p-6 text-center hover-lift cursor-pointer border-2 border-dashed border-gold/20 hover:border-gold/40 transition-colors w-full">
          <Video className="h-8 w-8 text-gold mx-auto mb-2" />
          <p className="font-serif font-bold text-foreground">Add Lesson</p>
          <p className="text-xs text-muted-foreground mt-1">Add a video to existing course</p>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Add New Lesson 📹</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSave} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label>Which Course? *</Label>
            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required>
              <option value="">Select a course...</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Lesson Title *</Label>
            <Input placeholder="e.g., Lesson 5 — Noon Sakinah Rules" required />
          </div>
          <div className="space-y-2">
            <Label>YouTube Video Link *</Label>
            <div className="flex items-center gap-2">
              <Video className="h-5 w-5 text-destructive shrink-0" />
              <Input placeholder="https://youtube.com/watch?v=..." required />
            </div>
            <p className="text-xs text-muted-foreground">
              💡 Tip: Upload your video on YouTube → Copy the link → Paste it here
            </p>
          </div>
          <div className="space-y-2">
            <Label>Video Length</Label>
            <Input placeholder="e.g., 25 minutes" />
          </div>
          <div className="flex gap-2 pt-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="flex-1">Cancel</Button>
            </DialogClose>
            <Button type="submit" variant="emerald" className="flex-1">
              <Save className="h-4 w-4 mr-1" /> Add Lesson
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ========== GRADE DIALOG ========== */
function GradeDialog({ assignment }: { assignment: any }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [grade, setGrade] = useState(assignment.grade?.toString() || "");
  const [feedback, setFeedback] = useState(assignment.feedback || "");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Grade Saved! ✅", description: `Grade: ${grade}% — Feedback sent to student.` });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="emerald" size="sm">
          <Edit className="mr-1 h-3 w-3" /> Grade This
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-lg">Grade: {assignment.title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSave} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label>Grade (out of 100)</Label>
            <Input
              type="number"
              min="0"
              max="100"
              placeholder="e.g., 90"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Your Feedback</Label>
            <Textarea
              placeholder="Write encouraging feedback for the student..."
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              💡 Example: "MashaAllah! Great effort. Keep practicing..."
            </p>
          </div>
          <div className="flex gap-2 pt-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="flex-1">Cancel</Button>
            </DialogClose>
            <Button type="submit" variant="emerald" className="flex-1">
              <CheckCircle2 className="h-4 w-4 mr-1" /> Save Grade
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
