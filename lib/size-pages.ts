/**
 * The size pages — `/single-wide-homes-for-sale` and
 * `/double-wide-homes-for-sale`.
 *
 * Each is the catalogue narrowed to one width, with the copy a buyer of that
 * width actually needs: what the width means on delivery day, on the set, at
 * the lender and on a lot. The homes, the counts, the footprint range and the
 * bedroom links are all measured from `listings` at build time, so the pages
 * follow the catalogue without anybody editing them.
 *
 * The copy below is about the product, not about Maxey. Anything that would
 * be a claim about the business — a delivery radius, a lead time, a price —
 * is not written here; it is in `lib/company.ts` or it is not on the site.
 *
 * Add a width by adding an entry and a route file that renders
 * `<SizePage size="…" />`. Turn the pair off with `pages.sizePages`.
 */
import type { FaqItem } from "./faq";
import type { SizeCategory } from "./homes";
import { pages } from "./page-config";
import { routes } from "./routes";

export type SizePage = {
  size: SizeCategory;
  path: string;
  /** The page title in the browser tab and the search result. */
  title: string;
  /** The H1. Says the product and the place, in that order. */
  h1: string;
  description: string;
  /** Under the H1. One or two sentences. */
  lede: string;
  /** What this width means, in three short cards. */
  points: { title: string; body: string }[];
  faq: FaqItem[];
};

export const sizePages: Partial<Record<SizeCategory, SizePage>> = {
  single: {
    size: "single",
    path: routes.singleWides,
    title: "Single Wide Homes for Sale in Norman, OK",
    h1: "Single wide homes for sale in Norman, Oklahoma",
    description:
      "Single wide manufactured homes for sale from Maxey Custom Homes in Norman, OK — floor plans, bedrooms, bathrooms and square footage, with financing, delivery and setup handled for you.",
    lede: "One section, built in the plant and delivered in one piece. The quickest home to set and the easiest to fit on a lot — and with today's plans, more room than most people expect.",
    points: [
      {
        title: "One piece, one load",
        body: "A single wide leaves the plant finished and arrives on one load. There is no second section to join on site and no marriage line to seal, which takes days and line items out of the setup.",
      },
      {
        title: "Fits where a double will not",
        body: "A narrow lot, a tight turn off the county road, a pad in a community sized for one section — a single wide goes in where a 28- or 32-foot-wide home cannot. Tell us where it is going and we will check before you fall for a plan.",
      },
      {
        title: "Financed the same way",
        body: "A single wide qualifies for the same kinds of loan as a larger home. On land you own, set on a permanent foundation, it can be titled as real property and mortgaged. On a leased lot it is financed as a home-only loan.",
      },
    ],
    faq: [
      {
        question: "How big is a single wide?",
        answer: [
          "Single-section homes are built in widths from about 14 to 18 feet and lengths up to about 80 feet. The homes on this page run the footprint shown above, from studio-sized plans to three and four bedrooms.",
        ],
      },
      {
        question: "Can I put a single wide on my own land in Oklahoma?",
        answer: [
          "Usually, yes — but zoning and deed restrictions decide it, not the home. Inside city limits, ask the planning office whether a HUD-code home is allowed on that parcel. Outside them, read the deed for restrictions before you buy the ground. We can help you check either.",
        ],
      },
      {
        question: "Is a single wide cheaper to set up than a double wide?",
        answer: [
          "Generally the setup is simpler: one section to place, level and anchor, and no joining work. The site itself — the pad, the utilities, the distance — moves the number far more than the width does, which is why we quote it against your site rather than print one figure.",
        ],
      },
    ],
  },

  double: {
    size: "double",
    path: routes.doubleWides,
    title: "Double Wide Homes for Sale in Norman, OK",
    h1: "Double wide homes for sale in Norman, Oklahoma",
    description:
      "Double wide manufactured homes for sale from Maxey Custom Homes in Norman, OK — 3, 4 and 5 bedroom floor plans with full specs, plus financing, home-and-land packages, delivery and setup.",
    lede: "Two sections, built side by side in the plant and joined on your site. The home most families end up in: the room and the floor plans of a site-built house, at a cost per square foot well under one.",
    points: [
      {
        title: "Two sections, joined on site",
        body: "Each half is built and inspected in the plant, delivered on its own load, then set side by side and joined along the marriage line. The roof, the ducts and the finishes are tied together on site so it lives as one house.",
      },
      {
        title: "Room to grow into",
        body: "The extra width is what buys an open kitchen and living room, a primary suite at the far end from the other bedrooms, and a utility room you can actually stand in. Three, four and five bedrooms are all here.",
      },
      {
        title: "Built for land you own",
        body: "On a permanent foundation, on land you own, a double wide can be titled as real property and financed with a mortgage — conventional, FHA, VA or USDA where the parcel qualifies. That is where the long-term value is.",
      },
    ],
    faq: [
      {
        question: "How big is a double wide?",
        answer: [
          "Double-section homes are typically 24 to 32 feet wide once joined. The homes on this page run the footprint shown above — measured from the plans themselves, not a brochure range.",
        ],
      },
      {
        question: "What does it take to set a double wide?",
        answer: [
          "A level pad or foundation, room for two wide loads to reach it, and a crew to set, join, level and anchor the sections. Then utilities, skirting and steps. We walk the site first and give you the setup number in writing.",
        ],
      },
      {
        question: "Can I finance a double wide and the land together?",
        answer: [
          "Yes. A land-home loan finances the parcel, the site work and the home on one loan with one closing — and if you already own the land, its value can often count toward the down payment. Our home-and-land page lays out how that works.",
        ],
      },
    ],
  },
};

/**
 * Where a size bucket links to: its own page where there is one and the
 * pages are on, the filtered catalogue otherwise. Every "browse by size" link
 * on the site goes through this, so turning the pages off sends those links
 * back to `/listings` rather than to a redirect.
 */
export function sizeCategoryHref(id: SizeCategory): string {
  const page = sizePages[id];
  return pages.sizePages && page ? page.path : `/listings?size=${id}`;
}
