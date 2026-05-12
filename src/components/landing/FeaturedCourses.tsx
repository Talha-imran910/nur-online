import { useEffect, useState } from "react";
import CourseCard from "@/components/CourseCard";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-animations";
import { fetchPublishedCourses, subscribeToTables, type Course } from "@/lib/db";

export default function FeaturedCourses() {
  const titleRef = useScrollReveal();
  const gridRef = useScrollReveal(0.1);
  const [featured, setFeatured] = useState<Course[]>([]);

  useEffect(() => {
    let alive = true;
    const load = () => fetchPublishedCourses().then((c) => alive && setFeatured(c.slice(0, 3)));
    load();
    const unsub = subscribeToTables(["courses", "units", "lessons"], load);
    return () => { alive = false; unsub(); };
  }, []);

  return (
    <section className="py-20 bg-secondary/30 islamic-overlay relative">
      <div className="container mx-auto px-4 relative z-10">
        <div ref={titleRef} className="reveal text-center mb-14">
          <p className="text-gold font-medium text-sm tracking-widest uppercase mb-2">✦ Start Your Journey ✦</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
            Featured <span className="text-primary">Courses</span>
          </h2>
        </div>

        {featured.length === 0 ? (
          <p className="text-center text-muted-foreground">No published courses yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((c) => (<CourseCard key={c.id} course={c as any} />))}
          </div>
        )}

        <div className="mt-10 text-center animate-fade-in">
          <Link to="/courses">
            <Button variant="emerald" size="lg" className="group">
              View All Courses
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
