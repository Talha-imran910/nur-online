import { useState } from "react";
import { Link } from "react-router-dom";
import { courses as initialCourses, sampleStudents, sampleAssignments, INSTRUCTOR, Course } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  BookOpen, Users, FileText, BarChart3, Plus, Edit, LogOut,
  GraduationCap, Star, Upload, Video, CheckCircle2, Clock,
  Save, TrendingUp, Award, MessageSquare, ChevronRight, Sparkles,
  Radio, HelpCircle, Trash2, DollarSign, Image, FileUp, Settings
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

  // Editable course list
  const [courseList, setCourseList] = useState<Course[]>([...initialCourses]);
  const totalStudents = sampleStudents.length;
  const totalLessons = courseList.reduce((acc, c) => acc + c.lessons, 0);

  // Grading state
  const [assignments, setAssignments] = useState([...sampleAssignments]);
  const [gradesPublished, setGradesPublished] = useState(false);
  const pendingGrading = assignments.filter((a) => a.submitted && !a.grade).length;

  // Live class state
  const [isLive, setIsLive] = useState(() => {
    try { const d = localStorage.getItem("elaf_live_class"); return d ? JSON.parse(d).isLive : false; } catch { return false; }
  });
  const [liveTitle, setLiveTitle] = useState("Live Tajweed Class");
  const [liveLink, setLiveLink] = useState("");

  const toggleLive = () => {
    if (isLive) {
      localStorage.removeItem("elaf_live_class");
      setIsLive(false);
      toast({ title: "Live Class Ended 🔴", description: "Students will no longer see the live banner." });
    } else {
      if (!liveLink.trim()) { toast({ title: "Please add a link", description: "Paste your Zoom/YouTube Live link first." }); return; }
      localStorage.setItem("elaf_live_class", JSON.stringify({ id: Date.now().toString(), title: liveTitle || "Live Class", link: liveLink, startTime: new Date().toISOString(), isLive: true }));
      setIsLive(true);
      toast({ title: "You're LIVE! 🟢", description: "Students will see a notification banner on the website." });
    }
  };

  const deleteCourse = (id: string) => {
    setCourseList((prev) => prev.filter((c) => c.id !== id));
    toast({ title: "Course Deleted 🗑️", description: "The course has been removed." });
  };

  const updateCoursePrice = (id: string, price: number, isFree: boolean) => {
    setCourseList((prev) => prev.map((c) => c.id === id ? { ...c, price, isFree } : c));
    toast({ title: "Price Updated 💰", description: isFree ? "Course set to Free." : `Price set to $${price}.` });
  };

  const publishAllGrades = () => {
    setGradesPublished(true);
    toast({ title: "All Grades Published! 🎓", description: "Students can now see their final grades." });
  };

  const updateGrade = (assignmentId: string, grade: number, feedback: string) => {
    setAssignments((prev) => prev.map((a) => a.id === assignmentId ? { ...a, grade, feedback } : a));
    toast({ title: "Grade Saved! ✅", description: `Grade: ${grade}%` });
  };

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
            {isLive && (
              <div className="hidden sm:flex items-center gap-2 bg-destructive/20 rounded-full px-3 py-1.5 animate-pulse">
                <Radio className="h-3 w-3 text-destructive" />
                <span className="text-xs text-destructive font-bold">LIVE</span>
              </div>
            )}
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

      {/* Welcome */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/8 via-gold/5 to-primary/8" />
        <div className="container mx-auto px-4 py-6 relative">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center animate-scale-in">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground animate-fade-in">Assalamu Alaikum, Ustadha! 🌙</h1>
              <p className="text-sm text-muted-foreground mt-0.5 animate-fade-in" style={{ animationDelay: '0.1s' }}>Manage your courses, students, and grades</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8 bg-card border border-border shadow-sm flex-wrap h-auto gap-1 p-1.5 rounded-xl">
            {[
              { value: "overview", icon: BarChart3, label: "Overview" },
              { value: "courses", icon: BookOpen, label: "Courses" },
              { value: "upload", icon: Upload, label: "Add Content" },
              { value: "live", icon: Radio, label: "Go Live" },
              { value: "students", icon: Users, label: "Students" },
              { value: "grades", icon: Award, label: "Grades" },
              { value: "settings", icon: Settings, label: "Settings" },
              { value: "guide", icon: HelpCircle, label: "Help" },
            ].map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="gap-1.5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">
                <tab.icon className="h-4 w-4" /> {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ===== OVERVIEW ===== */}
          <TabsContent value="overview" className="space-y-6 animate-fade-in">
            <div ref={statsRef} className="stagger-children grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: BookOpen, label: "Courses", value: courseList.length, color: "bg-primary/10 text-primary", trend: "Active" },
                { icon: Users, label: "Students", value: totalStudents, color: "bg-gold/10 text-gold", trend: "Enrolled" },
                { icon: GraduationCap, label: "Lessons", value: totalLessons, color: "bg-emerald-light/10 text-emerald-light", trend: "Total" },
                { icon: Star, label: "Rating", value: "4.8 ⭐", color: "bg-gold/10 text-gold", trend: "Excellent" },
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
                  <Users className="h-5 w-5 text-primary" /> Recent Students
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="text-left p-4 font-medium text-muted-foreground">Student</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Email</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Courses</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Progress</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sampleStudents.map((s) => {
                        const avg = Math.round(Object.values(s.progress).reduce((a, b) => a + b, 0) / Object.values(s.progress).length);
                        return (
                          <tr key={s.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{s.name.charAt(0)}</div>
                                <span className="font-medium">{s.name}</span>
                              </div>
                            </td>
                            <td className="p-4 text-muted-foreground text-xs">{s.email}</td>
                            <td className="p-4"><Badge variant="secondary" className="text-xs">{s.enrolledCourses.length}</Badge></td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Progress value={avg} className="h-2 w-24" />
                                <span className="text-xs font-medium">{avg}%</span>
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

          {/* ===== COURSES (with delete, edit price) ===== */}
          <TabsContent value="courses" className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-bold text-foreground">Your Courses</h2>
              <Button variant="emerald" size="sm" onClick={() => setActiveTab("upload")} className="gap-1.5">
                <Plus className="h-4 w-4" /> Add New
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {courseList.map((c, i) => (
                <Card key={c.id} className="border-border/50 hover-lift group overflow-hidden">
                  <div className="p-5">
                    <div className="flex gap-4">
                      <img src={c.thumbnail} alt="" className="h-20 w-28 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform duration-500" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif text-base font-bold text-foreground truncate">{c.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{c.description}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="secondary" className="text-[10px]">📚 {c.lessons} lessons</Badge>
                          <Badge variant="secondary" className="text-[10px]">👥 {c.students}</Badge>
                          <Badge className={`text-[10px] ${c.isFree ? "bg-primary/10 text-primary" : "bg-gold/10 text-gold"}`}>
                            {c.isFree ? "Free" : `$${c.price}`}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4 pt-3 border-t border-border/50">
                      <EditPriceDialog course={c} onSave={(price, isFree) => updateCoursePrice(c.id, price, isFree)} />
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-1 rounded-lg" onClick={() => deleteCourse(c.id)}>
                        <Trash2 className="h-3 w-3" /> Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ===== ADD CONTENT (with PDF upload) ===== */}
          <TabsContent value="upload" className="animate-fade-in">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-primary/20 to-gold/10 flex items-center justify-center mx-auto mb-5 animate-float">
                  <Upload className="h-10 w-10 text-primary" />
                </div>
                <h2 className="font-serif text-3xl font-bold text-foreground">Add New Content</h2>
                <p className="text-muted-foreground mt-2">Create courses, add videos, or upload PDFs ✨</p>
              </div>
              <div className="grid gap-5 sm:grid-cols-3 mb-8">
                <AddCourseDialog />
                <AddLessonDialog courses={courseList} />
                <UploadPDFDialog courses={courseList} />
              </div>
              <Card className="border-border/50 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
                  <CardTitle className="font-serif text-lg">📋 How It Works</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    {[
                      { step: "1", title: "Create a Course", desc: "Give it a name and set the price", emoji: "📖" },
                      { step: "2", title: "Upload Video to YouTube", desc: "Record and upload to YouTube", emoji: "🎬" },
                      { step: "3", title: "Add Lesson or PDF", desc: "Paste YouTube link or upload PDF notes", emoji: "📄" },
                      { step: "4", title: "Students Learn!", desc: "Students watch videos & download PDFs", emoji: "🎓" },
                    ].map((item) => (
                      <div key={item.step} className="flex items-start gap-4 group">
                        <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-lg shrink-0 group-hover:scale-110 transition-all duration-300">{item.emoji}</div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{item.title}</p>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ===== GO LIVE ===== */}
          <TabsContent value="live" className="animate-fade-in">
            <div className="max-w-xl mx-auto">
              <div className="text-center mb-8">
                <div className={`h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-5 transition-all duration-500 ${isLive ? "bg-destructive/20 animate-pulse" : "bg-primary/10"}`}>
                  <Radio className={`h-10 w-10 ${isLive ? "text-destructive" : "text-primary"}`} />
                </div>
                <h2 className="font-serif text-3xl font-bold text-foreground">{isLive ? "You're Live! 🟢" : "Start a Live Class"}</h2>
                <p className="text-muted-foreground mt-2">{isLive ? "Students can see the banner now." : "All students will see a notification banner."}</p>
              </div>
              <Card className="border-border/50 overflow-hidden">
                <CardContent className="p-6 space-y-5">
                  <div className="space-y-2">
                    <Label>Class Title</Label>
                    <Input placeholder="e.g., Live Tajweed Practice" value={liveTitle} onChange={(e) => setLiveTitle(e.target.value)} disabled={isLive} />
                  </div>
                  <div className="space-y-2">
                    <Label>Meeting Link (Zoom / YouTube Live) *</Label>
                    <Input placeholder="https://zoom.us/j/123456" value={liveLink} onChange={(e) => setLiveLink(e.target.value)} disabled={isLive} />
                  </div>
                  <Button onClick={toggleLive} className={`w-full gap-2 text-base py-6 rounded-xl transition-all duration-500 ${isLive ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground" : "bg-primary hover:bg-primary/90 text-primary-foreground"}`}>
                    <Radio className="h-5 w-5" />
                    {isLive ? "End Live Class" : "Go Live Now 🎥"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ===== STUDENTS (with marks) ===== */}
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
                        <th className="text-left p-4 font-medium text-muted-foreground">Avg Progress</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Grades</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sampleStudents.map((s) => {
                        const avg = Math.round(Object.values(s.progress).reduce((a, b) => a + b, 0) / Object.values(s.progress).length);
                        const studentAssignments = assignments.filter((a) => a.grade);
                        const avgGrade = studentAssignments.length > 0 ? Math.round(studentAssignments.reduce((acc, a) => acc + (a.grade || 0), 0) / studentAssignments.length) : null;
                        return (
                          <tr key={s.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/20 to-gold/10 flex items-center justify-center text-sm font-bold text-primary">{s.name.charAt(0)}</div>
                                <span className="font-medium">{s.name}</span>
                              </div>
                            </td>
                            <td className="p-4 text-muted-foreground text-xs">{s.email}</td>
                            <td className="p-4"><Badge variant="secondary" className="text-xs">{s.enrolledCourses.length}</Badge></td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Progress value={avg} className="h-2 w-20" />
                                <span className="text-xs font-semibold">{avg}%</span>
                              </div>
                            </td>
                            <td className="p-4">
                              {avgGrade ? (
                                <Badge className={`text-xs ${avgGrade >= 80 ? "bg-primary/10 text-primary" : avgGrade >= 60 ? "bg-gold/10 text-gold" : "bg-destructive/10 text-destructive"}`}>
                                  {avgGrade}%
                                </Badge>
                              ) : (
                                <span className="text-xs text-muted-foreground">—</span>
                              )}
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

          {/* ===== GRADES (bulk publish) ===== */}
          <TabsContent value="grades" className="animate-fade-in">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground">Grades & Assignments</h2>
                <p className="text-sm text-muted-foreground mt-1">Grade work individually, then publish all at once ✨</p>
              </div>
              <div className="flex items-center gap-3">
                {pendingGrading > 0 && (
                  <Badge className="bg-gold/10 text-gold border border-gold/20 px-3 py-1.5">{pendingGrading} pending</Badge>
                )}
                <Button variant="emerald" className="gap-2 rounded-xl" onClick={publishAllGrades} disabled={gradesPublished}>
                  <Award className="h-4 w-4" />
                  {gradesPublished ? "Grades Published ✅" : "Publish All Grades"}
                </Button>
              </div>
            </div>

            {gradesPublished && (
              <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-xl animate-slide-up flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                <p className="text-sm text-foreground">All grades have been published! Students can now view their final grades.</p>
              </div>
            )}

            <div className="space-y-4">
              {assignments.map((a, i) => (
                <Card key={a.id} className="border-border/50 hover-lift overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="h-4 w-4 text-primary" />
                          <h3 className="font-serif text-lg font-bold text-foreground">{a.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">{a.description}</p>
                        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1"><Clock className="h-3 w-3" /> Due: {a.dueDate}</p>
                        {a.submissionText && (
                          <div className="mt-3 p-3 bg-muted/30 rounded-xl border border-border/50">
                            <p className="text-xs font-semibold text-muted-foreground mb-1 flex items-center gap-1"><MessageSquare className="h-3 w-3" /> Student's Answer:</p>
                            <p className="text-sm text-foreground">{a.submissionText}</p>
                          </div>
                        )}
                      </div>
                      <div className="shrink-0">
                        {a.grade ? (
                          <div className="text-right space-y-1">
                            <Badge className="bg-primary/10 text-primary border border-primary/20">
                              <CheckCircle2 className="h-3 w-3 mr-1" /> {a.grade}%
                            </Badge>
                            {a.feedback && <p className="text-xs text-muted-foreground max-w-xs text-right italic">"{a.feedback}"</p>}
                          </div>
                        ) : a.submitted ? (
                          <Badge variant="secondary" className="border border-gold/20 text-gold"><Clock className="h-3 w-3 mr-1" /> Needs Grading</Badge>
                        ) : (
                          <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" /> Not Submitted</Badge>
                        )}
                      </div>
                    </div>
                    {a.submitted && (
                      <div className="mt-4 pt-3 border-t border-border/50">
                        <GradeDialog assignment={a} onSave={(grade, feedback) => updateGrade(a.id, grade, feedback)} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ===== SETTINGS ===== */}
          <TabsContent value="settings" className="animate-fade-in">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-center mb-8">
                <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-gold/20 to-primary/10 flex items-center justify-center mx-auto mb-5 animate-float">
                  <Settings className="h-10 w-10 text-gold" />
                </div>
                <h2 className="font-serif text-3xl font-bold text-foreground">Academy Settings</h2>
                <p className="text-muted-foreground mt-2">Manage your profile and academy details</p>
              </div>

              <Card className="border-border/50 overflow-hidden">
                <CardHeader><CardTitle className="font-serif text-lg flex items-center gap-2"><Image className="h-5 w-5 text-primary" /> Profile & Academy</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Your Name</Label>
                    <Input defaultValue={INSTRUCTOR.name} />
                  </div>
                  <div className="space-y-2">
                    <Label>Academy Name</Label>
                    <Input defaultValue={INSTRUCTOR.academy} />
                  </div>
                  <div className="space-y-2">
                    <Label>Bio / About You</Label>
                    <Textarea defaultValue={INSTRUCTOR.bio} rows={4} />
                  </div>
                  <div className="space-y-2">
                    <Label>Profile Image</Label>
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">A</div>
                      <label className="cursor-pointer">
                        <div className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl hover:bg-muted/50 transition-colors text-sm">
                          <Image className="h-4 w-4" /> Change Photo
                        </div>
                        <input type="file" accept="image/*" className="hidden" onChange={() => toast({ title: "Photo Updated! 📸" })} />
                      </label>
                    </div>
                  </div>
                  <Button variant="emerald" className="gap-2 rounded-xl" onClick={() => toast({ title: "Settings Saved! ✅" })}>
                    <Save className="h-4 w-4" /> Save Changes
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-border/50 overflow-hidden">
                <CardHeader><CardTitle className="font-serif text-lg flex items-center gap-2"><DollarSign className="h-5 w-5 text-gold" /> Bulk Price Update</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Quickly update prices from the Courses tab. Click "Edit Price" on any course.</p>
                  <Button variant="outline" onClick={() => setActiveTab("courses")} className="gap-2 rounded-xl">
                    <BookOpen className="h-4 w-4" /> Go to Courses
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ===== HELP GUIDE ===== */}
          <TabsContent value="guide" className="animate-fade-in">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-gold/20 to-primary/10 flex items-center justify-center mx-auto mb-5 animate-float">
                  <HelpCircle className="h-10 w-10 text-gold" />
                </div>
                <h2 className="font-serif text-3xl font-bold text-foreground">Help Guide</h2>
                <p className="text-muted-foreground mt-2">Step by step instructions 💛</p>
              </div>
              <div className="space-y-4">
                {[
                  { title: "🔐 Login", steps: ["Go to website → 'Sign In'", "Email: afshan@elaf.com", "Password: elaf2024"] },
                  { title: "📖 Add Course", steps: ["Click 'Add Content' tab", "Click 'New Course'", "Fill name, subject, price", "Click 'Create Course'"] },
                  { title: "🎬 Add Video", steps: ["Upload video to YouTube", "Copy the YouTube link", "Click 'Add Lesson'", "Paste link and save"] },
                  { title: "📄 Upload PDF", steps: ["Click 'Add Content' tab", "Click 'Upload PDF'", "Select PDF file from your device", "Choose which course it belongs to"] },
                  { title: "💰 Change Price", steps: ["Go to 'Courses' tab", "Click 'Edit Price' on any course", "Enter new price or toggle Free", "Click Save"] },
                  { title: "📺 Go Live", steps: ["Start Zoom/Google Meet", "Copy meeting link", "Go to 'Go Live' tab", "Paste link → 'Go Live Now'", "Click 'End' when done"] },
                  { title: "📝 Grade Work", steps: ["Go to 'Grades' tab", "Click 'Grade' on any submission", "Enter grade (0-100) and feedback", "When all done → 'Publish All Grades'"] },
                  { title: "🗑️ Delete Course", steps: ["Go to 'Courses' tab", "Click 'Delete' on any course", "Course is removed immediately"] },
                ].map((section, i) => (
                  <Card key={i} className="border-border/50 overflow-hidden hover-lift">
                    <CardHeader className="pb-2"><CardTitle className="font-serif text-lg">{section.title}</CardTitle></CardHeader>
                    <CardContent>
                      <ol className="space-y-2">
                        {section.steps.map((step, j) => (
                          <li key={j} className="flex items-start gap-3 text-sm">
                            <span className="h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">{j + 1}</span>
                            <span className="text-muted-foreground">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

/* ========== EDIT PRICE DIALOG ========== */
function EditPriceDialog({ course, onSave }: { course: Course; onSave: (price: number, isFree: boolean) => void }) {
  const [open, setOpen] = useState(false);
  const [price, setPrice] = useState(course.price?.toString() || "0");
  const [isFree, setIsFree] = useState(course.isFree);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1 rounded-lg"><DollarSign className="h-3 w-3" /> Edit Price</Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader><DialogTitle className="font-serif">Edit Price — {course.title}</DialogTitle></DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="flex items-center justify-between">
            <Label>Free Course</Label>
            <Switch checked={isFree} onCheckedChange={setIsFree} />
          </div>
          {!isFree && (
            <div className="space-y-2">
              <Label>Price (USD)</Label>
              <Input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
          )}
          <div className="flex gap-2">
            <DialogClose asChild><Button variant="outline" className="flex-1">Cancel</Button></DialogClose>
            <Button variant="emerald" className="flex-1" onClick={() => { onSave(Number(price), isFree); setOpen(false); }}>
              <Save className="h-4 w-4 mr-1" /> Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ========== ADD COURSE DIALOG ========== */
function AddCourseDialog() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const handleSave = (e: React.FormEvent) => { e.preventDefault(); toast({ title: "Course Created! ✅" }); setOpen(false); };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="group relative overflow-hidden rounded-2xl p-6 text-center cursor-pointer border-2 border-dashed border-primary/20 hover:border-primary/50 bg-card hover:bg-primary/5 transition-all duration-500 w-full">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300">
            <Plus className="h-6 w-6 text-primary" />
          </div>
          <p className="font-serif text-base font-bold text-foreground">New Course</p>
          <p className="text-xs text-muted-foreground mt-1">Create a course</p>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle className="font-serif text-xl">Create New Course ✨</DialogTitle></DialogHeader>
        <form onSubmit={handleSave} className="space-y-4 mt-2">
          <div className="space-y-2"><Label>Course Name *</Label><Input placeholder="e.g., Tajweed Basics" required /></div>
          <div className="space-y-2"><Label>Description</Label><Textarea placeholder="What will students learn?" rows={3} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Subject</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option>Tajweed</option><option>Tafseer</option><option>Nazra Quran</option><option>Qaida & Basics</option><option>Memorization</option><option>Spiritual Tarbiyat</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Level</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Price (USD)</Label><Input type="number" min="0" placeholder="0 = Free" /></div>
            <div className="space-y-2"><Label>Duration</Label><Input placeholder="e.g., 12 weeks" /></div>
          </div>
          <div className="flex gap-2 pt-2">
            <DialogClose asChild><Button type="button" variant="outline" className="flex-1">Cancel</Button></DialogClose>
            <Button type="submit" variant="emerald" className="flex-1"><Save className="h-4 w-4 mr-1" /> Create Course</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ========== ADD LESSON DIALOG ========== */
function AddLessonDialog({ courses }: { courses: Course[] }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const handleSave = (e: React.FormEvent) => { e.preventDefault(); toast({ title: "Lesson Added! ✅" }); setOpen(false); };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="group relative overflow-hidden rounded-2xl p-6 text-center cursor-pointer border-2 border-dashed border-gold/20 hover:border-gold/50 bg-card hover:bg-gold/5 transition-all duration-500 w-full">
          <div className="h-12 w-12 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300">
            <Video className="h-6 w-6 text-gold" />
          </div>
          <p className="font-serif text-base font-bold text-foreground">Add Lesson</p>
          <p className="text-xs text-muted-foreground mt-1">Add a video lesson</p>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle className="font-serif text-xl">Add New Lesson 📹</DialogTitle></DialogHeader>
        <form onSubmit={handleSave} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label>Which Course? *</Label>
            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required>
              <option value="">Select a course...</option>
              {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
          <div className="space-y-2"><Label>Lesson Title *</Label><Input placeholder="e.g., Noon Sakinah Rules" required /></div>
          <div className="space-y-2">
            <Label>YouTube Video Link *</Label>
            <div className="flex items-center gap-2">
              <Video className="h-5 w-5 text-destructive shrink-0" />
              <Input placeholder="https://youtube.com/watch?v=..." required />
            </div>
          </div>
          <div className="space-y-2"><Label>Duration</Label><Input placeholder="e.g., 25 minutes" /></div>
          <div className="flex gap-2 pt-2">
            <DialogClose asChild><Button type="button" variant="outline" className="flex-1">Cancel</Button></DialogClose>
            <Button type="submit" variant="emerald" className="flex-1"><Save className="h-4 w-4 mr-1" /> Add Lesson</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ========== UPLOAD PDF DIALOG ========== */
function UploadPDFDialog({ courses }: { courses: Course[] }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast({ title: "Please select a PDF file", variant: "destructive" });
        return;
      }
      setFileName(file.name);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName) { toast({ title: "Please select a PDF file" }); return; }
    toast({ title: "PDF Uploaded! 📄", description: `${fileName} has been added to the course.` });
    setOpen(false);
    setFileName("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="group relative overflow-hidden rounded-2xl p-6 text-center cursor-pointer border-2 border-dashed border-emerald-light/20 hover:border-emerald-light/50 bg-card hover:bg-emerald-light/5 transition-all duration-500 w-full">
          <div className="h-12 w-12 rounded-2xl bg-emerald-light/10 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300">
            <FileUp className="h-6 w-6 text-emerald-light" />
          </div>
          <p className="font-serif text-base font-bold text-foreground">Upload PDF</p>
          <p className="text-xs text-muted-foreground mt-1">Notes or worksheets</p>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle className="font-serif text-xl">Upload PDF Notes 📄</DialogTitle></DialogHeader>
        <form onSubmit={handleSave} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label>Which Course? *</Label>
            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required>
              <option value="">Select a course...</option>
              {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <Label>PDF Title *</Label>
            <Input placeholder="e.g., Tajweed Rules Handout" required />
          </div>
          <div className="space-y-2">
            <Label>Select PDF File *</Label>
            <label className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-muted/30 transition-colors">
              <FileUp className="h-10 w-10 text-muted-foreground" />
              {fileName ? (
                <p className="text-sm font-medium text-foreground">{fileName}</p>
              ) : (
                <p className="text-sm text-muted-foreground">Click to select PDF file</p>
              )}
              <input type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
            </label>
          </div>
          <div className="flex gap-2 pt-2">
            <DialogClose asChild><Button type="button" variant="outline" className="flex-1">Cancel</Button></DialogClose>
            <Button type="submit" variant="emerald" className="flex-1"><Upload className="h-4 w-4 mr-1" /> Upload PDF</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ========== GRADE DIALOG ========== */
function GradeDialog({ assignment, onSave }: { assignment: any; onSave: (grade: number, feedback: string) => void }) {
  const [open, setOpen] = useState(false);
  const [grade, setGrade] = useState(assignment.grade?.toString() || "");
  const [feedback, setFeedback] = useState(assignment.feedback || "");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="emerald" size="sm" className="gap-1.5 rounded-lg">
          <Edit className="h-3 w-3" /> {assignment.grade ? "Edit Grade" : "Grade This"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle className="font-serif text-lg">Grade: {assignment.title}</DialogTitle></DialogHeader>
        <form onSubmit={(e) => { e.preventDefault(); onSave(Number(grade), feedback); setOpen(false); }} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label>Grade (out of 100) *</Label>
            <Input type="number" min="0" max="100" placeholder="e.g., 90" value={grade} onChange={(e) => setGrade(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Your Feedback</Label>
            <Textarea placeholder="MashaAllah! Great effort..." rows={3} value={feedback} onChange={(e) => setFeedback(e.target.value)} />
          </div>
          <div className="flex gap-2 pt-2">
            <DialogClose asChild><Button type="button" variant="outline" className="flex-1">Cancel</Button></DialogClose>
            <Button type="submit" variant="emerald" className="flex-1"><CheckCircle2 className="h-4 w-4 mr-1" /> Save Grade</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
