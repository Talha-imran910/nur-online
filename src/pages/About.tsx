import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import aboutMosque from "@/assets/about-mosque.jpg";
import bismillahLogo from "@/assets/bismillah-logo.png";
import { BookOpen, Heart, Users, Award } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative py-20">
        <div className="absolute inset-0">
          <img src={aboutMosque} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 gradient-hero opacity-90" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <img src={bismillahLogo} alt="" className="h-24 mx-auto mb-6 brightness-200" />
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-cream">About Noor Academy</h1>
          <p className="mt-4 text-cream/70 max-w-2xl mx-auto text-lg">
            Spreading the light of Islamic knowledge to every corner of the world.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-gold font-medium text-sm tracking-widest uppercase mb-2">Our Mission</p>
              <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
                Making Islamic Education Accessible
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Noor Academy was founded with a simple yet powerful vision: to make authentic Islamic education accessible to everyone, regardless of their location or background.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our courses are carefully designed to provide a comprehensive understanding of Islamic sciences, from Quran recitation and Tajweed to Hadith, Fiqh, and Arabic language — all delivered with love, patience, and scholarly rigor.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: BookOpen, label: "Expert Curriculum", desc: "Rooted in authentic scholarship" },
                { icon: Heart, label: "Taught with Love", desc: "Patient & supportive approach" },
                { icon: Users, label: "Growing Community", desc: "500+ students & counting" },
                { icon: Award, label: "Quality Content", desc: "Engaging video lessons" },
              ].map((item) => (
                <div key={item.label} className="glass-card rounded-xl p-5 text-center">
                  <item.icon className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-serif text-sm font-bold text-foreground">{item.label}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Instructor */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-gold font-medium text-sm tracking-widest uppercase mb-2">Your Teacher</p>
          <h2 className="font-serif text-3xl font-bold text-foreground mb-8">Meet Ustadha Fatima</h2>
          <div className="glass-card rounded-xl p-8 md:p-12 max-w-2xl mx-auto">
            <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-5xl mx-auto mb-6">
              🧕
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Ustadha Fatima is a passionate Islamic educator with extensive knowledge in Quran, Hadith, and Fiqh.
              With years of experience teaching students of all ages and backgrounds, she brings warmth, clarity,
              and deep expertise to every lesson. Her goal is to nurture a love for learning and a connection
              to the beautiful teachings of Islam.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
