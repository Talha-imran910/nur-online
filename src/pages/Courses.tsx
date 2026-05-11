import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CourseCard from "@/components/CourseCard";
import { subjects } from "@/lib/mock-data";
import { fetchPublishedCourses, subscribeToTables, type Course } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-animations";
import { ArabicQuote } from "@/components/IslamicDecorations";

export default function Courses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const activeSubject = searchParams.get("subject") || "all";
  const gridRef = useScrollReveal(0.1);

  useEffect(() => {
    let alive = true;
    const load = () => fetchPublishedCourses().then((c) => alive && setCourses(c));
    load();
    const unsub = subscribeToTables(["courses", "units", "lessons"], load);
    return () => { alive = false; unsub(); };
  }, []);

  const filtered = useMemo(() => {
    let result = courses;
    if (activeSubject !== "all") result = result.filter((c) => c.subject === activeSubject);
    if (search) result = result.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()));
    return result;
  }, [activeSubject, search, courses]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="gradient-hero py-16 px-4 relative overflow-hidden islamic-overlay">
        <div className="container mx-auto text-center relative z-10">
          <ArabicQuote text="اقْرَأْ" className="!text-gold/30 mb-2" />
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-cream animate-slide-up">Our Courses</h1>
          <p className="mt-4 text-cream/60 max-w-xl mx-auto animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Explore our collection of authentic Quranic courses by Ustadha Afshan Imran
          </p>
          <div className="mt-8 max-w-md mx-auto relative animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search courses..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-background/90 border-none" />
          </div>
        </div>
      </section>

      <section className="flex-1 py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-wrap gap-2 mb-8">
            <Button variant={activeSubject === "all" ? "default" : "outline"} size="sm" onClick={() => setSearchParams({})}>All</Button>
            {subjects.map((s) => (
              <Button key={s.id} variant={activeSubject === s.id ? "default" : "outline"} size="sm" onClick={() => setSearchParams({ subject: s.id })}>
                {s.icon} {s.name}
              </Button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <p className="font-serif text-2xl">No courses found</p>
              <p className="mt-2">Try adjusting your filters or search term.</p>
            </div>
          ) : (
            <div ref={gridRef} className="stagger-children grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((c) => (<CourseCard key={c.id} course={c} />))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
