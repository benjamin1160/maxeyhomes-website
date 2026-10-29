/**
 * The site's link structure, in one place.
 *
 * The header bar carries the primary routes; everything else lives in the
 * mobile drawer and the footer. Both lists are filtered through `pages` in
 * `lib/page-config.ts`, so turning a page off removes its links as well as
 * making the route redirect — a link to a page that bounces you home is worse
 * than no link at all.
 *
 * Add a route here rather than writing an anchor into a component, and the
 * header, the drawer and the footer all pick it up together.
 */

import { pages, sections, type OptionalPage } from "./page-config";
import { qwPages } from "./prequalify";
import { locations } from "./locations";
import { routes } from "./routes";

/**
 * The icon beside a link in the header bar. Names index `Icon` in
 * `components/ui.tsx`; the bar draws nothing where a link names none.
 */
export type NavIcon =
  | "House"
  | "Info"
  | "Mail"
  | "Grid"
  | "Pin"
  | "Dollar"
  | "Plan"
  | "Shield";

export type NavItem = {
  href: string;
  label: string;
  /** The switch in `lib/page-config.ts` that governs this link. */
  page: OptionalPage;
  icon?: NavIcon;
};

/* Five, and short ones. The bar is a single row beside a logo and a phone
   button, and a sixth item is what makes it wrap on a 1280-wide laptop.
   Everything else lives in `SECONDARY` and reaches the drawer.

   Every entry is filtered through `pages` below, so this list is the full
   set the bar *can* show, not the set it does. With the switches Maxey's
   deployment currently carries it resolves to three — Homes, About us and
   Pre-Qualify No SSN Required — which is the header its own site runs. */
const PRIMARY: NavItem[] = [
  { href: "/listings", label: "Homes", page: "listings", icon: "House" },
  { href: "/land-deals", label: "Land", page: "landDeals", icon: "Pin" },
  { href: routes.financing, label: "Financing", page: "financing", icon: "Dollar" },
  { href: "/about", label: "About us", page: "about", icon: "Info" },
  /* Worded and pointed as QualifyWizard asked. Its two sibling pages in
     `qwPages` are deliberately not linked anywhere. */
  { href: qwPages.noSSN.path, label: qwPages.noSSN.title, page: "prequalify", icon: "Shield" },
  { href: "/contact", label: "Contact us", page: "contact", icon: "Mail" },
];

/** Drawer and footer only — the bar has no room, and these are second visits. */
const SECONDARY: NavItem[] = [
  { href: routes.singleWides, label: "Single wides", page: "sizePages" },
  { href: routes.doubleWides, label: "Double wides", page: "sizePages" },
  { href: routes.homeAndLand, label: "Home + land", page: "homeAndLand" },
  { href: routes.pricingGuide, label: "What it costs", page: "pricingGuide" },
  { href: "/new-home", label: "Build a home", page: "buildAHome", icon: "Plan" },
  { href: "/projects", label: "Past projects", page: "projects", icon: "Grid" },
  { href: "/videos", label: "Videos", page: "videos", icon: "Info" },
  { href: "/communities", label: "Communities", page: "communities", icon: "Grid" },
  { href: "/start-here", label: "No land? Start here", page: "startHere" },
  { href: "/why-manufactured", label: "Why manufactured", page: "whyManufactured" },
  { href: "/faq", label: "Questions", page: "faq" },
  { href: "/promotions", label: "Offers", page: "promotions" },
  { href: "/blog", label: "Notes", page: "blog" },
  { href: "/address", label: "Find us", page: "address" },
];

const enabled = (items: NavItem[]) => items.filter((item) => pages[item.page]);

export const primaryNav = enabled(PRIMARY);
export const secondaryNav = enabled(SECONDARY);
/**
 * The places with a page of their own, for the footer. From
 * `lib/locations.ts`, so a city added there is linked here without an edit.
 */
export const areaNav = pages.locations
  ? locations.map((l) => ({ href: `${routes.locations}/${l.slug}`, label: l.city }))
  : [];

/**
 * The footer's one row of links: the pages written to be found, and the
 * places. The footer is otherwise only the business and the legal links —
 * see `components/site-footer.tsx` — but these pages are reached mostly from
 * search and from each other, and a link from every page on the site is
 * what tells a search engine they matter.
 */
export const footerNav: { href: string; label: string }[] = [
  ...enabled([
    { href: routes.singleWides, label: "Single wide homes", page: "sizePages" },
    { href: routes.doubleWides, label: "Double wide homes", page: "sizePages" },
    { href: routes.homeAndLand, label: "Home + land", page: "homeAndLand" },
    { href: routes.financing, label: "Financing", page: "financing" },
    { href: routes.pricingGuide, label: "Pricing guide", page: "pricingGuide" },
  ]),
  ...areaNav.map((a) => ({ ...a, label: `Homes in ${a.label}` })),
];

/** The mobile drawer lists both, in that order. */
export const drawerNav = [...primaryNav, ...secondaryNav];

/** Legal links, in the footer's bottom row. Neither has a switch. */
export const legalNav = [
  { href: "/privacy-policy", label: "Privacy policy" },
  { href: "/terms", label: "Terms & conditions" },
];

/**
 * Where "get in touch" goes.
 *
 * Half the pages on this site end in a button that means "talk to us", and
 * they used to all hard-code `/contact` — which is fine until a deployment
 * takes its enquiries on the landing page instead and switches that route
 * off, at which point every one of those buttons quietly bounces the visitor
 * to the home page and loses them.
 *
 * So they read this instead. With `/contact` on it is that page; with it off
 * it is the landing page's own closing band, which is the same form. The one
 * place that must NOT use it is the `/contact` page itself.
 *
 * If a deployment turns off both the route and `sections.contact`, this falls
 * back to the hero, where the quote form lives — there is no arrangement of
 * the switches that leaves this pointing at nothing.
 */
export const contactHref = pages.contact
  ? "/contact"
  : sections.contact
    ? "/#contact"
    : "/#hero";
