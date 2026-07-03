import { Link } from "react-router-dom";
import { Clock, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/lib/db";

const CATEGORY_LABEL: Record<string, string> = {
  teaching: "Teaching",
  "event-qa": "Event Q&A",
  reflection: "Reflection",
  announcement: "Announcement",
};

interface Props {
  post: BlogPost;
}

export default function BlogPostCard({ post }: Props) {
  const dateLabel = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
    : "";
  return (
    <Link to={`/blog/${post.slug}`} className="group block">
      <article className="glass-card rounded-xl overflow-hidden hover-lift h-full flex flex-col">
        <div className="relative h-44 overflow-hidden bg-muted/30">
          {post.coverImage ? (
            <img
              src={post.coverImage}
              alt={post.title}
              width={640}
              height={360}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl bg-primary/10">✍️</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-navy/10 to-transparent" />
          <div className="absolute top-3 left-3">
            <Badge className="bg-gold/90 text-navy border-none font-medium">
              {CATEGORY_LABEL[post.category] || post.category}
            </Badge>
          </div>
        </div>
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="font-serif text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-3 flex-1">{post.excerpt}</p>
          )}
          <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground pt-3 border-t border-border/40">
            <span className="truncate">{post.authorName}</span>
            {dateLabel && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{dateLabel}</span>}
            <span className="flex items-center gap-1 ml-auto"><Clock className="h-3 w-3" />{post.readingTimeMinutes} min</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
