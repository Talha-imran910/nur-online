interface IslamicDividerProps {
  className?: string;
  opacity?: number;
}

// Pure SVG divider — replaces the old 2.7MB PNG for a massive perf win.
export function IslamicDivider({ className = "", opacity = 0.3 }: IslamicDividerProps) {
  return (
    <div className={`w-full py-2 ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 600 24"
        className="w-full max-w-xl mx-auto h-6 text-gold"
        style={{ opacity }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <line x1="0" y1="12" x2="260" y2="12" stroke="currentColor" strokeWidth="1" />
        <line x1="340" y1="12" x2="600" y2="12" stroke="currentColor" strokeWidth="1" />
        <g transform="translate(300 12)">
          <polygon
            points="0,-10 2.9,-3.1 10,-3.1 4.3,1.2 6.5,8.1 0,3.9 -6.5,8.1 -4.3,1.2 -10,-3.1 -2.9,-3.1"
            fill="currentColor"
            opacity="0.6"
          />
          <circle cx="-24" cy="0" r="1.6" fill="currentColor" />
          <circle cx="24" cy="0" r="1.6" fill="currentColor" />
        </g>
      </svg>
    </div>
  );
}

export function IslamicStar({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={`text-gold ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
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
