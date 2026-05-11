import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { INSTRUCTOR } from "@/lib/mock-data";
import {
  fetchAllCourses,
  fetchAllStudents,
  fetchLiveClass,
  startLiveClass,
  endLiveClass,
  createCourse,
  updateCoursePrice,
  deleteCourse,
  addLesson,
  removeLesson,
  teacherEnroll,
  teacherUnenroll,
  subscribeToTables,
  type Course,
  type StudentRow,
} from "@/lib/db";
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
  BookOpen, Users, BarChart3, Plus, Edit, LogOut,
  GraduationCap, Star, Upload, Video, Save, TrendingUp, Sparkles,
  Radio, HelpCircle, Trash2, DollarSign, Image, FileUp, Settings,
} from "lucide-react";
import elafLogo from "@/assets/elaf-logo.png";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { useScrollReveal } from "@/hooks/use-animations";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const statsRef = useScrollReveal();
  const { toast } = useToast();

  const [courseList, setCourseList] = useState<Course[]>([]);
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [isLive, setIsLive] = useState(false);
  const [liveTitle, setLiveTitle] = useState("Live Tajweed Class");
  const [liveLink, setLiveLink] = useState("");
  const [liveCourseId, setLiveCourseId] = useState("all");

  const reload = async () => {
    const [c, s, l] = await Promise.all([fetchAllCourses(), fetchAllStudents(), fetchLiveClass()]);
    setCourseList(c);
    setStudents(s);
    setIsLive(!!l);
  };

  useEffect(() => {
    reload();
    const unsub = subscribeToTables(
      ["courses", "units", "lessons", "enrollments", "students", "live_class"],
      reload
    );
    return () => unsub();
  }, []);

  const totalStudents = students.length;
  const totalLessons = courseList.reduce((acc, c) => acc + c.lessons, 0);

  const toggleLive = async () => {
    if (isLive) {
      await endLiveClass();
      setIsLive(false);
      toast({ title: "Live Class Ended 🔴", description: "Students will no longer see the live banner." });
    } else {
      if (!liveLink.trim()) { toast({ title: "Please add a link", description: "Paste your Zoom/YouTube Live link first." }); return; }
      const { error } = await startLiveClass({
        title: liveTitle || "Live Class",
        link: liveLink,
        courseId: liveCourseId === "all" ? null : liveCourseId,
      });
      if (error) { toast({ title: "Could not start", description: error.message, variant: "destructive" }); return; }
      setIsLive(true);
      const targetLabel = liveCourseId === "all" ? "all students" : courseList.find((c) => c.id === liveCourseId)?.title || "selected course";
      toast({ title: "You're LIVE! 🟢", description: `Notification sent to ${targetLabel}.` });
    }
  };

  const handleDeleteCourse = async (id: string) => {
    const { error } = await deleteCourse(id);
    if (error) { toast({ title: "Delete failed", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Course Deleted 🗑️", description: "The course has been removed." });
  };

  const handleUpdateCoursePrice = async (id: string, price: number, isFree: boolean) => {
    const { error } = await updateCoursePrice(id, price, isFree);
    if (error) { toast({ title: "Update failed", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Price Updated 💰", description: isFree ? "Course set to Free." : `Price set to $${price}.` });
  };

  return (
    <div className="min-h-screen bg-background">
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

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/8 via-gold/5 to-primary/8" />
        <div className="container mx-auto px-4 py-6 relative">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center animate-scale-in">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground animate-fade-in">Assalamu Alaikum, Ustadha! 🌙</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Manage your courses and students</p>
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
              { value: "settings", icon: Settings, label: "Settings" },
              { value: "guide", icon: HelpCircle, label: "Help" },
            ].map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="gap-1.5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">
                <tab.icon className="h-4 w-4" /> {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* OVERVIEW */}
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
                      {students.map((s) => {
                        const vals = Object.values(s.progress);
                        const avg = vals.length > 0 ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
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

          {/* COURSES */}
          <TabsContent value="courses" className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-bold text-foreground">Your Courses</h2>
              <Button variant="emerald" size="sm" onClick={() => setActiveTab("upload")} className="gap-1.5">
                <Plus className="h-4 w-4" /> Add New
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {courseList.map((c) => (
                <Card key={c.id} className="border-border/50 hover-lift group overflow-hidden">
                  <div className="p-5">
                    <div className="flex gap-4">
                      <img src={c.thumbnail} alt="" className="h-20 w-28 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform duration-500" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif text-base font-bold text-foreground truncate">{c.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{c.description}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="secondary" className="text-[10px]">📚 {c.lessons} lessons</Badge>
                          <Badge className={`text-[10px] ${c.isFree ? "bg-primary/10 text-primary" : "bg-gold/10 text-gold"}`}>
                            {c.isFree ? "Free" : `$${c.price}`}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-border/50">
                      <EditPriceDialog course={c} onSave={(price, isFree) => handleUpdateCoursePrice(c.id, price, isFree)} />
                      <ManageLessonsDialog course={c} />
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-1 rounded-lg" onClick={() => { if (confirm(`Delete "${c.title}"? This cannot be undone.`)) handleDeleteCourse(c.id); }}>
                        <Trash2 className="h-3 w-3" /> Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ADD CONTENT */}
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
            </div>
          </TabsContent>

          {/* GO LIVE */}
          <TabsContent value="live" className="animate-fade-in">
            <div className="max-w-xl mx-auto">
              <div className="text-center mb-8">
                <div className={`h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-5 transition-all duration-500 ${isLive ? "bg-destructive/20 animate-pulse" : "bg-primary/10"}`}>
                  <Radio className={`h-10 w-10 ${isLive ? "text-destructive" : "text-primary"}`} />
                </div>
                <h2 className="font-serif text-3xl font-bold text-foreground">{isLive ? "You're Live! 🟢" : "Start a Live Class"}</h2>
                <p className="text-muted-foreground mt-2">{isLive ? "Students can see the banner now." : "Notify students about your live session."}</p>
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
                  <div className="space-y-2">
                    <Label>Notify Students Of</Label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={liveCourseId} onChange={(e) => setLiveCourseId(e.target.value)} disabled={isLive}>
                      <option value="all">📢 All Students (Global)</option>
                      {courseList.map((c) => (<option key={c.id} value={c.id}>📖 {c.title}</option>))}
                    </select>
                  </div>
                  <Button onClick={toggleLive} className={`w-full gap-2 text-base py-6 rounded-xl transition-all duration-500 ${isLive ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground" : "bg-primary hover:bg-primary/90 text-primary-foreground"}`}>
                    <Radio className="h-5 w-5" />
                    {isLive ? "End Live Class" : "Go Live Now 🎥"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* STUDENTS */}
          <TabsContent value="students" className="animate-fade-in">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <h2 className="font-serif text-2xl font-bold text-foreground">All Students</h2>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="text-sm px-3 py-1">{totalStudents} total</Badge>
                <AssignCourseDialog students={students} courses={courseList} />
              </div>
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
                        <th className="text-left p-4 font-medium text-muted-foreground">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.length === 0 && (
                        <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No students registered yet.</td></tr>
                      )}
                      {students.map((s) => {
                        const vals = Object.values(s.progress);
                        const avg = vals.length > 0 ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
                        return (
                          <tr key={s.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/20 to-gold/10 flex items-center justify-center text-sm font-bold text-primary">{s.name.charAt(0)}</div>
                                <span className="font-medium">{s.name}</span>
                              </div>
                            </td>
                            <td className="p-4 text-muted-foreground text-xs">{s.email}</td>
                            <td className="p-4">
                              <div className="flex flex-wrap gap-1">
                                {s.enrolledCourses.length === 0 && <span className="text-[11px] text-muted-foreground italic">None</span>}
                                {s.enrolledCourses.map((cid) => {
                                  const course = courseList.find((c) => c.id === cid);
                                  if (!course) return null;
                                  return (
                                    <Badge key={cid} variant="secondary" className="text-[10px] gap-1 pr-1">
                                      {course.title.slice(0, 18)}
                                      <button
                                        type="button"
                                        title="Unenroll"
                                        className="ml-0.5 hover:text-destructive"
                                        onClick={async () => {
                                          if (confirm(`Remove ${s.name} from "${course.title}"?`)) {
                                            await teacherUnenroll(s.id, cid);
                                            toast({ title: "Unenrolled", description: `${s.name} removed from ${course.title}.` });
                                          }
                                        }}
                                      >×</button>
                                    </Badge>
                                  );
                                })}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Progress value={avg} className="h-2 w-20" />
                                <span className="text-xs font-semibold">{avg}%</span>
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

          {/* SETTINGS */}
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
                  <Button variant="emerald" className="gap-2 rounded-xl" onClick={() => toast({ title: "Settings Saved! ✅" })}>
                    <Save className="h-4 w-4" /> Save Changes
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* HELP */}
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
                  { title: "📖 Add Course", steps: ["Click 'Add Content' tab", "Click 'New Course'", "Fill name, subject, price", "Click 'Create Course'"] },
                  { title: "🎬 Add Video", steps: ["Upload video to YouTube", "Copy the YouTube link", "Click 'Add Lesson'", "Paste link and save"] },
                  { title: "💰 Change Price", steps: ["Go to 'Courses' tab", "Click 'Edit Price' on any course", "Enter new price or toggle Free", "Click Save"] },
                  { title: "📺 Go Live", steps: ["Start Zoom/Google Meet", "Copy meeting link", "Go to 'Go Live' tab", "Choose which course to notify", "Paste link → 'Go Live Now'", "Click 'End' when done"] },
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

/* ========== EDIT PRICE ========== */
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

/* ========== ADD COURSE ========== */
function AddCourseDialog() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("tajweed");
  const [level, setLevel] = useState<"Beginner" | "Intermediate" | "Advanced">("Beginner");
  const [price, setPrice] = useState("0");
  const [duration, setDuration] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  const handleThumbnail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setThumbnailPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await createCourse({
      title, description, subject, level,
      price: Number(price),
      duration: duration || "TBD",
      thumbnail: thumbnailPreview || "/placeholder.svg",
    });
    if (error) { toast({ title: "Create failed", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Course Created! ✅", description: `"${title}" is now live.` });
    setOpen(false);
    setTitle(""); setDescription(""); setPrice("0"); setDuration(""); setThumbnailPreview("");
  };

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
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="font-serif text-xl">Create New Course ✨</DialogTitle></DialogHeader>
        <form onSubmit={handleSave} className="space-y-4 mt-2">
          <div className="space-y-2"><Label>Course Name *</Label><Input placeholder="e.g., Tajweed Basics" value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
          <div className="space-y-2"><Label>Description</Label><Textarea placeholder="What will students learn?" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} /></div>
          <div className="space-y-2">
            <Label>Thumbnail Image</Label>
            <label className="flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-muted/30 transition-colors">
              {thumbnailPreview ? (
                <img src={thumbnailPreview} alt="Preview" className="h-24 w-full object-cover rounded-lg" />
              ) : (<><Image className="h-8 w-8 text-muted-foreground" /><p className="text-xs text-muted-foreground">Click to upload thumbnail</p></>)}
              <input type="file" accept="image/*" className="hidden" onChange={handleThumbnail} />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Subject</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={subject} onChange={(e) => setSubject(e.target.value)}>
                <option value="tajweed">Tajweed</option><option value="tafseer">Tafseer</option><option value="nazra">Nazra Quran</option><option value="qaida">Qaida & Basics</option><option value="memorization">Memorization</option><option value="tarbiyat">Spiritual Tarbiyat</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Level</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={level} onChange={(e) => setLevel(e.target.value as any)}>
                <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Price (USD)</Label><Input type="number" min="0" placeholder="0 = Free" value={price} onChange={(e) => setPrice(e.target.value)} /></div>
            <div className="space-y-2"><Label>Duration</Label><Input placeholder="e.g., 12 weeks" value={duration} onChange={(e) => setDuration(e.target.value)} /></div>
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

/* ========== ADD LESSON ========== */
function AddLessonDialog({ courses }: { courses: Course[] }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [courseId, setCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [duration, setDuration] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId) { toast({ title: "Please select a course" }); return; }
    const { error } = await addLesson({ courseId, lessonTitle: title, youtubeUrl, duration: duration || "TBD" });
    if (error) { toast({ title: "Add failed", description: error.message, variant: "destructive" }); return; }
    const course = courses.find((c) => c.id === courseId);
    toast({ title: "Lesson Added! ✅", description: `"${title}" added to ${course?.title}.` });
    setOpen(false);
    setTitle(""); setYoutubeUrl(""); setDuration(""); setCourseId("");
  };

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
            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={courseId} onChange={(e) => setCourseId(e.target.value)} required>
              <option value="">Select a course...</option>
              {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
          <div className="space-y-2"><Label>Lesson Title *</Label><Input placeholder="e.g., Noon Sakinah Rules" value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
          <div className="space-y-2">
            <Label>YouTube Video Link *</Label>
            <div className="flex items-center gap-2">
              <Video className="h-5 w-5 text-destructive shrink-0" />
              <Input placeholder="https://youtube.com/watch?v=..." value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} required />
            </div>
          </div>
          <div className="space-y-2"><Label>Duration</Label><Input placeholder="e.g., 25 minutes" value={duration} onChange={(e) => setDuration(e.target.value)} /></div>
          <div className="flex gap-2 pt-2">
            <DialogClose asChild><Button type="button" variant="outline" className="flex-1">Cancel</Button></DialogClose>
            <Button type="submit" variant="emerald" className="flex-1"><Save className="h-4 w-4 mr-1" /> Add Lesson</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ========== UPLOAD PDF (placeholder) ========== */
function UploadPDFDialog({ courses }: { courses: Course[] }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") { toast({ title: "Please select a PDF file", variant: "destructive" }); return; }
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
          <div className="space-y-2"><Label>PDF Title *</Label><Input placeholder="e.g., Tajweed Rules Handout" required /></div>
          <div className="space-y-2">
            <Label>Select PDF File *</Label>
            <label className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-muted/30 transition-colors">
              <FileUp className="h-10 w-10 text-muted-foreground" />
              {fileName ? <p className="text-sm font-medium text-foreground">{fileName}</p> : <p className="text-sm text-muted-foreground">Click to select PDF file</p>}
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

/* ========== ASSIGN COURSE ========== */
function AssignCourseDialog({ students, courses }: { students: StudentRow[]; courses: Course[] }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [courseId, setCourseId] = useState("");

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !courseId) return;
    const { error } = await teacherEnroll(studentId, courseId);
    if (error) { toast({ title: "Assign failed", description: error.message, variant: "destructive" }); return; }
    const courseName = courses.find((c) => c.id === courseId)?.title || "Course";
    const studentName = students.find((s) => s.id === studentId)?.name || "Student";
    toast({ title: "Course Assigned! ✅", description: `"${courseName}" assigned to ${studentName}.` });
    setOpen(false);
    setStudentId(""); setCourseId("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="emerald" size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> Assign Course</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle className="font-serif text-lg">Assign Course to Student</DialogTitle></DialogHeader>
        <form onSubmit={handleAssign} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label>Student *</Label>
            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={studentId} onChange={(e) => setStudentId(e.target.value)} required>
              <option value="">Select a student...</option>
              {students.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.email})</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Course *</Label>
            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={courseId} onChange={(e) => setCourseId(e.target.value)} required>
              <option value="">Select a course...</option>
              {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
          <div className="flex gap-2 pt-2">
            <DialogClose asChild><Button type="button" variant="outline" className="flex-1">Cancel</Button></DialogClose>
            <Button type="submit" variant="emerald" className="flex-1"><GraduationCap className="h-4 w-4 mr-1" /> Assign</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ========== MANAGE LESSONS ========== */
function ManageLessonsDialog({ course }: { course: Course }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const handleRemove = async (lessonId: string, title: string) => {
    if (!confirm(`Remove lesson "${title}"? This cannot be undone.`)) return;
    const { error } = await removeLesson(lessonId);
    if (error) { toast({ title: "Remove failed", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Lesson Removed 🗑️", description: `"${title}" was removed.` });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1 rounded-lg"><Edit className="h-3 w-3" /> Manage Lessons</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="font-serif">Manage Lessons — {course.title}</DialogTitle></DialogHeader>
        <div className="space-y-4 mt-2">
          {course.units.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">No lessons yet. Add one from "Add Content".</p>
          )}
          {course.units.map((unit) => (
            <div key={unit.id} className="space-y-2">
              <p className="text-xs font-semibold text-gold uppercase tracking-wider">{unit.title}</p>
              {unit.lessons.length === 0 && <p className="text-xs text-muted-foreground italic">No lessons in this unit.</p>}
              {unit.lessons.map((l) => (
                <div key={l.id} className="flex items-center justify-between gap-2 p-2.5 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{l.title}</p>
                    <p className="text-[11px] text-muted-foreground">{l.duration}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0 shrink-0" onClick={() => handleRemove(l.id, l.title)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
