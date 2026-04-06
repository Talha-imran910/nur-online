import { Link } from "react-router-dom";
import { subjects } from "@/lib/mock-data";

export default function SubjectsSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-gold font-medium text-sm tracking-widest uppercase mb-2">Our Disciplines</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
            Fields of <span className="text-primary">Islamic Knowledge</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Explore a wide range of Islamic sciences taught by qualified scholars, from Quran recitation to Islamic jurisprudence.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {subjects.map((s) => (
            <Link
              key={s.id}
              to={`/courses?subject=${s.id}`}
              className="group glass-card rounded-xl p-6 text-center hover:shadow-elegant hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-4xl mb-3">{s.icon}</div>
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
