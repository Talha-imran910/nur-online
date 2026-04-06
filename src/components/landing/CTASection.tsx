import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import aboutMosque from "@/assets/about-mosque.jpg";

export default function CTASection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0">
        <img src={aboutMosque} alt="" loading="lazy" className="w-full h-full object-cover" />
        <div className="absolute inset-0 gradient-hero opacity-90" />
      </div>
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-cream mb-6">
          Begin Your Journey of Knowledge
        </h2>
        <p className="text-cream/70 max-w-2xl mx-auto mb-8 text-lg">
          Join hundreds of students seeking authentic Islamic education. 
          Enroll today and take the first step towards enlightenment.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/register">
            <Button variant="hero" size="lg" className="text-base px-10">
              Join Now — It's Free
            </Button>
          </Link>
          <Link to="/courses">
            <Button variant="heroOutline" size="lg" className="text-base px-10">
              Browse Courses
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
