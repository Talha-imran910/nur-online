import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { IslamicDivider, ArabicQuote } from "@/components/IslamicDecorations";
import { Button } from "@/components/ui/button";
import { whatsappUrl, SITE_URL } from "@/lib/contact";
import { MessageCircle } from "lucide-react";

const FAQS = [
  {
    q: "How much do the classes cost?",
    a: "Free introductory content (Nazra basics, sample Tajweed lessons) is available on the site with no signup fee. Paid one-on-one courses are affordable and priced in PKR — you can see each course price on its page. Final enrollment and payment for paid courses is arranged over WhatsApp so we can guide you through the easiest payment method for your country.",
  },
  {
    q: "How do the classes actually work?",
    a: "Every student learns one-on-one with Ustadha Afshan Imran over a live video call at a time that suits you. Recorded lessons are also available inside the course player on this website so you can review anything you missed. There are no large group classes — every student gets the teacher's full attention.",
  },
  {
    q: "How do I enroll? Why WhatsApp?",
    a: "Free courses enroll instantly the moment you sign up. Paid courses open a pre-filled WhatsApp message to Ustadha Afshan so she can confirm your preferred time slot, arrange payment (bank transfer, EasyPaisa, JazzCash, or international transfer) and add you to the course. This keeps enrollment personal instead of automated.",
  },
  {
    q: "What ages do you teach?",
    a: "Children from around age 5, teenagers, and adults are all welcome. The teacher adjusts pace and style for the student — kids get patient, gentle instruction; adults can move faster. Female students and children are especially catered for, in shaa Allah.",
  },
  {
    q: "Are the classes live or recorded?",
    a: "Both. The core teaching happens in live one-on-one calls. Supporting video lessons and notes are provided on the site so you can review at your own pace between live sessions.",
  },
  {
    q: "Do you offer a refund if I change my mind?",
    a: "Yes — if you attend the first paid class and decide it's not the right fit, message on WhatsApp within 7 days and any unused fees will be refunded. There is no charge at all for free courses.",
  },
  {
    q: "Do students get a certificate?",
    a: "Yes. On completing a full course (e.g. Tajweed Mastery, Nazra Quran), students receive a signed digital certificate from Elaf-ul-Quran Academy that they can print or share.",
  },
  {
    q: "What do I need to start?",
    a: "A phone, tablet, or computer with a working camera and microphone, a reasonably stable internet connection, and a copy of the Quran. That's it. No paid software required.",
  },
  {
    q: "Which languages do you teach in?",
    a: "Classes are taught in English and Urdu — the teacher will switch to whatever the student is most comfortable with, especially for younger children.",
  },
];

export default function Faq() {
  const canonical = `${SITE_URL}/faq`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>FAQ — Online Quran Classes | Elaf-ul-Quran Academy</title>
        <meta name="description" content="Answers about pricing, enrollment, age range, refunds, certificates and how one-on-one online Quran classes with Elaf-ul-Quran Academy work." />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content="FAQ | Elaf-ul-Quran Academy" />
        <meta property="og:description" content="Common questions about our online Quran, Tajweed and Tafseer classes." />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <Navbar />

      <section className="relative overflow-hidden islamic-overlay">
        <div className="absolute inset-0 gradient-hero" />
        <div className="relative z-10 container mx-auto px-4 py-14 max-w-3xl text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-cream">Frequently Asked Questions</h1>
          <p className="mt-4 text-cream/70 text-lg">
            Everything parents and students usually want to know before starting.
          </p>
        </div>
      </section>

      <section className="py-14 px-4 flex-1">
        <div className="container mx-auto max-w-3xl">
          <IslamicDivider className="mb-8" opacity={0.15} />
          <Accordion type="single" collapsible className="glass-card rounded-2xl px-4">
            {FAQS.map((f, i) => (
              <AccordionItem key={i} value={`q-${i}`}>
                <AccordionTrigger className="text-left font-serif text-base md:text-lg">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="glass-card rounded-2xl p-6 mt-10 text-center">
            <h2 className="font-serif text-xl font-bold text-foreground">Still have a question?</h2>
            <p className="text-sm text-muted-foreground mt-1">Message Ustadha Afshan directly on WhatsApp — she reads every message personally.</p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <a href={whatsappUrl("Assalamu Alaikum! I have a question about your Quran classes.")} target="_blank" rel="noopener noreferrer">
                <Button variant="emerald"><MessageCircle className="h-4 w-4 mr-1" /> Chat on WhatsApp</Button>
              </a>
              <Link to="/courses"><Button variant="outline">Browse Courses</Button></Link>
            </div>
          </div>

          <ArabicQuote text="وَقُل رَّبِّ زِدْنِي عِلْمًا" className="mt-10" />
          <p className="text-xs text-muted-foreground text-center mt-1 italic">"My Lord, increase me in knowledge" — Quran 20:114</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
