import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/landing/HeroSection";
import SubjectsSection from "@/components/landing/SubjectsSection";
import FeaturedCourses from "@/components/landing/FeaturedCourses";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import CTASection from "@/components/landing/CTASection";

export default function Index() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <SubjectsSection />
      <FeaturedCourses />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
}
