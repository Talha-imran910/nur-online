/**
 * Central contact config. Reads from Vite env (VITE_WHATSAPP_NUMBER).
 * Number is NOT hardcoded in source files — it is injected at build time
 * from the .env file (which is git-ignored), so the raw value never lives
 * in the source tree. (Note: like any client-side app, the final compiled
 * bundle still contains the value once built.)
 */
const ENV_NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined)?.trim();

// Fallback ensures the button always opens a real chat even if the
// VITE_WHATSAPP_NUMBER env var isn't configured on the host.
export const WHATSAPP_NUMBER = ENV_NUMBER && ENV_NUMBER.length > 0 ? ENV_NUMBER : "923329705522";

export const SITE_URL =
  (import.meta.env.VITE_SITE_URL as string | undefined)?.trim() ||
  "https://elaf-ul-quran.vercel.app";

export function whatsappUrl(message?: string): string {
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${WHATSAPP_NUMBER}${text}`;
}
