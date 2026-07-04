import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogPostCard from "@/components/BlogPostCard";
import { fetchPublishedBlogPosts, subscribeToTables, type BlogPost } from "@/lib/db";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { ArabicQuote } from "@/components/IslamicDecorations";
import { SITE_URL } from "@/lib/contact";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "teaching", label: "Teaching" },
  { id: "event-qa", label: "Event Q&A" },
  { id: "reflection", label: "Reflections" },
  { id: "announcement", label: "Announcements" },
];

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const load = () => fetchPublishedBlogPosts().then((p) => {
      if (!alive) return;
      setPosts(p);
      setLoading(false);
    });
    load();
    const unsub = subscribeToTables(["blog_posts"], load);
    return () => { alive = false; unsub(); };
  }, []);

  const filtered = useMemo(() => {
    let list = posts;
    if (activeCat !== "all") list = list.filter((p) => p.category === activeCat);
    if (search) list = list.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));
    return list;
  }, [posts, activeCat, search]);

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Quran Teachings & Reflections | Elaf-ul-Quran Blog</title>
        <meta name="description" content="Teachings, reflections and event Q&A from Ustadha Afshan Imran on Nazra, Tajweed, Tafseer and spiritual growth for the modern Muslim." />
        <link rel="canonical" href={`${SITE_URL}/blog`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Quran Teachings & Reflections | Elaf-ul-Quran Blog" />
        <meta property="og:description" content="Teachings, reflections and event Q&A from Ustadha Afshan Imran." />
        <meta property="og:url" content={`${SITE_URL}/blog`} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <Navbar />
      <section className="gradient-hero py-16 px-4 relative overflow-hidden islamic-overlay">
        <div className="container mx-auto text-center relative z-10">
          <ArabicQuote text="اقْرَأْ بِاسْمِ رَبِّكَ" className="!text-gold/30 mb-2" />
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-cream animate-slide-up">Blog & Reflections</h1>
          <p className="mt-4 text-cream/60 max-w-xl mx-auto animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Teachings, event Q&amp;A, and spiritual reflections from Ustadha Afshan Imran
          </p>
          <div className="mt-8 max-w-md mx-auto relative animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search posts..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-background/90 border-none" />
          </div>
        </div>
      </section>

      <section className="flex-1 py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {CATEGORIES.map((c) => (
              <Button key={c.id} size="sm" variant={activeCat === c.id ? "emerald" : "outline"} onClick={() => setActiveCat(c.id)}>
                {c.label}
              </Button>
            ))}
          </div>

          {loading ? (
            <p className="text-center text-muted-foreground py-12">Loading posts...</p>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <p className="font-serif text-2xl">No posts yet</p>
              <p className="mt-2">New reflections and teachings will appear here, in shaa Allah.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p) => <BlogPostCard key={p.id} post={p} />)}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
