import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import aboutMosque from "@/assets/about-mosque.jpg";
import elafLogo from "@/assets/elaf-logo.png";
import { BookOpen, Heart, Users, Award, Globe, Clock, GraduationCap, Baby } from "lucide-react";
import { INSTRUCTOR } from "@/lib/mock-data";
import { useScrollReveal } from "@/hooks/use-animations";
import { IslamicDivider, ArabicQuote } from "@/components/IslamicDecorations";

export default function About() {
  const heroRef = useScrollReveal();
  const missionRef = useScrollReveal();
  const instructorRef = useScrollReveal();
  const offerRef = useScrollReveal(0.1);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src={aboutMosque} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 gradient-hero opacity-92" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <img src={elafLogo} alt="" className="h-24 mx-auto mb-6 brightness-200 animate-float" />
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-cream animate-slide-up">About Elaf-ul-Quran Academy</h1>
          <p className="mt-4 text-cream/60 max-w-2xl mx-auto text-lg animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Spreading the light of the Holy Quran with love, understanding, and spiritual guidance.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div ref={missionRef} className="reveal">
            <div className="text-center mb-12">
              <p className="text-gold font-medium text-sm tracking-widest uppercase mb-2">✦ Our Mission ✦</p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
                Making Quranic Education <span className="text-primary">Accessible & Inspiring</span>
              </h2>
              <IslamicDivider className="mt-4 mb-4" opacity={0.2} />
              <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Our mission is to make Quranic education easy, accessible, and inspiring for everyone — 
                from children to adults, from beginners to advanced learners. We believe every heart 
                deserves to connect with the words of Allah ﷻ.
              </p>
            </div>
          </div>

          <div ref={offerRef} className="stagger-children grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { icon: BookOpen, label: "Nazra with Tajweed", desc: "Proper Quran recitation" },
              { icon: Heart, label: "Tafseer & Translation", desc: "Easy Urdu translation" },
              { icon: GraduationCap, label: "Spiritual Tarbiyat", desc: "Duas, Sunnah & values" },
              { icon: Baby, label: "Kids Friendly", desc: "Safe, nurturing environment" },
              { icon: Globe, label: "Worldwide Access", desc: "Online classes globally" },
              { icon: Clock, label: "Flexible Timings", desc: "Learn at your pace" },
              { icon: Users, label: "Female Friendly", desc: "Comfortable environment" },
              { icon: Award, label: "Special Courses", desc: "Qaida, Namaz, Memorization" },
            ].map((item) => (
              <div key={item.label} className="glass-card rounded-xl p-5 text-center hover-lift">
                <item.icon className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-serif text-sm font-bold text-foreground">{item.label}</h3>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instructor */}
      <section className="py-20 px-4 bg-secondary/30">
        <div ref={instructorRef} className="reveal container mx-auto max-w-4xl text-center">
          <p className="text-gold font-medium text-sm tracking-widest uppercase mb-2">✦ Your Teacher ✦</p>
          <h2 className="font-serif text-3xl font-bold text-foreground mb-8">
            Meet <span className="text-primary">{INSTRUCTOR.name}</span>
          </h2>
          <div className="glass-card rounded-2xl p-8 md:p-12 text-left">
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="h-28 w-28 rounded-full bg-primary/10 flex items-center justify-center text-6xl shrink-0 mx-auto md:mx-0 animate-float">
                🧕
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-xl font-bold text-foreground mb-1">{INSTRUCTOR.name}</h3>
                <p className="text-sm text-gold mb-4">Founder, {INSTRUCTOR.academy}</p>
                <p className="text-muted-foreground leading-relaxed mb-6">{INSTRUCTOR.bio}</p>
                <div className="space-y-2">
                  {INSTRUCTOR.specialties.map((s) => (
                    <div key={s} className="flex items-center gap-2 text-sm">
                      <span className="text-gold">✦</span>
                      <span className="text-foreground">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <ArabicQuote text="رَبِّ زِدْنِي عِلْمًا" className="mt-8" />
          <p className="text-xs text-muted-foreground mt-1 italic">"My Lord, increase me in knowledge" — Quran 20:114</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
