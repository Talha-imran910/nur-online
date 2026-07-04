import { Link } from "react-router-dom";
import elafLogo from "@/assets/elaf-logo.png";
import { IslamicDivider } from "@/components/IslamicDecorations";
import { whatsappUrl } from "@/lib/contact";

const SOCIAL_LINKS = [
  { label: "WhatsApp", emoji: "💬", href: whatsappUrl("Assalamu Alaikum!") },
  { label: "YouTube", emoji: "📺", href: "https://youtube.com/@elafulquran" },
  { label: "Facebook", emoji: "📘", href: "https://facebook.com/elafulquran" },
  { label: "Instagram", emoji: "📸", href: "https://instagram.com/elafulquran" },
];

export default function Footer() {
  return (
    <footer className="bg-navy text-cream/80 relative overflow-hidden">
      <IslamicDivider className="!py-0 -mt-1" opacity={0.35} />

      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src={elafLogo} alt="Elaf-ul-Quran Academy logo" width="48" height="48" loading="lazy" className="h-12 w-12 object-contain brightness-200" />
              <div>
                <span className="font-serif text-xl font-bold text-cream block">Elaf-ul-Quran</span>
                <span className="text-[10px] text-cream/50 tracking-widest uppercase">Academy</span>
              </div>
            </div>
            <p className="text-sm text-cream/50 leading-relaxed">
              Spreading the light of the Holy Quran with love, understanding, and spiritual guidance.
            </p>
            {/* Social links */}
            <div className="flex gap-3 mt-5">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-full bg-cream/5 hover:bg-cream/15 flex items-center justify-center text-lg transition-all duration-300 hover:scale-110"
                  aria-label={s.label}
                >
                  {s.emoji}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-serif text-lg text-gold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/courses" className="hover:text-gold transition-colors">All Courses</Link></li>
              <li><Link to="/blog" className="hover:text-gold transition-colors">Blog</Link></li>
              <li><Link to="/about" className="hover:text-gold transition-colors">About Us</Link></li>
              <li><Link to="/login" className="hover:text-gold transition-colors">Student Login</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-gold transition-colors">Privacy Policy</Link></li>
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
            <h4 className="font-serif text-lg text-gold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-cream/60">
              <li className="flex items-center gap-2">📧 info@elafulquran.com</li>
              <li className="flex items-center gap-2">🌍 Online Classes Worldwide</li>
              <li className="flex items-center gap-2">👩‍🏫 Female & Kids Friendly</li>
              <li className="flex items-center gap-2">⏰ Flexible Timings</li>
              <li>
                <a
                  href={whatsappUrl("Assalamu Alaikum!")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] rounded-full px-4 py-2 mt-2 text-xs font-medium transition-all duration-300 hover:scale-105"
                >
                  💬 Chat on WhatsApp
                </a>
              </li>
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
