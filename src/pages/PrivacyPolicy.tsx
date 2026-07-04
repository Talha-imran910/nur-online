import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SITE_URL, whatsappUrl } from "@/lib/contact";
import { IslamicDivider } from "@/components/IslamicDecorations";

const LAST_UPDATED = "July 4, 2026";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Privacy Policy | Elaf-ul-Quran Academy</title>
        <meta name="description" content="How Elaf-ul-Quran Academy collects, uses and protects your information when you register, enroll or contact us." />
        <link rel="canonical" href={`${SITE_URL}/privacy-policy`} />
        <meta property="og:url" content={`${SITE_URL}/privacy-policy`} />
      </Helmet>
      <Navbar />
      <section className="gradient-hero py-14 px-4 islamic-overlay">
        <div className="container mx-auto text-center relative z-10">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-cream">Privacy Policy</h1>
          <p className="mt-2 text-cream/60 text-sm">Last updated: {LAST_UPDATED}</p>
        </div>
      </section>

      <section className="flex-1 py-14 px-4">
        <div className="container mx-auto max-w-3xl prose prose-emerald max-w-none prose-headings:font-serif prose-a:text-gold">
          <p>
            Assalamu Alaikum. At Elaf-ul-Quran Academy we keep things simple. This page explains,
            in plain language, what information we collect when you visit or register, why we
            collect it, and how you can ask us to change or remove it. If anything here is
            unclear, please reach out and we will help.
          </p>

          <IslamicDivider className="my-6" opacity={0.15} />

          <h2>What we collect</h2>
          <ul>
            <li><strong>Account details</strong> when you register: your name and email address.</li>
            <li><strong>WhatsApp / phone number</strong> only if you message us to enroll or ask a question. Your number becomes visible to the academy so we can reply.</li>
            <li><strong>Enrollment and progress</strong> for the courses you sign up for (which lessons you have opened, and completion status).</li>
            <li><strong>Payment status</strong> for paid courses (whether an enrollment has been confirmed). We do not process card details on this site; paid enrollment is arranged manually over WhatsApp.</li>
          </ul>

          <h2>Why we collect it</h2>
          <p>
            To give you access to the courses you enroll in, keep track of your learning progress,
            reply to your questions, and let you know about live classes.
          </p>

          <h2>Where your data is stored</h2>
          <p>
            The website uses <strong>Supabase</strong> as its backend and database provider. That
            means your account and enrollment data sits inside a Supabase project managed by the
            academy. Supabase stores data on secure cloud servers and encrypts it in transit and at
            rest. We do not sell your data to anyone, and we do not share it with third parties for
            advertising.
          </p>

          <h2>Cookies and browser storage</h2>
          <p>
            We use your browser's local storage for one thing: keeping you signed in between visits
            (the Supabase authentication session). We do not use tracking cookies, analytics
            cookies, or third-party advertising cookies. Embedded lesson videos are loaded from
            YouTube's privacy-enhanced domain (<code>youtube-nocookie.com</code>) so they do not
            set tracking cookies on your device before you press play.
          </p>

          <h2>Communication over WhatsApp</h2>
          <p>
            The academy uses WhatsApp to answer enrollment and course questions. When you tap a
            "Chat on WhatsApp" button on the site, your device opens WhatsApp with a pre-written
            message. Once you press send, your WhatsApp number and any message you write are
            visible to the academy so we can reply. WhatsApp's own privacy policy applies to that
            conversation.
          </p>

          <h2>Children</h2>
          <p>
            Many of our students are children. Accounts for children under 13 should be created and
            managed by a parent or guardian. If you are a parent and you would like us to remove
            your child's account or progress data, contact us and we will do it.
          </p>

          <h2>How to change or delete your data</h2>
          <p>
            You can update your name from the Profile page after signing in. To delete your account
            or any of your data, or to correct anything that looks wrong, please reach out:
          </p>
          <ul>
            <li>Email: <a href="mailto:info@elafulquran.com">info@elafulquran.com</a></li>
            <li>WhatsApp: <a href={whatsappUrl("Assalamu Alaikum, I have a privacy question about my account.")} target="_blank" rel="noopener noreferrer">chat with us</a></li>
          </ul>

          <h2>Changes to this policy</h2>
          <p>
            If anything about how we handle your data changes, we will update this page and change
            the "last updated" date at the top. For questions about older versions of this policy,
            just ask.
          </p>

          <p className="text-sm text-muted-foreground mt-10">
            <Link to="/" className="text-primary hover:underline">← Back to home</Link>
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
}
