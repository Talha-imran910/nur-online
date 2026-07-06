// Vercel serverless function: GET /api/sitemap.xml
// Generates a fresh XML sitemap on each request (cached 1h at the edge)
// covering all published courses + static marketing routes.

const SITE = "https://www.elafulquran.com";
const SUPABASE_URL = "https://yrvtcxeuqygvtfhfnvjf.supabase.co";
const SUPABASE_ANON = "sb_publishable_5WTpYvpIlhOKKIleykRSvA_ey1w1ddC";

export const config = { runtime: "edge" };

type CourseRow = { id: string; updated_at?: string | null; created_at?: string | null };
type PostRow = { slug: string; updated_at?: string | null; published_at?: string | null };

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function urlEntry(loc: string, lastmod?: string | null, changefreq = "monthly", priority = "0.7") {
  const parts = [
    `  <url>`,
    `    <loc>${esc(loc)}</loc>`,
    lastmod ? `    <lastmod>${esc(lastmod.slice(0, 10))}</lastmod>` : "",
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    `  </url>`,
  ].filter(Boolean);
  return parts.join("\n");
}

async function fetchRows<T>(path: string): Promise<T[]> {
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` },
    });
    if (!r.ok) return [];
    return (await r.json()) as T[];
  } catch {
    return [];
  }
}

export default async function handler(): Promise<Response> {
  const [courses, posts] = await Promise.all([
    fetchRows<CourseRow>("courses?select=id,updated_at,created_at&is_published=eq.true"),
    fetchRows<PostRow>("blog_posts?select=slug,updated_at,published_at&is_published=eq.true"),
  ]);

  const entries: string[] = [
    urlEntry(`${SITE}/`, null, "weekly", "1.0"),
    urlEntry(`${SITE}/courses`, null, "weekly", "0.9"),
    urlEntry(`${SITE}/about`, null, "monthly", "0.7"),
    urlEntry(`${SITE}/faq`, null, "monthly", "0.7"),
    urlEntry(`${SITE}/register`, null, "monthly", "0.6"),
    urlEntry(`${SITE}/privacy-policy`, null, "yearly", "0.3"),
  ];
  if (posts.length > 0) entries.push(urlEntry(`${SITE}/blog`, null, "weekly", "0.8"));

  for (const c of courses) {
    entries.push(urlEntry(`${SITE}/courses/${c.id}`, c.updated_at || c.created_at, "weekly", "0.8"));
  }
  for (const p of posts) {
    entries.push(urlEntry(`${SITE}/blog/${p.slug}`, p.updated_at || p.published_at, "monthly", "0.6"));
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>\n`;

  return new Response(xml, {
    status: 200,
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
