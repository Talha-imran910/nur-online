import { courses } from "@/lib/mock-data";
import CourseCard from "@/components/CourseCard";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function FeaturedCourses() {
  const featured = courses.slice(0, 3);

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-gold font-medium text-sm tracking-widest uppercase mb-2">Start Learning Today</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
            Featured <span className="text-primary">Courses</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link to="/courses">
            <Button variant="emerald" size="lg">
              View All Courses
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
