const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const usdCents = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const compact = new Intl.NumberFormat("en-US");

export function money(n: number): string {
  return usd.format(n);
}

/** What a listing with no published price says everywhere it would show one. */
export const PRICE_ON_REQUEST = "Call for pricing";

/** A price, or the on-request wording. Never renders a zero or a blank. */
export function priceText(n: number | undefined): string {
  return n === undefined ? PRICE_ON_REQUEST : usd.format(n);
}

/** $28,000 → "$28k". For ranges where the exact figure is noise. */
export function shortMoney(n: number): string {
  return n >= 1000 ? `$${Math.round(n / 1000)}k` : `$${n}`;
}

export function moneyRounded(n: number): string {
  return usdCents.format(Math.round(n));
}

export function num(n: number): string {
  return compact.format(n);
}

/** 14 → `14'-0"`, 13.5 → `13'-6"` */
export function feetInches(value: number): string {
  const ft = Math.floor(value);
  const inches = Math.round((value - ft) * 12);
  return `${ft}'-${inches}"`;
}

/**
 * Standard amortising payment.
 * `rate` is an annual percentage (6.75 → 6.75%), `years` the term.
 */
export function monthlyPayment(
  principal: number,
  rate: number,
  years: number,
): number {
  if (principal <= 0) return 0;
  const r = rate / 100 / 12;
  const n = years * 12;
  if (r === 0) return principal / n;
  return (principal * r) / (1 - Math.pow(1 + r, -n));
}

export function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

/**
 * Square footage as a label, or `undefined` when it is not published.
 *
 * `Listing.sqft` is a required number, so an imported home whose feed carries
 * no footprint arrives as `0`. Zero is not a measurement — it means nobody
 * said — and printing "0 sq ft" on a card is the same class of error as
 * printing a price of nothing. Callers that render footprint go through here
 * and drop the line when it comes back undefined.
 */
export function sqftText(sqft: number): string | undefined {
  return sqft > 0 ? `${num(sqft)} sq ft` : undefined;
}
