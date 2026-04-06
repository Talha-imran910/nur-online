import { Star, Quote } from "lucide-react";
import { testimonials } from "@/lib/mock-data";

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-gold font-medium text-sm tracking-widest uppercase mb-2">Student Voices</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
            What Our <span className="text-primary">Students Say</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="glass-card rounded-xl p-8 relative">
              <Quote className="h-8 w-8 text-gold/30 absolute top-6 right-6" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 text-gold fill-gold" />
                ))}
              </div>
              <p className="text-foreground/80 leading-relaxed italic">"{t.text}"</p>
              <p className="mt-4 font-serif font-bold text-primary">{t.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
