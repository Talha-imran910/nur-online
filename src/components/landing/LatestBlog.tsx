import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-animations";
import { fetchPublishedBlogPosts } from "@/lib/db";
import BlogPostCard from "@/components/BlogPostCard";

export default function LatestBlog() {
  const titleRef = useScrollReveal();
  const { data: posts = [] } = useQuery({
    queryKey: ["blog", "published"],
    queryFn: fetchPublishedBlogPosts,
    staleTime: 60_000,
  });
  const latest = posts.slice(0, 3);

  if (latest.length === 0) return null;

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div ref={titleRef} className="reveal text-center mb-14">
          <p className="text-gold font-medium text-sm tracking-widest uppercase mb-2">✦ From the Blog ✦</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
            Latest <span className="text-primary">Teachings</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latest.map((p) => <BlogPostCard key={p.id} post={p} />)}
        </div>
        <div className="mt-10 text-center">
          <Link to="/blog">
            <Button variant="emerald" size="lg" className="group">
              Read All Posts
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
