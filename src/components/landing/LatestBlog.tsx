import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-animations";
import { fetchPublishedBlogPosts, subscribeToTables, type BlogPost } from "@/lib/db";
import BlogPostCard from "@/components/BlogPostCard";

export default function LatestBlog() {
  const titleRef = useScrollReveal();
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    let alive = true;
    const load = () => fetchPublishedBlogPosts().then((p) => alive && setPosts(p.slice(0, 3)));
    load();
    const unsub = subscribeToTables(["blog_posts"], load);
    return () => { alive = false; unsub(); };
  }, []);

  if (posts.length === 0) return null;

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
          {posts.map((p) => <BlogPostCard key={p.id} post={p} />)}
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
