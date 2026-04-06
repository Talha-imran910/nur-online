import { Link } from "react-router-dom";
import elafLogo from "@/assets/elaf-logo.png";
import islamicDivider from "@/assets/islamic-divider.png";

export default function Footer() {
  return (
    <footer className="bg-navy text-cream/80 relative overflow-hidden">
      {/* Decorative divider */}
      <div className="w-full h-8 -mt-1">
        <img src={islamicDivider} alt="" className="w-full h-full object-cover opacity-40" />
      </div>

      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src={elafLogo} alt="Elaf-ul-Quran" className="h-12 w-12 object-contain brightness-200" />
              <div>
                <span className="font-serif text-xl font-bold text-cream block">Elaf-ul-Quran</span>
                <span className="text-[10px] text-cream/50 tracking-widest uppercase">Academy</span>
              </div>
            </div>
            <p className="text-sm text-cream/50 leading-relaxed">
              Spreading the light of the Holy Quran with love, understanding, and spiritual guidance.
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
            <h4 className="font-serif text-lg text-gold mb-4">Our Courses</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="hover:text-gold transition-colors cursor-pointer">Nazra Quran</span></li>
              <li><span className="hover:text-gold transition-colors cursor-pointer">Tajweed Mastery</span></li>
              <li><span className="hover:text-gold transition-colors cursor-pointer">Tafseer</span></li>
              <li><span className="hover:text-gold transition-colors cursor-pointer">Daily Duas</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg text-gold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-cream/60">
              <li>📧 info@elafulquran.com</li>
              <li>🌍 Online Classes Worldwide</li>
              <li>👩‍🏫 Female & Kids Friendly</li>
              <li>⏰ Flexible Timings</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-cream/10 text-center">
          <p className="font-serif text-xl text-gold/60 mb-2" style={{ fontFamily: "'Scheherazade New', serif" }}>
            بسم الله الرحمن الرحيم
          </p>
          <p className="text-sm text-cream/30">© {new Date().getFullYear()} Elaf-ul-Quran Academy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
