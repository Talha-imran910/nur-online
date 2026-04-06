import islamicDivider from "@/assets/islamic-divider.png";

interface IslamicDividerProps {
  className?: string;
  opacity?: number;
}

export function IslamicDivider({ className = "", opacity = 0.3 }: IslamicDividerProps) {
  return (
    <div className={`w-full py-2 ${className}`}>
      <img
        src={islamicDivider}
        alt=""
        className="w-full max-w-xl mx-auto h-6 object-contain"
        style={{ opacity }}
        loading="lazy"
      />
    </div>
  );
}

export function IslamicStar({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={`text-gold ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon
        points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35"
        fill="currentColor"
        opacity="0.15"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}

export function ArabicQuote({ text, className = "" }: { text: string; className?: string }) {
  return (
    <p
      className={`text-center text-gold/50 ${className}`}
      style={{ fontFamily: "'Scheherazade New', 'Amiri', serif", fontSize: "1.5rem" }}
      dir="rtl"
    >
      {text}
    </p>
  );
}
