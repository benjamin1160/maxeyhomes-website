/**
 * Which sections the landing page renders, and which pages exist at all.
 *
 * The template used to hard-wire both: every deployment got the same eleven
 * bands down the home page and exactly the routes that happened to be in
 * `app/`. That is fine for one site and wrong for a dealership that has no
 * team to introduce, no promotion running, and no blog it will ever write.
 *
 * So the landing page is now a list of sections rendered in a fixed order,
 * each behind a switch, and the optional pages are a second list of switches.
 * A section turned off is not rendered. A page turned off redirects to `/`
 * rather than 404ing, so a stale link — a Google Business Profile, a printed
 * card, an old ad — still lands somewhere useful.
 *
 * The order below is the order the sections appear in. Changing a `true` to
 * a `false` is the supported way to shorten the page; deleting the section
 * from `components/landing.tsx` is not, because the next deployment wants it
 * back.
 *
 * Three of the sections are data-gated as well as switched: `meetTeam` needs
 * `company.team` to hold somebody, `videoShowcase` needs `videoShowcase`
 * below to hold a URL, and `projects` needs `lib/projects.ts` to hold a
 * project. A switch turned on with nothing behind it stays
 * hidden — same rule as everywhere else in this template. An absent fact is
 * a shorter page, never an invented one.
 */

export type LandingSection =
  | "hero"
  | "promotion"
  | "valueProp"
  | "socialProof"
  | "howItWorks"
  | "listings"
  | "projects"
  | "homeOnLand"
  | "meetTeam"
  | "videoShowcase"
  | "ticker"
  | "numbers"
  | "myth"
  | "cutaway"
  | "communities"
  | "contact"
  | "locationHours";

/** Landing-page bands, in render order. */
export const sections: Record<LandingSection, boolean> = {
  /* ---- The conversion path, in the order a stranger meets it ----------
     This is the arrangement maxeycustomhomes.com runs today, band for band
     and in this order: the hero, the wide photograph, the three steps, the
     catalogue, the closing call and form, and the hours. One scroll, and a
     phone number or a form never more than half a screen away.

     The long editorial read is still here — see the block below — and is
     four `true`s away.                                                    */

  /** Opening scene: the headline, the two calls to action, the licence and
      promises row, and the quote form, all in one band. */
  hero: true,
  /** Current offer, drawn from `lib/promotions.ts`. Hidden when none is live. */
  promotion: true,
  /** One photograph the width of the screen, and one sentence over it. */
  /* On, because Maxey's own site runs this band. Read the caveat, though:
     the photograph under it is a stock exterior carried over from the
     template, and the sentence over it ("imagine pulling into a home like
     this") is the one place on the page that reads as a promise about a
     specific house. Photograph the lot on Melba Ln and repoint
     `page/home-closing` in `lib/photos.ts` — that is a first-week job, not a
     nice-to-have. */
  valueProp: true,
  /* Off, and it would hide itself anyway. Maxey publishes no reviews profile
     and no customer quotes, and this band is the one place on the page where
     a visitor is deciding whether to believe us — so it stays empty until
     there are real quotes and a public profile to check them against. Put
     `reviewsUrl` in `lib/company.ts` and real quotes in `TESTIMONIALS`
     (`components/landing.tsx`), then turn this on. */
  socialProof: false,
  /** Three steps, numbered. */
  howItWorks: true,
  /** The catalogue, entered by size. */
  listings: true,
  /** Three recent projects, from `lib/projects.ts`. Data-gated: it needs both
      this switch and a project in that file, and `pages.projects` on. */
  /* Off: `lib/projects.ts` is empty and Maxey's site has no equivalent. */
  projects: false,
  /** Closing band: the call on one side, the enquiry form on the other. */
  contact: true,
  /** Where the lot is, when it is open, and how to reach it. */
  locationHours: true,

  /* ---- Everything else -------------------------------------------------
     Written, styled and switched off. Each is one `true` from appearing,
     and the numbered eyebrows renumber themselves around whatever
     survives, so the sequence stays contiguous either way.               */

  /** The three routes onto ground for a buyer who has none. */
  homeOnLand: false,
  /** Named staff from `lib/company.ts`. Needs somebody in `company.team`. */
  meetTeam: false,
  /** A single video band. Needs a URL in `videoShowcase` below. */
  videoShowcase: false,
  /** Communities we place homes into. */
  communities: false,
  /** The scrolling band of build facts. */
  ticker: false,
  /** Industry-wide cost and volume figures. */
  numbers: false,
  /** The six objections, answered. */
  myth: false,
  /** The cutaway diagram of how a section is built. */
  cutaway: false,
};

export type OptionalPage =
  | "listings"
  | "projects"
  | "videos"
  | "communities"
  | "landDeals"
  | "startHere"
  | "financing"
  | "whyManufactured"
  | "about"
  | "contact"
  | "saved"
  | "faq"
  | "blog"
  | "promotions"
  | "prequalify"
  | "buildAHome"
  | "address";

/**
 * Standalone routes. A `false` here makes the route redirect to `/` and drops
 * it from the header, the footer and the sitemap — the page stops existing as
 * far as the site is concerned.
 *
 * `/privacy-policy` and `/terms` are deliberately absent: legal pages are not
 * optional and have no switch.
 */
export const pages: Record<OptionalPage, boolean> = {
  listings: true,
  /* Off because `lib/projects.ts` is empty. Past projects are the evidence
     behind everything else on the site, so this is worth filling first: add a
     project and turn this on, and `/projects`, the nav links and the landing
     band all appear together. */
  projects: false,
  /* Off because `lib/videos.ts` is empty. Turn on once the explainers — the
     process, construction loan versus end loan — are up. */
  videos: false,
  /* Off because `lib/communities.ts` is empty — Maxey publishes no
     communities. Write real properties into that file, then turn this on. */
  communities: false,
  /* Off because `lib/land/areas.ts` carries no county pricing — Maxey
     publishes no service area at all, and the page is nothing but priced
     counties. Price the delivery radius, then turn this on. */
  landDeals: false,

  /* ---- Matched to maxeycustomhomes.com -------------------------------
     Maxey's site is three routes and a landing page: Home, About Us, and
     the pre-qualify page, plus the two legal pages that have no switch. So
     the routes it does not have are off here, which redirects each to `/`
     and drops it from the header, the drawer, the footer and the sitemap in
     one move.

     Off is not deleted. Every page below is written, styled and one `true`
     from coming back — including the whole editorial argument for a
     manufactured home on `/why-manufactured`, `/financing` and
     `/start-here`, which is the site's best organic-search surface and the
     thing most worth switching back on once somebody is ready to own it.
     Read the `voice` skill before you do: that copy ships identically on
     every site built from this template.                                */

  /* Off: Maxey has no equivalent page. The three routes onto ground for a
     buyer who has none. */
  startHere: false,
  /* Off: Maxey has no equivalent page, and its financing message is the
     "Financing available" badge in the hero plus the pre-qualify page. */
  financing: false,
  /* Off: Maxey has no equivalent page. */
  whyManufactured: false,
  about: true,
  /* Off: Maxey takes contact on the landing page's closing band rather than
     on a route of its own, so `sections.contact` carries this instead. */
  contact: false,
  /* Off: Maxey's site has no saved-homes list, so the heart in the header
     and the one on every listing card go with it — see the `pages.saved`
     guard in `components/site-header.tsx` and `components/listing-card.tsx`. */
  saved: false,
  /* Off: Maxey publishes no FAQ. `lib/faq.ts` is written for this market and
     ready, so this is a cheap page to turn on. */
  faq: false,
  /** No posts ship with the template, so the blog is off until one is written. */
  blog: false,
  /* Off: `lib/promotions.ts` is empty and Maxey advertises no offer. */
  promotions: false,
  /* On, and it is the third item in Maxey's own header — "Get Prequaled with
     0 Impact". */
  prequalify: true,
  /* Off: Maxey has no equivalent page. */
  buildAHome: false,
  /* Off: Maxey has no separate location page — the landing page's
     `locationHours` band carries the address and the opening hours. */
  address: false,
};

/**
 * The video band on the landing page. `url` is the only required field — set
 * it to a file under `public/` or an embeddable URL and the section appears.
 * Left null, `sections.videoShowcase` has nothing to render and stays hidden.
 */
export const videoShowcase: {
  url: string;
  mobileUrl?: string;
  headline: string;
  subheadline?: string;
  ctaText?: string;
  ctaHref?: string;
} | null = null;

/**
 * A floating call button, bottom right, on every page. It is the one piece of
 * chrome that follows a visitor around; turn it off for a quieter site.
 */
export const floatingCall = true;

/**
 * The chat widget, bottom right, above the call button.
 *
 * It is a guided intake rather than a conversation — five questions, then a
 * callback — and it says so in its own first message. The script is data in
 * `lib/chat.ts`; the lead goes to GoHighLevel through `app/api/chat/route.ts`
 * like every form on the site.
 *
 * Turn it off for a lot whose leads all arrive by phone, or while nobody is
 * there to answer the callbacks it promises. A chat that nobody answers is
 * worse than no chat.
 *
 * The `CHAT_WIDGET` environment variable overrides this: set it to GHL's own
 * embed snippet and that widget loads instead of this one, switch or no
 * switch. See `lib/ghl/chat-embed.ts` for the trade between them.
 *
 * Maxey's live site runs GoHighLevel's own LeadConnector widget, which is
 * exactly the `CHAT_WIDGET` case: set that variable to the snippet from the
 * sub-account and this site loads the same bubble, so a visitor gets one
 * chat and the conversations land in the CRM the business already reads.
 * Left unset, the built-in guided intake below answers instead.
 */
export const chatWidget = true;

/**
 * The phone strip above the header — the number, the hours and the licence,
 * in the first line of the document.
 *
 * It is the loudest thing a dealership site can do about its telephone, which
 * is why it has a switch: a business whose leads all arrive by form gets a
 * quieter header without it. Turning it off also collapses `--callbar-h`, so
 * every offset against the fixed chrome follows automatically — see
 * `components/call-bar.tsx`.
 */
export const callBar = true;
