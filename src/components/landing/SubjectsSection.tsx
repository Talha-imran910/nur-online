import { Link } from "react-router-dom";
import { subjects } from "@/lib/mock-data";
import { useScrollReveal } from "@/hooks/use-animations";
import { IslamicDivider } from "@/components/IslamicDecorations";

export default function SubjectsSection() {
  const titleRef = useScrollReveal();
  const gridRef = useScrollReveal(0.1);

  return (
    <section className="py-20 bg-background relative">
      <div className="container mx-auto px-4">
        <div ref={titleRef} className="reveal text-center mb-14">
          <p className="text-gold font-medium text-sm tracking-widest uppercase mb-2">✦ What We Teach ✦</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
            Our <span className="text-primary">Quranic Disciplines</span>
          </h2>
          <IslamicDivider className="mt-4" opacity={0.2} />
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            From learning to read the Quran to understanding its deep meanings — 
            we offer a complete journey of Quranic education.
          </p>
        </div>

        <div ref={gridRef} className="stagger-children grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {subjects.map((s) => (
            <Link
              key={s.id}
              to={`/courses?subject=${s.id}`}
              className="group glass-card rounded-xl p-6 text-center hover-lift cursor-pointer"
            >
              <div className="text-4xl mb-3 transition-transform duration-500 group-hover:scale-125 group-hover:rotate-6">
                {s.icon}
              </div>
              <h3 className="font-serif text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                {s.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">{s.count} courses</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
