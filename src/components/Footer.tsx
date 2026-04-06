import { Link } from "react-router-dom";
import bismillahLogo from "@/assets/bismillah-logo.png";

export default function Footer() {
  return (
    <footer className="bg-navy text-cream/80 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src={bismillahLogo} alt="Noor Academy" className="h-10 w-10 object-contain brightness-200" />
              <span className="font-serif text-xl font-bold text-cream">Noor Academy</span>
            </div>
            <p className="text-sm text-cream/60 leading-relaxed">
              Illuminating hearts and minds through authentic Islamic education, guided by the Quran and Sunnah.
            </p>
          </div>

          <div>
            <h4 className="font-serif text-lg text-gold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/courses" className="hover:text-gold transition-colors">All Courses</Link></li>
              <li><Link to="/about" className="hover:text-gold transition-colors">About Us</Link></li>
              <li><Link to="/login" className="hover:text-gold transition-colors">Student Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg text-gold mb-4">Subjects</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="hover:text-gold transition-colors cursor-pointer">Quran Studies</span></li>
              <li><span className="hover:text-gold transition-colors cursor-pointer">Hadith Sciences</span></li>
              <li><span className="hover:text-gold transition-colors cursor-pointer">Fiqh</span></li>
              <li><span className="hover:text-gold transition-colors cursor-pointer">Arabic Language</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg text-gold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>info@nooracademy.com</li>
              <li>Follow us on social media</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-cream/10 text-center text-sm text-cream/40">
          <p>© {new Date().getFullYear()} Noor Academy. All rights reserved.</p>
          <p className="mt-1 font-serif text-gold/50">بسم الله الرحمن الرحيم</p>
        </div>
      </div>
    </footer>
  );
}
