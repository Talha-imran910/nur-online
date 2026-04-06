import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Play, Users, Award, Star } from "lucide-react";
import { useScrollReveal, useCountUp } from "@/hooks/use-animations";
import heroMosque from "@/assets/hero-mosque.jpg";
import elafLogo from "@/assets/elaf-logo.png";

export default function HeroSection() {
  const statsRef = useScrollReveal(0.3);

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden islamic-overlay">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img src={heroMosque} alt="" className="w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 gradient-hero opacity-88" />
      </div>

      {/* Floating decorative elements */}
      <div className="absolute top-20 right-10 w-32 h-32 opacity-10 animate-spin-slow hidden lg:block z-[2]">
        <svg viewBox="0 0 100 100"><polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill="none" stroke="hsl(40,80%,50%)" strokeWidth="0.5"/></svg>
      </div>
      <div className="absolute bottom-40 left-10 w-20 h-20 opacity-10 animate-float hidden lg:block z-[2]">
        <svg viewBox="0 0 100 100"><polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill="none" stroke="hsl(40,80%,50%)" strokeWidth="0.8"/></svg>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-3xl">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-6 animate-fade-in">
            <img src={elafLogo} alt="" className="h-14 w-14 object-contain brightness-200 animate-float" />
            <div>
              <p className="text-gold font-medium tracking-widest uppercase text-xs">بسم الله الرحمن الرحيم</p>
              <p className="text-cream/50 text-xs tracking-wide">Elaf-ul-Quran Academy</p>
            </div>
          </div>

          <h1 className="font-serif text-5xl md:text-7xl font-bold text-cream leading-tight animate-slide-up">
            Spreading the Light of the
            <span className="text-gradient-gold block mt-2">Holy Quran</span>
          </h1>
          <p className="mt-6 text-lg text-cream/65 max-w-xl animate-slide-up" style={{ animationDelay: "0.15s" }}>
            With love, understanding & spiritual guidance. Learn Nazra Quran with Tajweed,
            Tafseer, Daily Duas & more — from children to adults, beginners to advanced learners.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 animate-slide-up" style={{ animationDelay: "0.25s" }}>
            <Link to="/courses">
              <Button variant="hero" size="lg" className="text-base px-8 group">
                <BookOpen className="mr-2 h-5 w-5 transition-transform group-hover:rotate-12" />
                Explore Courses
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="heroOutline" size="lg" className="text-base px-8 group">
                <Play className="mr-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                Start Learning Free
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div ref={statsRef} className="reveal mt-14 grid grid-cols-4 gap-6 max-w-lg">
            <StatItem icon={BookOpen} label="Courses" end={5} suffix="+" />
            <StatItem icon={Users} label="Students" end={500} suffix="+" />
            <StatItem icon={Star} label="Rating" staticValue="4.9★" />
            <StatItem icon={Award} label="Worldwide" staticValue="🌍" />
          </div>
        </div>
      </div>

      {/* Bottom curve */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 120L1440 120L1440 50C1440 50 1080 0 720 0C360 0 0 50 0 50L0 120Z" fill="hsl(var(--background))" />
        </svg>
      </div>
    </section>
  );
}

function StatItem({ icon: Icon, label, end, suffix, staticValue }: {
  icon: any; label: string; end?: number; suffix?: string; staticValue?: string;
}) {
  const countRef = useCountUp(end || 0, 2000);

  return (
    <div className="text-center">
      <Icon className="h-5 w-5 text-gold mx-auto mb-2" />
      <p className="text-xl font-bold text-cream">
        {staticValue || <><span ref={countRef}>0</span>{suffix}</>}
      </p>
      <p className="text-[10px] text-cream/40 mt-0.5 uppercase tracking-wider">{label}</p>
    </div>
  );
}
