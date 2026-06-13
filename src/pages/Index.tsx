import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/landing/HeroSection";
import SubjectsSection from "@/components/landing/SubjectsSection";
import FeaturedCourses from "@/components/landing/FeaturedCourses";
import InstructorSection from "@/components/landing/InstructorSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import CTASection from "@/components/landing/CTASection";
import WhatsAppButton from "@/components/WhatsAppButton";
import LiveClassBanner from "@/components/LiveClassBanner";
import { SITE_URL } from "@/lib/contact";

export default function Index() {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Elaf-ul-Quran Academy — Learn Quran Online with Tajweed, Tafseer & More</title>
        <meta name="description" content="Elaf-ul-Quran Academy — Learn Nazra Quran with Tajweed, Tafseer, Daily Duas & Sunnah practices. Online Quran classes for children & adults worldwide. Join Ustadha Afshan Imran." />
        <link rel="canonical" href={`${SITE_URL}/`} />
        <meta property="og:url" content={`${SITE_URL}/`} />
      </Helmet>
      <LiveClassBanner />
      <Navbar />
      <HeroSection />
      <SubjectsSection />
      <FeaturedCourses />
      <InstructorSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
