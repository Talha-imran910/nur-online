import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "923305014489";
const MESSAGE = "Assalamu Alaikum! I'm interested in Quran courses at Elaf-ul-Quran Academy.";

export default function WhatsAppButton() {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(MESSAGE)}`;

  // Use window.open + break out of iframe so the wa.me redirect to api.whatsapp.com
  // doesn't get blocked by X-Frame-Options (ERR_BLOCKED_BY_RESPONSE) inside preview iframes.
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const win = window.open(url, "_blank", "noopener,noreferrer");
    if (!win) {
      // Popup blocked → fall back to top-level navigation
      try { (window.top || window).location.href = url; } catch { window.location.href = url; }
    }
  };

  return (
    <a
      href={url}
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="Contact on WhatsApp"
    >
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
        <div className="relative h-14 w-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-110">
          <MessageCircle className="h-7 w-7 text-white" fill="white" />
        </div>
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-foreground text-background text-xs font-medium px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Chat with us! 💬
          <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-foreground" />
        </div>
      </div>
    </a>
  );
}
