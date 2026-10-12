import { milesFromHQ } from "./geo";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  THE LAND-DEALS PRICING. Every number on `/land-deals` comes from this file —
 *  the map, the county list, the detail card and the social preview image.
 *
 *  This is *market* data, in the sense of `lib/market.ts`: it is true of one
 *  dealership's delivery radius and of nowhere else.
 *
 *  ⚠ THE FIGURES BELOW ARE SAMPLE DATA. The counties, county seats, towns and
 *  mileages are real — every county whose seat is within about 90 miles of
 *  the lot on Melba Ln — but the payments and lot prices are PLACEHOLDERS,
 *  written so the page could go up before Maxey has priced its delivery
 *  radius. They are shaped roughly like the market (dearer around Oklahoma
 *  City, cheaper in the rural counties) and are no one's quote.
 *
 *  While `SAMPLE_DATA` is true the page says so in a banner above the map, on
 *  the detail card, in the county list, in the social image and in the fine
 *  print, and keeps the figures out of its search-engine data. Replace every
 *  `startingPayment`, `land` and `lotTypical` with real numbers, then set
 *  `SAMPLE_DATA` to false — that one switch takes every notice down.
 *
 *  `startingPayment`  estimated monthly payment on a land + home package, i.e.
 *                     the cheapest realistic way into that county today.
 *  `land`             what a buildable lot actually trades for in that county.
 *  `lotTypical`       the parcel size those numbers assume.
 *
 *  Adding a county also means adding it to `PRICED` in
 *  `scripts/generate-county-shapes.py` and regenerating, so its shape on the
 *  map carries its slug.
 *
 *  Payment estimates assume one loan covering land and home, 20% down, ~20–23
 *  year term, on approved credit. Update `PAYMENT_ASSUMPTIONS` below whenever
 *  rates or programs move, and keep the disclaimer honest.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** The prices below are placeholders. See the head of this file. */
export const SAMPLE_DATA = true;

export const PAYMENT_ASSUMPTIONS =
  "Estimates assume a land-and-home package financed as one loan with 20% down over a 20–23 year term, taxes and insurance escrowed, on approved credit. Your rate, term, and payment depend on credit, down payment, land cost, and site work.";

export type Area = {
  slug: string;
  county: string;
  /** The town the marker sits on. */
  seat: string;
  /** Other towns buyers search in this county. */
  towns: string[];
  lat: number;
  lon: number;
  /** Estimated starting monthly payment, land + home, one loan. */
  startingPayment: number;
  /** Typical buildable-lot price range, in dollars. */
  land: { low: number; high: number };
  lotTypical: string;
  /** One line of local reality: zoning, utilities, what sells there. */
  note: string;
  /** Which side of the star its label sits on. */
  labelSide: "n" | "s" | "e" | "w";
  /** Optional fine-tuning of the label, in map units (miles). */
  dx?: number;
  dy?: number;
};

/* Real counties and seats; SAMPLE payments and lot prices — see the head of
   this file. */
const RAW: Area[] = [
  {
    slug: "cleveland",
    county: "Cleveland",
    seat: "Norman",
    towns: ["Moore", "Noble", "Lexington"],
    lat: 35.2226,
    lon: -97.4395,
    startingPayment: 1695,
    land: { low: 45000, high: 95000 },
    lotTypical: "1 – 3 acres",
    note: "Home county. Acreage east of Lake Thunderbird, city lots in Norman and Moore.",
    labelSide: "w",
  },
  {
    slug: "oklahoma",
    county: "Oklahoma",
    seat: "Oklahoma City",
    towns: ["Edmond", "Midwest City", "Choctaw"],
    lat: 35.4676,
    lon: -97.5164,
    startingPayment: 1745,
    land: { low: 50000, high: 110000 },
    lotTypical: "1 – 3 acres",
    note: "The metro. Most acreage is out east toward Choctaw, Harrah and Luther.",
    labelSide: "n",
  },
  {
    slug: "mcclain",
    county: "McClain",
    seat: "Purcell",
    towns: ["Newcastle", "Blanchard", "Washington"],
    lat: 35.0137,
    lon: -97.3611,
    startingPayment: 1575,
    land: { low: 35000, high: 80000 },
    lotTypical: "1 – 5 acres",
    note: "Just across the Canadian River; Newcastle and Blanchard for a short drive in.",
    labelSide: "e",
  },
  {
    slug: "grady",
    county: "Grady",
    seat: "Chickasha",
    towns: ["Tuttle", "Minco", "Ninnekah"],
    lat: 35.0526,
    lon: -97.9364,
    startingPayment: 1465,
    land: { low: 25000, high: 60000 },
    lotTypical: "2 – 5 acres",
    note: "Tuttle on the metro side, open country toward Chickasha.",
    labelSide: "s",
  },
  {
    slug: "canadian",
    county: "Canadian",
    seat: "El Reno",
    towns: ["Yukon", "Mustang", "Piedmont"],
    lat: 35.5323,
    lon: -97.955,
    startingPayment: 1725,
    land: { low: 45000, high: 100000 },
    lotTypical: "1 – 3 acres",
    note: "Yukon, Mustang and Piedmont on the west side of the metro.",
    labelSide: "n",
  },
  {
    slug: "pottawatomie",
    county: "Pottawatomie",
    seat: "Shawnee",
    towns: ["Tecumseh", "McLoud", "Wanette"],
    lat: 35.3273,
    lon: -96.9253,
    startingPayment: 1455,
    land: { low: 25000, high: 60000 },
    lotTypical: "2 – 5 acres",
    note: "Shawnee and Tecumseh, an easy run up I-40 or OK-9.",
    labelSide: "s",
  },
  {
    slug: "garvin",
    county: "Garvin",
    seat: "Pauls Valley",
    towns: ["Lindsay", "Wynnewood", "Maysville"],
    lat: 34.7401,
    lon: -97.2222,
    startingPayment: 1360,
    land: { low: 18000, high: 45000 },
    lotTypical: "2 – 10 acres",
    note: "Straight down I-35; Pauls Valley and the farm country around it.",
    labelSide: "w",
  },
  {
    slug: "lincoln",
    county: "Lincoln",
    seat: "Chandler",
    towns: ["Stroud", "Prague", "Meeker"],
    lat: 35.7017,
    lon: -96.8809,
    startingPayment: 1395,
    land: { low: 20000, high: 50000 },
    lotTypical: "2 – 10 acres",
    note: "Route 66 towns and rolling acreage along the Turner Turnpike.",
    labelSide: "e",
  },
  {
    slug: "seminole",
    county: "Seminole",
    seat: "Wewoka",
    towns: ["Seminole", "Konawa", "Bowlegs"],
    lat: 35.1587,
    lon: -96.4934,
    startingPayment: 1295,
    land: { low: 15000, high: 40000 },
    lotTypical: "2 – 10 acres",
    note: "Quiet county east of Shawnee with some of the cheapest acreage in range.",
    labelSide: "n",
  },
  {
    slug: "pontotoc",
    county: "Pontotoc",
    seat: "Ada",
    towns: ["Allen", "Roff", "Stonewall"],
    lat: 34.7745,
    lon: -96.6783,
    startingPayment: 1425,
    land: { low: 20000, high: 50000 },
    lotTypical: "2 – 10 acres",
    note: "Ada and the country around it.",
    labelSide: "e",
  },
  {
    slug: "stephens",
    county: "Stephens",
    seat: "Duncan",
    towns: ["Marlow", "Comanche", "Velma"],
    lat: 34.5023,
    lon: -97.9578,
    startingPayment: 1375,
    land: { low: 18000, high: 45000 },
    lotTypical: "2 – 10 acres",
    note: "Duncan and Marlow, off US-81.",
    labelSide: "s",
  },
  {
    slug: "murray",
    county: "Murray",
    seat: "Sulphur",
    towns: ["Davis", "Dougherty"],
    lat: 34.5076,
    lon: -96.9684,
    startingPayment: 1345,
    land: { low: 18000, high: 45000 },
    lotTypical: "2 – 10 acres",
    note: "Sulphur and Davis, at the foot of the Arbuckles.",
    labelSide: "w",
  },
  {
    slug: "caddo",
    county: "Caddo",
    seat: "Anadarko",
    towns: ["Hinton", "Apache", "Carnegie"],
    lat: 35.0726,
    lon: -98.2434,
    startingPayment: 1310,
    land: { low: 15000, high: 40000 },
    lotTypical: "5 – 20 acres",
    note: "Wide-open land west of Chickasha.",
    labelSide: "n",
  },
  {
    slug: "logan",
    county: "Logan",
    seat: "Guthrie",
    towns: ["Crescent", "Langston", "Cashion"],
    lat: 35.8789,
    lon: -97.4253,
    startingPayment: 1610,
    land: { low: 30000, high: 75000 },
    lotTypical: "2 – 5 acres",
    note: "North of Edmond: Guthrie and the acreage around it.",
    labelSide: "e",
  },
  {
    slug: "carter",
    county: "Carter",
    seat: "Ardmore",
    towns: ["Healdton", "Wilson", "Lone Grove"],
    lat: 34.1743,
    lon: -97.1436,
    startingPayment: 1415,
    land: { low: 20000, high: 50000 },
    lotTypical: "2 – 10 acres",
    note: "Ardmore and Lone Grove, near the south end of the radius.",
    labelSide: "w",
  },
  {
    slug: "hughes",
    county: "Hughes",
    seat: "Holdenville",
    towns: ["Wetumka", "Calvin", "Stuart"],
    lat: 35.0801,
    lon: -96.3992,
    startingPayment: 1265,
    land: { low: 12000, high: 35000 },
    lotTypical: "5 – 20 acres",
    note: "Rural and inexpensive, east of Seminole.",
    labelSide: "s",
  },
  {
    slug: "kingfisher",
    county: "Kingfisher",
    seat: "Kingfisher",
    towns: ["Hennessey", "Okarche", "Dover"],
    lat: 35.8614,
    lon: -97.9317,
    startingPayment: 1495,
    land: { low: 20000, high: 55000 },
    lotTypical: "2 – 10 acres",
    note: "Wheat country north-west of the metro.",
    labelSide: "n",
  },
  {
    slug: "okfuskee",
    county: "Okfuskee",
    seat: "Okemah",
    towns: ["Weleetka", "Boley", "Paden"],
    lat: 35.4326,
    lon: -96.305,
    startingPayment: 1255,
    land: { low: 12000, high: 35000 },
    lotTypical: "5 – 20 acres",
    note: "Small towns off I-40, among the cheapest land in range.",
    labelSide: "e",
  },
  {
    slug: "payne",
    county: "Payne",
    seat: "Stillwater",
    towns: ["Cushing", "Perkins", "Yale"],
    lat: 36.1156,
    lon: -97.0584,
    startingPayment: 1560,
    land: { low: 30000, high: 70000 },
    lotTypical: "1 – 5 acres",
    note: "Stillwater and the country around Perkins and Cushing.",
    labelSide: "e",
  },
  {
    slug: "comanche",
    county: "Comanche",
    seat: "Lawton",
    towns: ["Elgin", "Cache", "Fletcher"],
    lat: 34.6036,
    lon: -98.3959,
    startingPayment: 1445,
    land: { low: 20000, high: 55000 },
    lotTypical: "1 – 5 acres",
    note: "Lawton, Elgin and the land around Fort Sill.",
    labelSide: "s",
  },
  {
    slug: "blaine",
    county: "Blaine",
    seat: "Watonga",
    towns: ["Okeene", "Geary", "Hitchcock"],
    lat: 35.8448,
    lon: -98.4134,
    startingPayment: 1300,
    land: { low: 15000, high: 40000 },
    lotTypical: "5 – 20 acres",
    note: "Watonga and Geary, out past Roman Nose.",
    labelSide: "s",
  },
  {
    slug: "johnston",
    county: "Johnston",
    seat: "Tishomingo",
    towns: ["Milburn", "Mill Creek", "Wapanucka"],
    lat: 34.2362,
    lon: -96.6789,
    startingPayment: 1285,
    land: { low: 12000, high: 35000 },
    lotTypical: "5 – 20 acres",
    note: "Tishomingo and the lake country above Texoma.",
    labelSide: "e",
  },
  {
    slug: "coal",
    county: "Coal",
    seat: "Coalgate",
    towns: ["Tupelo", "Lehigh"],
    lat: 34.5384,
    lon: -96.2186,
    startingPayment: 1240,
    land: { low: 10000, high: 30000 },
    lotTypical: "5 – 20 acres",
    note: "The cheapest way in on this map, at the south-east edge of the radius.",
    labelSide: "e",
  },
  {
    slug: "noble",
    county: "Noble",
    seat: "Perry",
    towns: ["Morrison", "Red Rock", "Billings"],
    lat: 36.2895,
    lon: -97.2881,
    startingPayment: 1405,
    land: { low: 15000, high: 45000 },
    lotTypical: "2 – 10 acres",
    note: "Perry, straight up I-35 past Stillwater's turn-off.",
    labelSide: "n",
  },
];

/** Every area, with mileage from the dealership computed, not typed by hand. */
export const AREAS: (Area & { miles: number })[] = RAW.map((a) => ({
  ...a,
  miles: Math.round(milesFromHQ(a.lat, a.lon)),
}));

/** The cheapest way in, or undefined while no county is priced. */
export const CHEAPEST: (Area & { miles: number }) | undefined = AREAS.reduce<
  (Area & { miles: number }) | undefined
>((a, b) => (a && a.startingPayment <= b.startingPayment ? a : b), undefined);

export const PAYMENT_FLOOR = CHEAPEST?.startingPayment ?? 0;
export const PAYMENT_CEILING = AREAS.length
  ? Math.max(...AREAS.map((a) => a.startingPayment))
  : 0;

export function areaBySlug(slug: string) {
  return AREAS.find((a) => a.slug === slug);
}

/**
 * Sequential scale for shading counties by starting payment.
 *
 * One hue, five steps, monotonically stepped in lightness so the map reads as a
 * magnitude rather than as five unrelated colors.
 *
 * The ramp runs **most prominent at the cheapest end**. The quantity being
 * encoded is how easy a county is to get into, so the counties a shopper can
 * actually afford are the ones that carry weight on the map; running it the
 * other way made the priciest corner of the state the loudest thing on screen.
 * Every swatch is labelled with its band in the legend, so the direction is
 * stated rather than assumed, and each county also carries its price in figures.
 *
 * The fills are theme tokens, defined light and dark in `app/globals.css`
 * alongside every other colour on the site — `--land-tier-1` is the cheapest
 * band. Because they are custom properties they are applied through `style`
 * rather than as SVG presentation attributes, which do not resolve `var()`.
 * Even the palest step stays clearly apart from `--land-unserved`, so
 * "we deliver here" never collapses into "we don't".
 *
 * Bands are round numbers rather than quantiles — a legend that reads
 * "under $1,350" is worth more to a shopper than equal-sized buckets.
 */
export const PRICE_TIERS = [
  { max: 1349, label: "Under $1,350", fill: "var(--land-tier-1)" },
  { max: 1449, label: "$1,350–$1,449", fill: "var(--land-tier-2)" },
  { max: 1549, label: "$1,450–$1,549", fill: "var(--land-tier-3)" },
  { max: 1699, label: "$1,550–$1,699", fill: "var(--land-tier-4)" },
  { max: Infinity, label: "$1,700 and up", fill: "var(--land-tier-5)" },
] as const;

/** Fill for land we do not deliver to: neutral, so it never reads as a tier. */
export const UNSERVED_FILL = "var(--land-unserved)";
/** Fill for the next state over, which is context rather than market. */
export const OUTSIDE_FILL = "var(--land-outside)";
/** Fill for a county priced above the visitor's budget. */
export const OVER_BUDGET_FILL = "var(--land-over-budget)";

export function tierOf(payment: number): number {
  const i = PRICE_TIERS.findIndex((t) => payment <= t.max);
  return i === -1 ? PRICE_TIERS.length - 1 : i;
}

export const tierFill = (payment: number) => PRICE_TIERS[tierOf(payment)].fill;

/** Counties sorted the way a shopper reads them: cheapest way in, first. */
export const BY_PRICE = [...AREAS].sort(
  (a, b) => a.startingPayment - b.startingPayment
);

/** The headline counties for the social preview image. */
export const OG_FEATURED = BY_PRICE.slice(0, 6);
