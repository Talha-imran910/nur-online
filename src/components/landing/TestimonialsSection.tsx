import { Star, Quote } from "lucide-react";
import { testimonials } from "@/lib/mock-data";
import { useScrollReveal } from "@/hooks/use-animations";
import { IslamicDivider } from "@/components/IslamicDecorations";

export default function TestimonialsSection() {
  const titleRef = useScrollReveal();
  const gridRef = useScrollReveal(0.1);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div ref={titleRef} className="reveal text-center mb-14">
          <p className="text-gold font-medium text-sm tracking-widest uppercase mb-2">✦ JazakAllah Khair ✦</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
            What Our <span className="text-primary">Students Say</span>
          </h2>
          <IslamicDivider className="mt-4" opacity={0.2} />
        </div>

        <div ref={gridRef} className="stagger-children grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonials.map((t, i) => (
            <div key={i} className="glass-card rounded-xl p-6 relative hover-lift group">
              <Quote className="h-8 w-8 text-gold/20 absolute top-5 right-5 transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12" />
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-3.5 w-3.5 text-gold fill-gold" />
                ))}
              </div>
              <p className="text-foreground/75 text-sm leading-relaxed italic">"{t.text}"</p>
              <p className="mt-4 font-serif font-bold text-primary text-sm">{t.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
