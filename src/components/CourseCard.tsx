import { Link } from "react-router-dom";
import { Star, Users, Clock, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Course {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;       // old mock field
  thumbnail_url?: string;   // supabase field
  level?: string;
  isFree?: boolean;         // old mock field
  is_free?: boolean;        // supabase field
  price?: number;
  rating?: number;
  duration?: string;
  lessons?: number;
  students?: number;
}

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const thumbnail = course.thumbnail_url || course.thumbnail || "";
  const isFree = course.is_free ?? course.isFree ?? false;

  return (
    <Link to={`/courses/${course.id}`} className="group block">
      <div className="glass-card rounded-xl overflow-hidden hover-lift">
        <div className="relative h-48 overflow-hidden bg-muted/30">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={course.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl bg-primary/10">
              📖
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/20 to-transparent" />
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge className={isFree
              ? "bg-emerald/90 text-cream border-none"
              : "bg-gold/90 text-navy border-none font-bold"}>
              {isFree ? "Free" : `$${course.price}`}
            </Badge>
            {course.level && (
              <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm text-foreground">
                {course.level}
              </Badge>
            )}
          </div>
          <div className="absolute bottom-3 right-3 flex items-center gap-1">
            <Star className="h-4 w-4 text-gold fill-gold" />
            <span className="text-sm font-semibold text-cream">{course.rating ?? 0}</span>
          </div>
        </div>

        <div className="p-5">
          <h3 className="font-serif text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {course.title}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{course.description}</p>

          <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" />{course.lessons ?? 0} lessons</span>
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{course.duration ?? "—"}</span>
            <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{course.students ?? 0}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
