import { useState } from "react";
import { Link } from "react-router-dom";
import { courses, sampleStudents, sampleAssignments, INSTRUCTOR } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen, Users, FileText, BarChart3, Plus, Edit, Eye, LogOut,
  GraduationCap, Clock, Star
} from "lucide-react";
import elafLogo from "@/assets/elaf-logo.png";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { useScrollReveal } from "@/hooks/use-animations";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const statsRef = useScrollReveal();

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-navy border-b border-navy-light sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={elafLogo} alt="" className="h-9 w-9 object-contain brightness-200" />
            <div>
              <span className="font-serif text-base font-bold text-cream block leading-tight">Admin Panel</span>
              <span className="text-[9px] text-cream/40 tracking-wider uppercase">Elaf-ul-Quran</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-cream/70">{INSTRUCTOR.name}</span>
            <Link to="/"><Button variant="ghost" size="sm" className="text-cream/70 hover:text-cream hover:bg-cream/10"><LogOut className="h-4 w-4" /></Button></Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8 bg-muted/50">
            <TabsTrigger value="overview"><BarChart3 className="h-4 w-4 mr-1" /> Overview</TabsTrigger>
            <TabsTrigger value="courses"><BookOpen className="h-4 w-4 mr-1" /> Courses</TabsTrigger>
            <TabsTrigger value="students"><Users className="h-4 w-4 mr-1" /> Students</TabsTrigger>
            <TabsTrigger value="assignments"><FileText className="h-4 w-4 mr-1" /> Grading</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div ref={statsRef} className="stagger-children grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { icon: BookOpen, label: "Total Courses", value: courses.length, color: "text-primary" },
                { icon: Users, label: "Total Students", value: sampleStudents.length, color: "text-gold" },
                { icon: GraduationCap, label: "Completion Rate", value: "72%", color: "text-emerald" },
                { icon: Star, label: "Avg Rating", value: "4.8", color: "text-gold" },
              ].map((s) => (
                <div key={s.label} className="glass-card rounded-xl p-5 hover-lift">
                  <s.icon className={`h-6 w-6 ${s.color} mb-2`} />
                  <p className="text-2xl font-bold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>

            <h3 className="font-serif text-xl font-bold text-foreground mb-4">Recent Enrollments</h3>
            <div className="glass-card rounded-xl overflow-hidden overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-3 font-medium text-muted-foreground">Student</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Course</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Progress</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleStudents.map((s) => (
                    <tr key={s.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                      <td className="p-3 font-medium">{s.name}</td>
                      <td className="p-3 text-muted-foreground">{s.enrolledCourses.length} courses</td>
                      <td className="p-3"><Progress value={Math.round(Object.values(s.progress).reduce((a, b) => a + b, 0) / Object.values(s.progress).length)} className="h-2 w-24" /></td>
                      <td className="p-3 text-muted-foreground">{s.joinedDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="courses">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-bold text-foreground">Manage Courses</h2>
              <AddCourseDialog />
            </div>
            <div className="space-y-3">
              {courses.map((c) => (
                <div key={c.id} className="glass-card rounded-xl p-5 flex items-center justify-between gap-4 hover-lift">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <img src={c.thumbnail} alt="" className="h-16 w-24 rounded-lg object-cover shrink-0 hidden sm:block" />
                    <div className="min-w-0">
                      <h3 className="font-serif text-base font-bold text-foreground truncate">{c.title}</h3>
                      <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                        <span>{c.lessons} lessons</span>
                        <span>{c.students} students</span>
                        <span>{c.level}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge className={c.isFree ? "bg-emerald/10 text-emerald-light" : "bg-gold/10 text-gold"}>
                      {c.isFree ? "Free" : `$${c.price}`}
                    </Badge>
                    <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

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
                    <th className="text-left p-3 font-medium text-muted-foreground">Joined</th>
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
                        <td className="p-3"><div className="flex items-center gap-2"><Progress value={avg} className="h-2 w-20" /><span className="text-xs text-muted-foreground">{avg}%</span></div></td>
                        <td className="p-3 text-muted-foreground">{s.joinedDate}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="assignments">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Assignment Grading</h2>
            <div className="space-y-3">
              {sampleAssignments.map((a) => (
                <div key={a.id} className="glass-card rounded-xl p-5 hover-lift">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1">
                      <h3 className="font-serif text-lg font-bold text-foreground">{a.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{a.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">Due: {a.dueDate}</p>
                      {a.submissionText && (
                        <div className="mt-3 p-3 bg-muted/50 rounded-lg text-sm">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Student Response:</p>
                          <p className="text-foreground">{a.submissionText}</p>
                        </div>
                      )}
                    </div>
                    <div className="shrink-0">
                      {a.submitted ? (
                        <div className="text-right">
                          <Badge className="bg-emerald/10 text-emerald-light">Graded: {a.grade}%</Badge>
                          {a.feedback && <p className="text-xs text-muted-foreground mt-2 max-w-xs text-right">{a.feedback}</p>}
                        </div>
                      ) : (
                        <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" /> Awaiting</Badge>
                      )}
                    </div>
                  </div>
                  {a.submitted && (
                    <div className="mt-4 pt-4 border-t border-border flex gap-2">
                      <Button variant="outline" size="sm"><Eye className="mr-1 h-3 w-3" /> View</Button>
                      <Button variant="emerald" size="sm"><Edit className="mr-1 h-3 w-3" /> Edit Grade</Button>
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

function AddCourseDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="emerald"><Plus className="mr-1 h-4 w-4" /> Add Course</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Create New Course</DialogTitle>
        </DialogHeader>
        <form className="space-y-4 mt-4">
          <div className="space-y-2"><Label>Course Title</Label><Input placeholder="e.g., Tafseer of Surah Ar-Rahman" /></div>
          <div className="space-y-2"><Label>Description</Label><Textarea placeholder="Course description..." rows={3} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Subject</Label><Input placeholder="e.g., Tajweed" /></div>
            <div className="space-y-2"><Label>Level</Label><Input placeholder="Beginner / Intermediate / Advanced" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Duration</Label><Input placeholder="e.g., 8 weeks" /></div>
            <div className="space-y-2"><Label>Price (0 for free)</Label><Input type="number" placeholder="0" /></div>
          </div>
          <div className="space-y-2"><Label>YouTube Video URL (first lesson)</Label><Input placeholder="https://youtube.com/watch?v=..." /></div>
          <Button variant="emerald" className="w-full">Create Course</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
