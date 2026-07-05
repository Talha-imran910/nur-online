// Site-wide currency = Pakistani Rupees (PKR).
// Change here to affect all displayed prices + JSON-LD offers.
export const CURRENCY_CODE = "PKR";
export const CURRENCY_SYMBOL = "Rs";

export function formatPrice(amount: number | string | null | undefined): string {
  const n = Number(amount);
  if (!Number.isFinite(n) || n <= 0) return "Free";
  return `${CURRENCY_SYMBOL} ${Math.round(n).toLocaleString("en-PK")}`;
}
