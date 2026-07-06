import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Copy, Check } from "lucide-react";

interface Props {
  url: string;
  title: string;
}

export default function ShareButtons({ url, title }: Props) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const share = (target: "whatsapp" | "facebook") => {
    const text = encodeURIComponent(`${title} — ${url}`);
    const href =
      target === "whatsapp"
        ? `https://wa.me/?text=${text}`
        : `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(href, "_blank", "noopener,noreferrer,width=640,height=640");
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({ title: "Link copied!" });
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast({ title: "Copy failed", description: "Please copy the URL manually.", variant: "destructive" });
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium mr-1">Share:</span>
      <Button
        variant="outline"
        size="sm"
        className="gap-1.5 h-9 border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/10 hover:text-[#25D366]"
        onClick={() => share("whatsapp")}
        aria-label="Share on WhatsApp"
      >
        <span className="text-base leading-none">💬</span> WhatsApp
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="gap-1.5 h-9 border-[#1877F2]/40 text-[#1877F2] hover:bg-[#1877F2]/10 hover:text-[#1877F2]"
        onClick={() => share("facebook")}
        aria-label="Share on Facebook"
      >
        <span className="text-base leading-none">📘</span> Facebook
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="gap-1.5 h-9"
        onClick={copy}
        aria-label="Copy link"
      >
        {copied ? <Check className="h-4 w-4 text-emerald" /> : <Copy className="h-4 w-4" />}
        {copied ? "Copied" : "Copy link"}
      </Button>
    </div>
  );
}
