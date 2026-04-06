import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/use-animations";
import aboutMosque from "@/assets/about-mosque.jpg";
import { ArabicQuote } from "@/components/IslamicDecorations";

export default function CTASection() {
  const ref = useScrollReveal();

  return (
    <section className="relative py-28 overflow-hidden">
      <div className="absolute inset-0">
        <img src={aboutMosque} alt="" loading="lazy" className="w-full h-full object-cover" />
        <div className="absolute inset-0 gradient-hero opacity-92" />
      </div>
      <div ref={ref} className="reveal relative z-10 container mx-auto px-4 text-center">
        <ArabicQuote text="إِقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ" className="mb-6 !text-gold/40" />
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-cream mb-6">
          Begin Your Journey with the Quran
        </h2>
        <p className="text-cream/60 max-w-2xl mx-auto mb-8 text-lg leading-relaxed">
          Join Elaf-ul-Quran Academy and learn from Ustadha Afshan Imran. 
          Online classes worldwide 🌍 with flexible timings — perfect for women, children, and families.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/register">
            <Button variant="hero" size="lg" className="text-base px-10 animate-pulse-glow">
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
