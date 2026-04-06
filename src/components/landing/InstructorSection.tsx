import { INSTRUCTOR } from "@/lib/mock-data";
import { useScrollReveal } from "@/hooks/use-animations";
import { IslamicDivider, ArabicQuote } from "@/components/IslamicDecorations";
import { BookOpen, Heart, Globe, Clock } from "lucide-react";

export default function InstructorSection() {
  const ref = useScrollReveal();

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div ref={ref} className="reveal max-w-4xl mx-auto text-center">
          <p className="text-gold font-medium text-sm tracking-widest uppercase mb-2">✦ Your Teacher ✦</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-2">
            Meet <span className="text-primary">{INSTRUCTOR.name}</span>
          </h2>
          <p className="text-muted-foreground text-sm mb-6">Founder, {INSTRUCTOR.academy}</p>
          <IslamicDivider className="mb-8" opacity={0.2} />

          <div className="glass-card rounded-2xl p-8 md:p-12 text-left">
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="h-28 w-28 rounded-full bg-primary/10 flex items-center justify-center text-6xl shrink-0 mx-auto md:mx-0 animate-float">
                🧕
              </div>
              <div className="flex-1">
                <p className="text-muted-foreground leading-relaxed mb-6">{INSTRUCTOR.bio}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { icon: BookOpen, text: "Nazra Quran with Tajweed" },
                    { icon: Heart, text: "Tafseer & Spiritual Tarbiyat" },
                    { icon: Globe, text: "Online Classes Worldwide" },
                    { icon: Clock, text: "Flexible Timings" },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-2 text-sm text-foreground">
                      <item.icon className="h-4 w-4 text-gold shrink-0" />
                      {item.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <ArabicQuote text="وَعَلَّمَكَ مَا لَمْ تَكُن تَعْلَمُ" className="mt-8" />
          <p className="text-xs text-muted-foreground mt-1 italic">"And He taught you that which you knew not" — Quran 4:113</p>
        </div>
      </div>
    </section>
  );
}
