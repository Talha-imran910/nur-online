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

export default function Index() {
  return (
    <div className="min-h-screen">
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
