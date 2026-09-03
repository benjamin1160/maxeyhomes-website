import { floorPlans, type FloorPlan } from "./floor-plans";
import { catalogue } from "./catalogue.generated";

export type ListingStatus =
  | "available"
  | "to-order"
  | "pending"
  | "sold"
  | "coming-soon";
export type Sections = "single" | "double" | "triple";

/**
 * How the home is built and inspected, which is a different question from how
 * wide it is.
 *
 * `manufactured` is HUD-code — built to the federal standard, titled and
 * financed as such. `modular` is built to the same state and local building
 * code as a site-built house, inspected by the state, and appraised and
 * titled as real property. The catalogue below carries both: Pine Grove
 * builds the manufactured homes, Pleasant Valley the modulars.
 *
 * This drives its own bucket in the size categories below — "Mods" — because
 * a buyer shopping for a modular is not shopping by width at all.
 */
export type Construction = "manufactured" | "modular";

export type ArchStyle =
  | "farmhouse"
  | "craftsman"
  | "modern"
  | "coastal"
  | "lodge"
  | "ranch";
export type SceneKind =
  | "exterior"
  | "living"
  | "kitchen"
  | "bedroom"
  | "bath"
  | "porch";

export type Scene = { kind: SceneKind; caption: string };

export type FeatureGroup = { group: string; items: string[] };

/**
 * A home in the catalogue.
 *
 * Required fields are the ones a listing cannot mean anything without. The
 * rest are optional because real inventory arrives incomplete: a
 * manufacturer's spec sheet may carry dimensions but no price, an imported
 * feed may carry photographs but no floor plan. Every field below that can
 * be absent is absent from the UI too — nothing is faked to fill a slot,
 * and nothing renders as a blank or a zero.
 */
export type Listing = {
  slug: string;
  name: string;
  beds: number;
  baths: number;
  sqft: number;
  status: ListingStatus;
  scenes: Scene[];

  /** Who builds it — "Pine Grove Homes", "Pleasant Valley Homes". */
  builder?: string;
  /** HUD-code or state-code. Drives the "Mods" bucket. */
  construction?: Construction;
  /** Product line, e.g. "NETR". Free text — the facet list derives from it. */
  series?: string;
  /** Manufacturer's model code. */
  model?: string;
  /** Absent means the home is priced on enquiry; the UI says so. */
  price?: number;
  /** Optional pre-discount price; renders as a strikethrough. */
  wasPrice?: number;
  sections?: Sections;
  /** Nominal transport dimensions in feet, e.g. 28 × 60. */
  widthFt?: number;
  lengthFt?: number;
  /**
   * The manufacturer's own dimension string, e.g. `26'8" × 52'`. Box
   * dimensions run a few inches under the nominal width everyone says out
   * loud — a 26'8" home is a 27-wide — so both are kept: this one is what the
   * spec strip shows, `widthFt` is what the filters count.
   */
  dimensions?: string;
  year?: number;
  communitySlug?: string;
  style?: ArchStyle;
  tagline?: string;
  story?: string[];
  highlights?: string[];
  features?: FeatureGroup[];
  planId?: keyof typeof floorPlans;
  /**
   * The manufacturer's floor-plan DRAWING, as an image under `public/`. It is
   * a drawing and is labelled as one wherever it renders — it is never shown
   * as a photograph and never fills a photograph's slot.
   */
  planImage?: string;
  /** HERS index — lower is better. A new stick-built home scores ~100. */
  hers?: number;
  featured?: boolean;
  /**
   * Standing on the lot on Melba Ln, skirted and open to walk through.
   * Everything else in the catalogue is a plan the dealership orders in,
   * which is a different promise and gets a different badge.
   */
  onLot?: boolean;
  /** Days the listing has been on market, used for the "new" badge. */
  daysListed?: number;
  /** Matterport walkthrough. */
  tourUrl?: string;
  /** Where this listing was imported from, for re-checking against source. */
  sourceUrl?: string;
};

/**
 * What the importer is allowed to write: the manufacturer's published facts
 * and nothing else. Lot state — status, what is featured, what is standing on
 * Melba Ln — is decided by the dealership, lives in `lotState` below, and is
 * applied over the generated file so re-running the import never overwrites
 * it.
 */
export type CatalogueEntry = Omit<Listing, "status">;

/* ------------------------------------------------------------------ *
 * The catalogue
 *
 * READ THIS BEFORE THE SITE GOES LIVE. The 348 plans in
 * `lib/catalogue.generated.ts` were imported for a different dealership, from
 * the two manufacturers *that* business retails:
 *
 *   Pine Grove Homes — HUD-code manufactured homes, single-section through
 *   double-section, plus the multi-family duplexes. The NETR line is the
 *   northern-states specification.
 *
 *   Pleasant Valley Homes — state-code modulars, every one built to order,
 *   which is why they all carry `to-order` below.
 *
 * Maxey publishes no manufacturer list of its own, so those two are what the
 * catalogue still holds, and every plan in it currently reads "Available to
 * order" — which is a claim that Maxey can order that plan. Confirm the lines
 * Maxey actually retails and re-import against them before launch; the
 * importer takes a manufacturer at a time. Until then the catalogue is
 * demonstration data with real plans in it, not an order book.
 *
 * Do not edit the generated file. Re-import it with:
 *
 *   node scripts/import-manufacturers.mjs homes
 *
 * No prices: neither manufacturer publishes one, and a dealer quotes on
 * options, delivery distance and site work, so the site says "call for
 * pricing" everywhere a price would go.
 * ------------------------------------------------------------------ */

/**
 * What is actually standing on the lot, and what the dealership wants
 * surfaced.
 *
 * This is the one hand-maintained half of the catalogue, and the only place
 * lot state is written. Anything not named here is a plan the dealership
 * orders in, and defaults to `to-order` — "Available to order" — below.
 *
 * Keys are slugs in the generated catalogue. A key that matches no plan is
 * caught by `npm run lint` (see `scripts/check-data.mjs`), so a model code
 * that changes upstream fails loudly instead of silently dropping a home off
 * the lot.
 */
const lotState: Record<string, Partial<Listing>> = {
  /* EMPTY, on purpose.
     The four entries that used to be here named four homes standing in a
     different dealership's yard, in a different state. `onLot` is the
     strongest thing a card can say — it means a visitor can drive over today
     and walk through this exact house — so carrying those over would have
     been the worst kind of inherited claim.
     Maxey's own site currently lists no inventory at all. When homes are
     standing on Melba Ln, add one entry per home, keyed by its slug in the
     generated catalogue, setting status to available with onLot and featured
     both true — and keep the count in step with `homesOpenOnLot` in
     `lib/company.ts`. A key that matches no plan in the catalogue fails
     `npm run lint`, which is the point of writing them here. */
};

/**
 * The catalogue as the site sees it: the manufacturers' published facts, with
 * the dealership's lot state laid over the top.
 */
export const listings: Listing[] = catalogue.map((entry) => ({
  ...entry,
  /* A plan the dealership can order but does not stock. Anything standing on
     the lot overrides this from `lotState`. */
  status: "to-order" as ListingStatus,
  ...lotState[entry.slug],
}));


/* ------------------------------------------------------------------ *
 * Accessors
 * ------------------------------------------------------------------ */

export function getListing(slug: string): Listing | undefined {
  return listings.find((l) => l.slug === slug);
}

export function getPlan(listing: Listing): FloorPlan | undefined {
  return listing.planId ? floorPlans[listing.planId] : undefined;
}

export function featuredListings(): Listing[] {
  return listings.filter((l) => l.featured);
}

/** Homes that share a series or a community, minus the one being viewed. */
export function relatedListings(listing: Listing, count = 3): Listing[] {
  const scored = listings
    .filter((l) => l.slug !== listing.slug)
    .map((l) => ({
      listing: l,
      score:
        (l.series && l.series === listing.series ? 3 : 0) +
        (l.communitySlug && l.communitySlug === listing.communitySlug ? 2 : 0) +
        (l.beds === listing.beds ? 1 : 0) +
        (Math.abs(l.sqft - listing.sqft) < 400 ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, count).map((s) => s.listing);
}

export const statusLabels: Record<ListingStatus, string> = {
  available: "Available",
  /* The catalogue's default, and with `lotState` empty it is currently true
     of every plan on the site: a home the dealership can build for you, not
     one standing on the lot today. */
  "to-order": "Available to order",
  pending: "Sale pending",
  sold: "Sold",
  "coming-soon": "Coming soon",
};

export const sectionLabels: Record<Sections, string> = {
  single: "Single-section",
  double: "Double-section",
  triple: "Triple-section",
};

/**
 * Series whose name is a bare product code and wants the noun after it —
 * "NETR" reads as a typo, "NETR Series" reads as a line. Everything else in
 * this catalogue is already a phrase a buyer would say out loud ("Main
 * Street", "Single-Section", "Cabin/Chalet") and is left alone: "Single-
 * Section Series" is worse English than "Single-Section".
 */
const SERIES_TAKING_SUFFIX = new Set(["NETR"]);

/** A series rendered as a label. */
export function seriesLabel(series: string): string {
  if (/\b(series|collection)$/i.test(series)) return series;
  return SERIES_TAKING_SUFFIX.has(series) ? `${series} Series` : series;
}

/**
 * How the home is built and inspected, as a buyer would pick it off a filter.
 *
 * This is the "home type" question, and it is not the width question: a
 * modular can be as wide as a double-section manufactured home and is still a
 * different animal — state code rather than HUD code, inspected by the state,
 * appraised and titled as real property.
 */
export const constructionLabels: Record<Construction, string> = {
  manufactured: "Manufactured",
  modular: "Modular",
};

export const constructionOrder: Construction[] = ["manufactured", "modular"];

export const sectionsOrder: Sections[] = ["single", "double", "triple"];

export const styleOrder: ArchStyle[] = [
  "farmhouse",
  "craftsman",
  "modern",
  "coastal",
  "lodge",
  "ranch",
];

export const styleLabels: Record<ArchStyle, string> = {
  farmhouse: "Modern farmhouse",
  craftsman: "Craftsman",
  modern: "Modern",
  coastal: "Coastal cottage",
  lodge: "Mountain lodge",
  ranch: "Ranch",
};

/** Series present in the catalogue, so the facet list follows the data. */
export const seriesList: string[] = [
  ...new Set(listings.map((l) => l.series).filter((s): s is string => Boolean(s))),
].sort();

const priced = listings.filter((l): l is Listing & { price: number } => l.price !== undefined);

/** Whether any home carries a price at all — the price UI hides when none do. */
export const hasPrices = priced.length > 0;

export const priceBounds = {
  min: hasPrices ? Math.min(...priced.map((l) => l.price)) : 0,
  max: hasPrices ? Math.max(...priced.map((l) => l.price)) : 0,
};

/* ------------------------------------------------------------------ *
 * Size categories
 * ------------------------------------------------------------------ */

/**
 * The buckets a buyer actually shops by — tiny, single, double, triple, mods.
 *
 * A note on how these are decided, because it matters. The obvious approach
 * is to sort purely on square footage, and plenty of dealership sites do
 * exactly that. It produces a lie: a 1,000-square-foot double-section home
 * filed under "Single wide" is a claim about its width, and it is wrong.
 *
 * So width comes from `sections`, which is the field that actually records
 * it, and square footage is only used for the tiny bucket and as the
 * fallback for a home whose `sections` was never filled in. The footprint
 * ranges shown under each label are computed from the homes really in that
 * bucket rather than being printed from a table, so they cannot drift away
 * from the catalogue.
 *
 * `modular` is the exception, and deliberately so: it is checked before any
 * width or footprint rule, because a modular is not a width at all. It is a
 * different code, a different inspection and a different appraisal, and a
 * buyer shopping for one is not comparing it to a 28-wide. Pleasant Valley's
 * plans land here whatever their footprint, which is what keeps the
 * double-section manufactured homes together under "Double wide".
 */
export type SizeCategory = "tiny" | "single" | "double" | "triple" | "modular";

/** Anything under this is a tiny home whatever its section count. */
const TINY_MAX_SQFT = 800;

/* Only reached by a home with no `sections` value — see the note above. */
const SQFT_FALLBACK: [number, SizeCategory][] = [
  [TINY_MAX_SQFT, "tiny"],
  [1200, "single"],
  [2000, "double"],
];

export function sizeCategoryOf(listing: Listing): SizeCategory {
  /* Before everything else: a modular is a build standard, not a width. */
  if (listing.construction === "modular") return "modular";
  if (listing.sqft < TINY_MAX_SQFT) return "tiny";
  if (listing.sections) return listing.sections;
  const match = SQFT_FALLBACK.find(([ceiling]) => listing.sqft < ceiling);
  return match ? match[1] : "triple";
}

export const sizeCategoryLabels: Record<SizeCategory, string> = {
  tiny: "Tiny home",
  single: "Single wide",
  double: "Double wide",
  triple: "Triple wide",
  modular: "Mods",
};

/** The longer label, for the page heading a bucket links to. */
export const sizeCategoryDescriptions: Record<SizeCategory, string> = {
  tiny: "Under 800 square feet, on one section.",
  single: "One section, delivered whole and set on your site.",
  double: "Two sections, joined on site — the most common home we set.",
  triple: "Three sections, for the widest floor plans we can deliver.",
  modular:
    "Built to the same state building code as a site-built house, inspected by the state and appraised as real property. Every one is built to order.",
};

/* The glyph on each bucket's button. Emoji rather than drawn icons on
   purpose: there is no icon set with four house silhouettes that read as
   "wider than the last one" at 32 pixels, and these do. Swap them for an
   `Icon` if a deployment would rather not use emoji. */
export const sizeCategoryGlyphs: Record<SizeCategory, string> = {
  tiny: "🏠",
  single: "🏡",
  double: "🏘️",
  triple: "🏰",
  modular: "🏗️",
};

export const sizeCategoryOrder: SizeCategory[] = [
  "tiny",
  "single",
  "double",
  "triple",
  "modular",
];

/**
 * Which buckets this dealership shows, independent of what is in them.
 *
 * Visibility used to be derived purely from the counts: a bucket with no
 * homes in it was not rendered. That is the right default — it stops a lot
 * with no triple-wides advertising a button that leads to an empty page —
 * but it cannot express the state this site is actually in. With the
 * catalogue empty, every count is zero, so a count-driven row renders
 * nothing at all and a visitor is given no way into the catalogue and no idea
 * what kind of homes are sold here.
 *
 * maxeycustomhomes.com answers this the same way, and this list is its
 * `homeTypeConfig` read off the live site: Tiny Home, Single Wide and Double
 * Wide are enabled, Triple Wide is disabled, and it has no modular category
 * at all. Its buttons render over "0 homes available" — the shape of the
 * range is a standing claim about what the business sells, and it survives
 * having nothing in stock this week.
 *
 * So the two rules compose: a bucket appears when it is enabled here, and an
 * enabled bucket shows its footprint range and count only once it has homes
 * to measure. Turning one off is how you stop advertising a size you do not
 * sell; leaving one on with nothing in it says "we sell these, none in stock
 * today", which is a different and equally honest statement.
 */
export const sizeCategoryEnabled: Record<SizeCategory, boolean> = {
  tiny: true,
  single: true,
  double: true,
  /* Off, as on Maxey's own site. */
  triple: false,
  /* Off: Maxey has no modular category. Turn this on if the dealership starts
     retailing state-code modulars — the bucket keys off `construction`
     rather than width, so it needs no other change. */
  modular: false,
};

/** The buckets this deployment shows, in order. */
export const enabledSizeCategories: SizeCategory[] = sizeCategoryOrder.filter(
  (id) => sizeCategoryEnabled[id],
);

export type SizeCategoryFacet = {
  id: SizeCategory;
  label: string;
  /** How many homes are in it. Zero is a real answer — see the note on
      `sizeCategoryEnabled` — and the button still renders, without a count. */
  count: number;
  /** The real footprint range of the homes in it, e.g. "812–1,144 sq ft". */
  range?: string;
  /** The glyph on the button. */
  glyph: string;
};

/**
 * The buckets, measured against whatever catalogue is passed in.
 *
 * Only the enabled ones — see `sizeCategoryEnabled`. A `count` of zero is a
 * real answer here rather than a reason to drop the bucket, so callers get
 * every enabled bucket and decide for themselves what to draw at zero.
 */
export function sizeCategoryFacets(from: Listing[] = listings): SizeCategoryFacet[] {
  return enabledSizeCategories.map((id) => {
    const inBucket = from.filter((l) => sizeCategoryOf(l) === id);
    const sizes = inBucket.map((l) => l.sqft);
    const low = Math.min(...sizes);
    const high = Math.max(...sizes);
    return {
      id,
      label: sizeCategoryLabels[id],
      glyph: sizeCategoryGlyphs[id],
      count: inBucket.length,
      range: inBucket.length
        ? low === high
          ? `${low.toLocaleString()} sq ft`
          : `${low.toLocaleString()}–${high.toLocaleString()} sq ft`
        : undefined,
    };
  });
}
