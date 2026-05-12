import { useState, useMemo, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CourseCard from "@/components/CourseCard";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ArabicQuote } from "@/components/IslamicDecorations";

export default function Courses() {
  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    async function load() {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });
      console.log("[Courses] fetched:", { data, error });
      if (!alive) return;
      if (error) setError(error.message);
      setCourses(data || []);
      setLoading(false);
    }
    load();
    const channel = supabase
      .channel("rt-courses-page")
      .on("postgres_changes", { event: "*", schema: "public", table: "courses" }, () => load())
      .subscribe();
    return () => { alive = false; supabase.removeChannel(channel); };
  }, []);

  const filtered = useMemo(() => {
    if (!search) return courses;
    return courses.filter((c) => c.title?.toLowerCase().includes(search.toLowerCase()));
  }, [search, courses]);

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
          {loading ? (
            <p className="text-center text-muted-foreground py-12">Loading courses...</p>
          ) : error ? (
            <p className="text-center text-destructive py-12">Error: {error}</p>
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
