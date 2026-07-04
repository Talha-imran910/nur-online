// Vercel Edge Middleware — bot-aware meta injection for dynamic routes.
// Runs at the edge BEFORE the SPA is served. For known link-preview crawlers
// (WhatsApp, Facebook, Twitter, LinkedIn, Telegram, Slack, Discord, Google, Bing, Apple),
// hitting /courses/:id or /blog/:slug will get a tiny static HTML doc with
// route-specific <title>, description, canonical, Open Graph and Twitter tags —
// so the shared link renders a rich preview even though the app is CSR.
// Real browsers are passed through untouched and get the normal SPA.

export const config = {
  matcher: ["/courses/:path*", "/blog/:path*"],
};

const SITE = "https://www.elafulquran.com";
const SUPABASE_URL = "https://yrvtcxeuqygvtfhfnvjf.supabase.co";
const SUPABASE_ANON =
  "sb_publishable_5WTpYvpIlhOKKIleykRSvA_ey1w1ddC";

const DEFAULT_OG = `${SITE}/og-image.jpg`;
const DEFAULT_TITLE =
  "Online Quran Classes with Tajweed & Tafseer | Elaf-ul-Quran";
const DEFAULT_DESC =
  "Learn Nazra Quran online with Tajweed, Tafseer and Sunnah practices. Live one-on-one classes for children and adults worldwide.";

const BOT_RE =
  /(facebookexternalhit|facebot|twitterbot|whatsapp|slackbot|linkedinbot|telegrambot|discordbot|googlebot|bingbot|applebot|duckduckbot|yandexbot|baiduspider|embedly|redditbot|pinterest|skypeuripreview|vkshare|w3c_validator|quora link preview)/i;

function esc(s: string | null | undefined): string {
  if (!s) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderHtml(opts: {
  title: string;
  description: string;
  url: string;
  image: string;
  type?: string;
}): string {
  const { title, description, url, image, type = "website" } = opts;
  const t = esc(title);
  const d = esc(description);
  const u = esc(url);
  const img = esc(image);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${t}</title>
<meta name="description" content="${d}" />
<link rel="canonical" href="${u}" />
<meta property="og:type" content="${esc(type)}" />
<meta property="og:site_name" content="Elaf-ul-Quran Academy" />
<meta property="og:title" content="${t}" />
<meta property="og:description" content="${d}" />
<meta property="og:url" content="${u}" />
<meta property="og:image" content="${img}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${t}" />
<meta name="twitter:description" content="${d}" />
<meta name="twitter:image" content="${img}" />
<meta http-equiv="refresh" content="0; url=${u}" />
</head>
<body>
<p><a href="${u}">${t}</a></p>
<p>${d}</p>
</body>
</html>`;
}

async function fetchCourse(id: string) {
  try {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/courses?id=eq.${encodeURIComponent(
        id,
      )}&select=id,title,description,thumbnail_url,is_published&limit=1`,
      {
        headers: {
          apikey: SUPABASE_ANON,
          Authorization: `Bearer ${SUPABASE_ANON}`,
        },
      },
    );
    if (!r.ok) return null;
    const rows = (await r.json()) as Array<{
      id: string;
      title: string;
      description: string | null;
      thumbnail_url: string | null;
      is_published: boolean;
    }>;
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

async function fetchPost(slug: string) {
  try {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/blog_posts?slug=eq.${encodeURIComponent(
        slug,
      )}&select=slug,title,excerpt,cover_image_url,is_published&limit=1`,
      {
        headers: {
          apikey: SUPABASE_ANON,
          Authorization: `Bearer ${SUPABASE_ANON}`,
        },
      },
    );
    if (!r.ok) return null;
    const rows = (await r.json()) as Array<{
      slug: string;
      title: string;
      excerpt: string | null;
      cover_image_url: string | null;
      is_published: boolean;
    }>;
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

export default async function middleware(request: Request): Promise<Response> {
  const ua = request.headers.get("user-agent") || "";
  const isBot = BOT_RE.test(ua);

  // Real browsers: don't touch anything, let the static SPA serve normally.
  if (!isBot) return new Response(null, { headers: { "x-middleware-next": "1" } });

  const url = new URL(request.url);
  const parts = url.pathname.split("/").filter(Boolean);

  // /courses/:id (but not bare /courses, which is a static marketing page)
  if (parts[0] === "courses" && parts[1]) {
    const course = await fetchCourse(parts[1]);
    const canonical = `${SITE}/courses/${parts[1]}`;
    if (course && course.is_published) {
      const html = renderHtml({
        title: `${course.title} | Elaf-ul-Quran Academy`,
        description:
          course.description?.slice(0, 200) ||
          "Enroll in this online Quran course with Ustadha Afshan Imran.",
        url: canonical,
        image: course.thumbnail_url || DEFAULT_OG,
        type: "article",
      });
      return new Response(html, {
        status: 200,
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "public, max-age=300, s-maxage=600",
        },
      });
    }
  }

  // /blog/:slug
  if (parts[0] === "blog" && parts[1]) {
    const post = await fetchPost(parts[1]);
    const canonical = `${SITE}/blog/${parts[1]}`;
    if (post && post.is_published) {
      const html = renderHtml({
        title: `${post.title} — Elaf-ul-Quran Academy`,
        description: post.excerpt?.slice(0, 200) || DEFAULT_DESC,
        url: canonical,
        image: post.cover_image_url || DEFAULT_OG,
        type: "article",
      });
      return new Response(html, {
        status: 200,
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "public, max-age=300, s-maxage=600",
        },
      });
    }
  }

  // Fallback for bots on any other matched route: generic homepage-style preview.
  const html = renderHtml({
    title: DEFAULT_TITLE,
    description: DEFAULT_DESC,
    url: `${SITE}${url.pathname}`,
    image: DEFAULT_OG,
  });
  return new Response(html, {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=300, s-maxage=600",
    },
  });
}
