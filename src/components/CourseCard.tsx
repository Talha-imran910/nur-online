import { Link } from "react-router-dom";
import { Star, Users, Clock, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Course } from "@/lib/mock-data";
import quranStudy from "@/assets/quran-study.jpg";

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Link to={`/courses/${course.id}`} className="group block">
      <div className="glass-card rounded-xl overflow-hidden transition-all duration-300 hover:shadow-elegant hover:-translate-y-1">
        <div className="relative h-48 overflow-hidden">
          <img
            src={quranStudy}
            alt={course.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge className={course.isFree ? "bg-emerald text-cream" : "bg-gold text-navy"}>
              {course.isFree ? "Free" : `$${course.price}`}
            </Badge>
            <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
              {course.level}
            </Badge>
          </div>
          <div className="absolute bottom-3 right-3 flex items-center gap-1 text-gold">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm font-semibold text-cream">{course.rating}</span>
          </div>
        </div>

        <div className="p-5">
          <h3 className="font-serif text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {course.title}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{course.description}</p>

          <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              {course.lessons} lessons
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {course.duration}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {course.students}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
