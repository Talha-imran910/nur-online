import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, BookOpen, Users, Award } from "lucide-react";
import heroMosque from "@/assets/hero-mosque.jpg";

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroMosque} alt="" className="w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 gradient-hero opacity-85" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-3xl">
          <p className="text-gold font-medium tracking-widest uppercase text-sm mb-4 animate-fade-in">
            ✦ Islamic Learning Platform
          </p>
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-cream leading-tight animate-slide-up">
            Illuminate Your Path with
            <span className="text-gradient-gold block mt-2">Sacred Knowledge</span>
          </h1>
          <p className="mt-6 text-lg text-cream/70 max-w-xl animate-slide-up" style={{ animationDelay: "0.2s" }}>
            Embark on a transformative journey through Quran, Hadith, Fiqh, and more.
            Learn at your own pace with expert-guided courses rooted in authentic Islamic scholarship.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <Link to="/courses">
              <Button variant="hero" size="lg" className="text-base px-8">
                <BookOpen className="mr-2 h-5 w-5" />
                Explore Courses
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="heroOutline" size="lg" className="text-base px-8">
                <Play className="mr-2 h-5 w-5" />
                Start Learning Free
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-14 grid grid-cols-3 gap-8 max-w-md animate-slide-up" style={{ animationDelay: "0.4s" }}>
            {[
              { icon: BookOpen, label: "Courses", value: "6+" },
              { icon: Users, label: "Students", value: "500+" },
              { icon: Award, label: "Rating", value: "4.8★" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="h-6 w-6 text-gold mx-auto mb-2" />
                <p className="text-2xl font-bold text-cream">{stat.value}</p>
                <p className="text-xs text-cream/50 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative bottom curve */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 100L1440 100L1440 40C1440 40 1080 0 720 0C360 0 0 40 0 40L0 100Z" fill="hsl(var(--background))" />
        </svg>
      </div>
    </section>
  );
}
