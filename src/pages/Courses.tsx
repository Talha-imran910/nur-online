import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CourseCard from "@/components/CourseCard";
import { fetchPublishedCourses, fetchSubjects } from "@/lib/db";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { ArabicQuote } from "@/components/IslamicDecorations";
import { SITE_URL } from "@/lib/contact";

export default function Courses() {
  const [search, setSearch] = useState("");
  const [activeSubject, setActiveSubject] = useState<string>("all");

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["courses", "published"],
    queryFn: fetchPublishedCourses,
    staleTime: 60_000,
  });
  const { data: subjectsAll = [] } = useQuery({
    queryKey: ["subjects"],
    queryFn: fetchSubjects,
    staleTime: 5 * 60_000,
  });

  const subjects = useMemo(() => {
    const used = new Set(courses.map((c) => c.subject));
    return subjectsAll.filter((s) => used.has(s.id));
  }, [subjectsAll, courses]);

  const filtered = useMemo(() => {
    let list = courses;
    if (activeSubject !== "all") list = list.filter((c) => c.subject === activeSubject);
    if (search) list = list.filter((c) => c.title?.toLowerCase().includes(search.toLowerCase()));
    return list;
  }, [search, courses, activeSubject]);

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Online Quran Courses for Kids & Adults | Elaf-ul-Quran</title>
        <meta name="description" content="Browse online Quran courses: Nazra with Tajweed, Tafseer, Qaida and more. Live one-on-one classes for children and adults, taught by Ustadha Afshan Imran." />
        <link rel="canonical" href={`${SITE_URL}/courses`} />
        <meta property="og:url" content={`${SITE_URL}/courses`} />
      </Helmet>
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
          {subjects.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              <Button variant={activeSubject === "all" ? "emerald" : "outline"} size="sm" onClick={() => setActiveSubject("all")}>All</Button>
              {subjects.map((s) => (
                <Button key={s.id} variant={activeSubject === s.id ? "emerald" : "outline"} size="sm" onClick={() => setActiveSubject(s.id)}>{s.name}</Button>
              ))}
            </div>
          )}

          {isLoading ? (
            <p className="text-center text-muted-foreground py-12">Loading courses...</p>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <p className="font-serif text-2xl">No courses found</p>
              <p className="mt-2">Try a different search term.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((c) => (<CourseCard key={c.id} course={c} />))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
