import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/landing/HeroSection";
import SubjectsSection from "@/components/landing/SubjectsSection";
import FeaturedCourses from "@/components/landing/FeaturedCourses";
import InstructorSection from "@/components/landing/InstructorSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import LatestBlog from "@/components/landing/LatestBlog";
import CTASection from "@/components/landing/CTASection";
import WhatsAppButton from "@/components/WhatsAppButton";
import LiveClassBanner from "@/components/LiveClassBanner";
import { SITE_URL } from "@/lib/contact";

export default function Index() {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Online Quran Classes with Tajweed & Tafseer | Elaf-ul-Quran</title>
        <meta name="description" content="Learn Nazra Quran online with Tajweed, Tafseer, daily duas and Sunnah practices. Live one-on-one classes for children and adults worldwide with Ustadha Afshan Imran." />
        <link rel="canonical" href={`${SITE_URL}/`} />
        <meta property="og:url" content={`${SITE_URL}/`} />
        <script type="application/ld+json">{JSON.stringify([
          {
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "@id": `${SITE_URL}/#org`,
            name: "Elaf-ul-Quran Academy",
            url: `${SITE_URL}/`,
            logo: `${SITE_URL}/favicon.png`,
            description: "Online Quran academy offering Nazra, Tajweed, Tafseer & Islamic education for children and adults worldwide.",
            founder: { "@type": "Person", name: "Ustadha Afshan Imran" },
            areaServed: "Worldwide",
            sameAs: [
              "https://youtube.com/@elafulquran",
              "https://facebook.com/elafulquran",
              "https://instagram.com/elafulquran",
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "@id": `${SITE_URL}/#website`,
            url: `${SITE_URL}/`,
            name: "Elaf-ul-Quran Academy",
            publisher: { "@id": `${SITE_URL}/#org` },
          },
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": `${SITE_URL}/#webpage`,
            url: `${SITE_URL}/`,
            name: "Elaf-ul-Quran Academy: Online Quran Classes",
            about: { "@id": `${SITE_URL}/#org` },
            isPartOf: { "@id": `${SITE_URL}/#website` },
          },
        ])}</script>
      </Helmet>
      <LiveClassBanner />
      <Navbar />
      <HeroSection />
      <SubjectsSection />
      <FeaturedCourses />
      <InstructorSection />
      <TestimonialsSection />
      <LatestBlog />
      <CTASection />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
