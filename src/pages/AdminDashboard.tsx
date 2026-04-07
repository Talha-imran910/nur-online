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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen, Users, FileText, BarChart3, Plus, Edit, Eye, LogOut,
  GraduationCap, Star, Upload, Video, CheckCircle2, Clock,
  Save, TrendingUp, Award, MessageSquare, ChevronRight, Sparkles
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

  const totalStudents = sampleStudents.length;
  const totalLessons = courses.reduce((acc, c) => acc + c.lessons, 0);
  const pendingGrading = sampleAssignments.filter((a) => !a.submitted).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-navy border-b border-navy-light sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-3 group">
            <img src={elafLogo} alt="" className="h-10 w-10 object-contain brightness-200 group-hover:scale-110 transition-transform duration-300" />
            <div>
              <span className="font-serif text-base font-bold text-cream block leading-tight">Teacher Panel</span>
              <span className="text-[10px] text-cream/50 tracking-wider uppercase">Elaf-ul-Quran Academy</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-cream/5 rounded-full px-4 py-1.5">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm text-cream/80">{INSTRUCTOR.name}</span>
            </div>
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-cream/70 hover:text-cream hover:bg-cream/10 rounded-full">
                <LogOut className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Welcome banner with gradient */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/8 via-gold/5 to-primary/8" />
        <div className="absolute inset-0 islamic-star opacity-10" />
        <div className="container mx-auto px-4 py-8 relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center animate-scale-in">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground animate-fade-in">
                Assalamu Alaikum, Ustadha! 🌙
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                Here's what's happening with your courses today
              </p>
            </div>
          </div>

          {/* Quick action pills */}
          {pendingGrading > 0 && (
            <div className="mt-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <button
                onClick={() => setActiveTab("assignments")}
                className="inline-flex items-center gap-2 bg-gold/10 hover:bg-gold/20 text-gold border border-gold/20 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105"
              >
                <MessageSquare className="h-4 w-4" />
                {pendingGrading} assignment{pendingGrading > 1 ? 's' : ''} waiting for grading
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8 bg-card border border-border shadow-sm flex-wrap h-auto gap-1 p-1.5 rounded-xl">
            {[
              { value: "overview", icon: BarChart3, label: "Overview" },
              { value: "courses", icon: BookOpen, label: "My Courses" },
              { value: "upload", icon: Upload, label: "Add Content" },
              { value: "students", icon: Users, label: "Students" },
              { value: "assignments", icon: FileText, label: "Grading" },
            ].map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="gap-1.5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">
                <tab.icon className="h-4 w-4" /> {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ===== OVERVIEW ===== */}
          <TabsContent value="overview" className="space-y-8 animate-fade-in">
            <div ref={statsRef} className="stagger-children grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: BookOpen, label: "Total Courses", value: courses.length, color: "bg-primary/10 text-primary", trend: "+2 this month" },
                { icon: Users, label: "Total Students", value: totalStudents, color: "bg-gold/10 text-gold", trend: "+12 this week" },
                { icon: GraduationCap, label: "Total Lessons", value: totalLessons, color: "bg-emerald-light/10 text-emerald-light", trend: `${totalLessons} videos` },
                { icon: Star, label: "Avg Rating", value: "4.8 ⭐", color: "bg-gold/10 text-gold", trend: "Excellent!" },
              ].map((s) => (
                <Card key={s.label} className="border-border/50 hover-lift group cursor-default overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full" />
                  <CardContent className="p-5">
                    <div className={`h-10 w-10 rounded-xl ${s.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                      <s.icon className="h-5 w-5" />
                    </div>
                    <p className="text-3xl font-bold text-foreground">{s.value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className="h-3 w-3 text-primary" />
                      <span className="text-[11px] text-primary font-medium">{s.trend}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent students */}
            <Card className="border-border/50 overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="font-serif text-xl flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Recent Students
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="text-left p-4 font-medium text-muted-foreground">Student</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Courses</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Progress</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sampleStudents.map((s, i) => {
                        const avg = Math.round(Object.values(s.progress).reduce((a, b) => a + b, 0) / Object.values(s.progress).length);
                        return (
                          <tr key={s.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors duration-200" style={{ animationDelay: `${i * 0.05}s` }}>
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                  {s.name.charAt(0)}
                                </div>
                                <span className="font-medium">{s.name}</span>
                              </div>
                            </td>
                            <td className="p-4 text-muted-foreground">
                              <Badge variant="secondary" className="text-xs">{s.enrolledCourses.length} courses</Badge>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Progress value={avg} className="h-2 w-24" />
                                <span className="text-xs font-medium text-muted-foreground">{avg}%</span>
                              </div>
                            </td>
                            <td className="p-4 text-muted-foreground text-xs">{s.joinedDate}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ===== MY COURSES ===== */}
          <TabsContent value="courses" className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-bold text-foreground">Your Courses</h2>
              <Button variant="emerald" size="sm" onClick={() => setActiveTab("upload")} className="gap-1.5">
                <Plus className="h-4 w-4" /> Add New
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {courses.map((c, i) => (
                <Card key={c.id} className="border-border/50 hover-lift group overflow-hidden" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="flex gap-4 p-5">
                    <img src={c.thumbnail} alt="" className="h-20 w-28 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform duration-500" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif text-base font-bold text-foreground truncate">{c.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{c.description}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Badge variant="secondary" className="text-[10px]">📚 {c.lessons} lessons</Badge>
                        <Badge variant="secondary" className="text-[10px]">👥 {c.students}</Badge>
                        <Badge variant="secondary" className="text-[10px]">⭐ {c.rating}</Badge>
                      </div>
                    </div>
                    <Badge className={`self-start shrink-0 ${c.isFree ? "bg-primary/10 text-primary" : "bg-gold/10 text-gold"}`}>
                      {c.isFree ? "Free" : `$${c.price}`}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ===== ADD CONTENT ===== */}
          <TabsContent value="upload" className="animate-fade-in">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-10">
                <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-primary/20 to-gold/10 flex items-center justify-center mx-auto mb-5 animate-float">
                  <Upload className="h-10 w-10 text-primary" />
                </div>
                <h2 className="font-serif text-3xl font-bold text-foreground">Add New Content</h2>
                <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                  Create a new course or add lessons to existing courses. It's very simple, Ustadha! ✨
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 mb-10">
                <AddCourseDialog />
                <AddLessonDialog />
              </div>

              {/* Quick guide */}
              <Card className="border-border/50 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
                  <CardTitle className="font-serif text-lg flex items-center gap-2">
                    📋 How It Works (Super Easy!)
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    {[
                      { step: "1", title: "Create a Course", desc: "Give it a name like 'Tajweed Basics for Beginners'", emoji: "📖" },
                      { step: "2", title: "Record & Upload to YouTube", desc: "Record your lesson, upload it to YouTube", emoji: "🎬" },
                      { step: "3", title: "Paste the Link Here", desc: "Copy your YouTube link and paste it in 'Add Lesson'", emoji: "🔗" },
                      { step: "4", title: "Students Watch & Learn!", desc: "That's it! Students will see your lessons automatically", emoji: "🎓" },
                    ].map((item, i) => (
                      <div key={item.step} className="flex items-start gap-4 group">
                        <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-lg shrink-0 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                          {item.emoji}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{item.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ===== STUDENTS ===== */}
          <TabsContent value="students" className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-bold text-foreground">All Students</h2>
              <Badge variant="secondary" className="text-sm px-3 py-1">{totalStudents} total</Badge>
            </div>
            <Card className="border-border/50 overflow-hidden">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="text-left p-4 font-medium text-muted-foreground">Name</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Email</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Courses</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Progress</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sampleStudents.map((s) => {
                        const avg = Math.round(Object.values(s.progress).reduce((a, b) => a + b, 0) / Object.values(s.progress).length);
                        return (
                          <tr key={s.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors duration-200">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/20 to-gold/10 flex items-center justify-center text-sm font-bold text-primary">
                                  {s.name.charAt(0)}
                                </div>
                                <span className="font-medium">{s.name}</span>
                              </div>
                            </td>
                            <td className="p-4 text-muted-foreground">{s.email}</td>
                            <td className="p-4">
                              <Badge variant="secondary" className="text-xs">{s.enrolledCourses.length}</Badge>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <Progress value={avg} className="h-2 w-24" />
                                <span className="text-xs font-semibold text-foreground">{avg}%</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ===== GRADING ===== */}
          <TabsContent value="assignments" className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground">Grade Student Work</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Review submissions and give grades with feedback ✨
                </p>
              </div>
              {pendingGrading > 0 && (
                <Badge className="bg-gold/10 text-gold border border-gold/20 px-3 py-1.5">
                  {pendingGrading} pending
                </Badge>
              )}
            </div>
            <div className="space-y-4">
              {sampleAssignments.map((a, i) => (
                <Card key={a.id} className="border-border/50 hover-lift overflow-hidden" style={{ animationDelay: `${i * 0.1}s` }}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="h-4 w-4 text-primary" />
                          <h3 className="font-serif text-lg font-bold text-foreground">{a.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">{a.description}</p>
                        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> Due: {a.dueDate}
                        </p>
                        {a.submissionText && (
                          <div className="mt-4 p-4 bg-muted/30 rounded-xl border border-border/50">
                            <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" /> Student's Answer:
                            </p>
                            <p className="text-sm text-foreground leading-relaxed">{a.submissionText}</p>
                          </div>
                        )}
                      </div>
                      <div className="shrink-0">
                        {a.submitted ? (
                          <div className="text-right space-y-2">
                            <Badge className="bg-primary/10 text-primary border border-primary/20">
                              <CheckCircle2 className="h-3 w-3 mr-1" /> Graded: {a.grade}%
                            </Badge>
                            {a.feedback && (
                              <p className="text-xs text-muted-foreground max-w-xs text-right italic">"{a.feedback}"</p>
                            )}
                          </div>
                        ) : (
                          <Badge variant="secondary" className="border border-gold/20 text-gold">
                            <Clock className="h-3 w-3 mr-1" /> Needs Grading
                          </Badge>
                        )}
                      </div>
                    </div>
                    {a.submitted && (
                      <div className="mt-4 pt-4 border-t border-border/50 flex gap-2">
                        <GradeDialog assignment={a} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

/* ========== ADD COURSE DIALOG ========== */
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
        <button className="group relative overflow-hidden rounded-2xl p-8 text-center cursor-pointer border-2 border-dashed border-primary/20 hover:border-primary/50 bg-card hover:bg-primary/5 transition-all duration-500 w-full">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
              <Plus className="h-7 w-7 text-primary" />
            </div>
            <p className="font-serif text-lg font-bold text-foreground">New Course</p>
            <p className="text-xs text-muted-foreground mt-1">Create a brand new course</p>
          </div>
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
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm rounded-lg">
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
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm rounded-lg">
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

/* ========== ADD LESSON DIALOG ========== */
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
        <button className="group relative overflow-hidden rounded-2xl p-8 text-center cursor-pointer border-2 border-dashed border-gold/20 hover:border-gold/50 bg-card hover:bg-gold/5 transition-all duration-500 w-full">
          <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative">
            <div className="h-14 w-14 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
              <Video className="h-7 w-7 text-gold" />
            </div>
            <p className="font-serif text-lg font-bold text-foreground">Add Lesson</p>
            <p className="text-xs text-muted-foreground mt-1">Add a video to existing course</p>
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Add New Lesson 📹</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSave} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label>Which Course? *</Label>
            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm rounded-lg" required>
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
        <Button variant="emerald" size="sm" className="gap-1.5 rounded-lg">
          <Edit className="h-3 w-3" /> Grade This
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-lg">Grade: {assignment.title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSave} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label>Grade (out of 100) *</Label>
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
              💡 Example: "MashaAllah! Great effort. Keep practicing the Makhaarij..."
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
