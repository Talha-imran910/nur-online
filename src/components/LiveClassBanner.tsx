import { useState, useEffect } from "react";
import { Radio, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LiveClass {
  id: string;
  title: string;
  link: string;
  startTime: string;
  isLive: boolean;
}

// In a real app this would come from DB. For now, check localStorage.
function getLiveClass(): LiveClass | null {
  try {
    const data = localStorage.getItem("elaf_live_class");
    if (!data) return null;
    const parsed = JSON.parse(data);
    if (parsed.isLive) return parsed;
    return null;
  } catch {
    return null;
  }
}

export default function LiveClassBanner() {
  const [liveClass, setLiveClass] = useState<LiveClass | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const check = () => setLiveClass(getLiveClass());
    check();
    const interval = setInterval(check, 5000); // poll every 5s
    return () => clearInterval(interval);
  }, []);

  if (!liveClass || dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-destructive/90 to-destructive text-destructive-foreground animate-slide-up">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2 shrink-0">
            <Radio className="h-4 w-4 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">LIVE NOW</span>
          </div>
          <span className="text-sm font-medium truncate">{liveClass.title}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a href={liveClass.link} target="_blank" rel="noopener noreferrer">
            <Button size="sm" className="bg-white text-destructive hover:bg-white/90 gap-1.5 text-xs font-bold rounded-full">
              Join Now <ExternalLink className="h-3 w-3" />
            </Button>
          </a>
          <button onClick={() => setDismissed(true)} className="text-white/70 hover:text-white p-1">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
