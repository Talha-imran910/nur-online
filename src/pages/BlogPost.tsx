import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import DOMPurify from "dompurify";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogPostCard from "@/components/BlogPostCard";
import { fetchBlogPostBySlug, fetchPublishedBlogPosts, type BlogPost } from "@/lib/db";
import { INSTRUCTOR } from "@/lib/mock-data";
import { SITE_URL } from "@/lib/contact";
import ShareButtons from "@/components/blog/ShareButtons";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, ArrowLeft } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { IslamicDivider, ArabicQuote } from "@/components/IslamicDecorations";

const CATEGORY_LABEL: Record<string, string> = {
  teaching: "Teaching",
  "event-qa": "Event Q&A",
  reflection: "Reflection",
  announcement: "Announcement",
};

export default function BlogPost() {
  const { slug } = useParams();

  const { data: post, isLoading } = useQuery({
    queryKey: ["blog", "post", slug],
    queryFn: () => (slug ? fetchBlogPostBySlug(slug) : Promise.resolve(null)),
    enabled: !!slug,
    staleTime: 60_000,
  });

  const { data: allPosts = [] } = useQuery({
    queryKey: ["blog", "published"],
    queryFn: fetchPublishedBlogPosts,
    staleTime: 60_000,
  });

  const more = useMemo(() => allPosts.filter((x) => x.slug !== slug).slice(0, 3), [allPosts, slug]);

  const cleanHtml = useMemo(
    () => (post?.content ? DOMPurify.sanitize(post.content, { ADD_ATTR: ["target", "rel"] }) : ""),
    [post?.content]
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar /><div className="flex-1 flex items-center justify-center text-muted-foreground">Loading…</div><Footer />
      </div>
    );
  }
  if (!post || !post.isPublished) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-3xl font-bold">Post Not Found</h1>
            <Link to="/blog" className="text-primary mt-4 inline-block">← Back to Blog</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const canonical = `${SITE_URL}/blog/${post.slug}`;
  const metaTitle = post.metaTitle || `${post.title} | Elaf-ul-Quran Blog`;
  const metaDesc = (post.metaDescription || post.excerpt || post.content.replace(/<[^>]*>/g, " ")).slice(0, 200);
  const image = post.coverImage || `${SITE_URL}/og-image.jpg`;
  const dateLabel = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })
    : "";

  const jsonLd: any[] = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: metaDesc,
      image,
      datePublished: post.publishedAt || post.createdAt,
      dateModified: post.updatedAt || post.publishedAt || post.createdAt,
      author: { "@type": "Person", name: post.authorName },
      publisher: {
        "@type": "Organization",
        name: "Elaf-ul-Quran Academy",
        logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.png` },
      },
      mainEntityOfPage: canonical,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
        { "@type": "ListItem", position: 3, name: post.title, item: canonical },
      ],
    },
  ];
  if (post.category === "event-qa" && post.qaItems && post.qaItems.length > 0) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: post.qaItems.map((qa) => ({
        "@type": "Question",
        name: qa.question,
        acceptedAnswer: { "@type": "Answer", text: qa.answer.replace(/<[^>]*>/g, " ").trim() },
      })),
    });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDesc} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={image} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDesc} />
        <meta name="twitter:image" content={image} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <Navbar />

      <section className="relative overflow-hidden islamic-overlay">
        {post.coverImage && (
          <div className="absolute inset-0 z-0">
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" loading="eager" fetchPriority="high" />
            <div className="absolute inset-0 gradient-hero opacity-90" />
          </div>
        )}
        {!post.coverImage && <div className="absolute inset-0 gradient-hero" />}
        <div className="relative z-10 container mx-auto px-4 py-16 max-w-3xl">
          <Link to="/blog" className="inline-flex items-center gap-1.5 text-cream/70 hover:text-cream text-sm mb-6">
            <ArrowLeft className="h-4 w-4" /> All posts
          </Link>
          <div className="flex gap-2 mb-4 flex-wrap">
            <Badge className="bg-gold/20 text-gold border-gold/30">{CATEGORY_LABEL[post.category] || post.category}</Badge>
            {post.tags.slice(0, 3).map((t) => (
              <Badge key={t} className="bg-cream/10 text-cream/80 border-cream/20">#{t}</Badge>
            ))}
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-cream">{post.title}</h1>
          {post.excerpt && <p className="mt-4 text-cream/70 text-lg leading-relaxed">{post.excerpt}</p>}
          <div className="mt-6 flex flex-wrap gap-5 text-cream/60 text-sm">
            <span>{post.authorName}</span>
            {dateLabel && <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{dateLabel}</span>}
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{post.readingTimeMinutes} min read</span>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <article
            className="prose prose-emerald max-w-none prose-headings:font-serif prose-headings:text-foreground prose-a:text-gold prose-strong:text-foreground prose-blockquote:border-l-primary prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: cleanHtml }}
          />

          <div className="mt-8 pt-6 border-t border-border/50">
            <ShareButtons url={canonical} title={post.title} />
          </div>

          {post.category === "event-qa" && post.qaItems && post.qaItems.length > 0 && (
            <div className="mt-12">
              <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Questions &amp; Answers</h2>
              <IslamicDivider className="mb-6" opacity={0.15} />
              <Accordion type="single" collapsible className="glass-card rounded-xl px-4">
                {post.qaItems.map((qa, i) => (
                  <AccordionItem key={i} value={`qa-${i}`}>
                    <AccordionTrigger className="text-left font-serif text-base">
                      {qa.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div
                        className="prose prose-emerald max-w-none prose-a:text-gold"
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(qa.answer || "") }}
                      />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}

          <div className="mt-14 glass-card rounded-2xl p-6 flex items-start gap-5">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-3xl shrink-0">🧕</div>
            <div>
              <h3 className="font-serif text-lg font-bold text-foreground">{INSTRUCTOR.name}</h3>
              <p className="text-sm text-gold mb-2">{INSTRUCTOR.academy}</p>
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">{INSTRUCTOR.bio}</p>
            </div>
          </div>

          <ArabicQuote text="رَبِّ زِدْنِي عِلْمًا" className="mt-10" />
          <p className="text-xs text-muted-foreground text-center mt-1 italic">"My Lord, increase me in knowledge" — Quran 20:114</p>
        </div>
      </section>

      {more.length > 0 && (
        <section className="pb-20 px-4">
          <div className="container mx-auto max-w-5xl">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-6 text-center">More Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {more.map((p) => <BlogPostCard key={p.id} post={p} />)}
            </div>
          </div>
        </section>
      )}
      <Footer />
    </div>
  );
}
