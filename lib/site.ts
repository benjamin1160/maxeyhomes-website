/**
 * Business identity for Maxey Custom Homes.
 *
 * Every value below is published by the business itself — on
 * maxeycustomhomes.com, in its own logo artwork, or in the page metadata of
 * that site. Nothing here is inferred. If a detail changes, change it here:
 * this file feeds the header, footer, contact page, metadata, JSON-LD,
 * sitemap and the OG image, and no page hard-codes a number or an address.
 */
export const site = {
  /* The trading name, as the site says it in its own header and footer. The
     registered entity is different — see `legalName` below. */
  name: "Maxey Custom Homes",
  short: "Maxey",
  tagline: "Find your dream home",
  description:
    "Maxey Custom Homes — Maxey Homes & Land, LLC — sells manufactured homes from 2548 Melba Ln in Norman, Oklahoma, with financing, delivery and setup handled for you. Over 85 years of combined experience across three generations.",
  /**
   * The registered entity, for the terms, the privacy policy and anything
   * contractual. The About page and the logo both give it; the rest of the
   * site trades as `name` above.
   */
  legalName: "Maxey Homes & Land, LLC",
  /**
   * `?.trim() ||` and not `??`, which is not a style preference.
   *
   * `??` only falls back on null and undefined, and a Vercel project with the
   * variable declared but left blank hands the build an EMPTY STRING. That
   * sails through `??`, `metadataBase: new URL("")` throws `ERR_INVALID_URL`,
   * and the whole build dies on `/_not-found` with a stack trace that names
   * neither this file nor the variable. `||` treats blank as absent, which is
   * what a blank variable means, and `.trim()` catches the stray-space
   * version of the same mistake.
   *
   * Every env var read in this codebase wants this shape — see `GHL_API_BASE`
   * and `GHL_API_VERSION` in `lib/ghl/client.ts`.
   */
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://www.maxeycustomhomes.com",
  phone: "405-288-1093",
  phoneHref: "tel:+14052881093",
  /**
   * Deliberately absent. Maxey publishes a telephone number and a street
   * address and no email address anywhere on its site, so every place that
   * would print one hides itself instead — the same rule `lib/company.ts`
   * follows. Fill it in the day the business publishes an inbox; do not
   * guess one from the domain.
   */
  email: undefined as string | undefined,
  address: {
    street: "2548 Melba Ln",
    city: "Norman",
    region: "OK",
    postalCode: "73072",
    country: "US",
  },
  /** The state spelled out, for prose and the terms. `address.region` stays
      the postal abbreviation because schema.org and the postal service want
      that one. */
  stateName: "Oklahoma",
  hours: "Mon–Sat, 8:30am–5:30pm · Closed Sunday",
  /**
   * The same opening hours, day by day, for the table on `/address` and the
   * landing page's location band. It has to agree with `hours` above — the
   * two are the same fact written twice, and a visitor who finds them
   * disagreeing will believe neither.
   *
   * Delete this and both places fall back to the one-line `hours`, which is
   * a perfectly good answer for a lot that keeps the same hours all week.
   */
  hoursByDay: [
    { day: "Monday", hours: "8:30 AM – 5:30 PM" },
    { day: "Tuesday", hours: "8:30 AM – 5:30 PM" },
    { day: "Wednesday", hours: "8:30 AM – 5:30 PM" },
    { day: "Thursday", hours: "8:30 AM – 5:30 PM" },
    { day: "Friday", hours: "8:30 AM – 5:30 PM" },
    { day: "Saturday", hours: "8:30 AM – 5:30 PM" },
    { day: "Sunday", hours: "Closed" },
  ] as { day: string; hours: string }[] | undefined,
} as const;
