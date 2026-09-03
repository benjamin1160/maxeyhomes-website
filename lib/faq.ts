/**
 * The questions buyers actually ask, and the answers this dealership stands
 * behind.
 *
 * They live here rather than in a page because two routes render them: the
 * `/faq` page in full, and the FAQ band at the foot of `/why-manufactured`.
 * One list, one set of answers, no chance of the two drifting apart.
 *
 * Answers are paragraphs of plain text — no markup — so this file stays free
 * of components, the same rule `lib/company.ts` follows. Add, cut and reorder
 * freely; an empty list hides the section and, with `pages.faq` off in
 * `lib/page-config.ts`, the route with it.
 *
 * Everything below is a claim about how these homes are built, financed and
 * titled. Check it against your own market before you ship it — wind zone,
 * snow load and titling are all state and county business.
 *
 * The answers here are written for Central Oklahoma and for Maxey
 * specifically: HUD Wind Zone I, Thermal Zone 2, an 18-inch frost line in
 * Norman, and Oklahoma's title-cancellation route onto real property under
 * 47 O.S. § 1110 (see `lib/market.ts`). Where an answer would have to
 * promise something Maxey does not publish — a lead time, a price inclusion,
 * a delivery radius, a spec on a home that is not on the lot — it says to
 * ask instead. That is the honest answer, and it is also the one that gets
 * somebody to pick up the phone.
 */

export type FaqItem = {
  question: string;
  /** One string per paragraph. */
  answer: string[];
};

export const faq: FaqItem[] = [
  {
    question: "Is a manufactured home the same as a mobile home?",
    answer: [
      "Legally, no. “Mobile home” refers to anything built before 15 June 1976, when the federal HUD Code took effect. Everything built after that date is a manufactured home, and the two are governed by completely different rules.",
      "In conversation people use the terms interchangeably, and we are not going to be precious about it. But if you are reading a loan document, an insurance policy or a zoning ordinance, that date is the line that matters.",
    ],
  },
  {
    question: "What is the difference between a manufactured home and a modular home?",
    answer: [
      "Both are built indoors and finished on your site, and that is where the similarity ends. A manufactured home is built to the federal HUD Code and carries a HUD certification label; in Oklahoma the dealers, installers and inspectors on that side of the line are licensed by the Used Motor Vehicle, Dismantler and Manufactured Housing Commission. A modular home is built to the same building code as a house framed on site, and once it is set a code officer inspects it as a house.",
      "That difference decides financing, titling, appraisal and sometimes whether a town will permit it at all. We sell both, so ask us which one your parcel and your lender actually want before you fall in love with a floor plan.",
    ],
  },
  {
    question: "Can I get a normal mortgage?",
    answer: [
      "On land you own, with the home on a permanent foundation and titled as real property: yes. Conventional, FHA Title II, VA and USDA all lend on manufactured homes that meet those conditions, and a modular home is financed as an ordinary house from the start. On a leased pad you are in chattel lending, which is a real loan with real underwriting — just more expensive. Which situation you are in is a decision you make, and we would rather you made it on purpose.",
    ],
  },
  {
    question: "How does a home in Oklahoma become real property?",
    answer: [
      "Oklahoma issues a manufactured home its own certificate of title, the way it does a vehicle. Once the home is permanently affixed to land you also own, you file to cancel that title: the county assessor certifies the land description and owner of record first, and the cancellation has to follow within sixty days. From then on the home is conveyed with the real estate. One catch worth knowing early — the title cannot be surrendered while a security interest on the home is still unreleased.",
      "That step is the one that puts the home on the same appreciation curve — and the same lending shelf — as the house next door. It is worth doing in the right order, and it is one of the first things we will ask you about.",
    ],
  },
  {
    question: "How long do they actually last?",
    answer: [
      "The same as any other house: as long as the roof and the envelope are maintained. HUD-code homes from the early 1980s are still in service across the country. The structural failures people remember are almost entirely pre-1976 units, or post-1976 homes that were never properly anchored — which is a set-crew problem, not a construction problem.",
    ],
  },
  {
    question: "What about the wind out here?",
    answer: [
      "Every home is certified to a wind zone, a roof-load zone and a thermal zone, printed on the data plate inside a kitchen cabinet. Oklahoma is HUD Wind Zone I — and it is worth being straight about what that means, because it sounds like the wrong answer for this state. The HUD wind zones model sustained hurricane-force wind, so Zone I says the Gulf coast is somewhere else. It is not a tornado rating, and no manufactured home carries one.",
      "What actually carries a home through Oklahoma weather is the installation: the anchors, the ties, the pier spacing and the pad under it, all of it inspected work. Ask about the install and the anchoring before you ask about the wind zone.",
      "Oklahoma is HUD Thermal Zone 2, the middle insulation band. An envelope specified for the Gulf states is under-built for a Norman January. Ask us for the data plate on any home before you sign anything — it is a photograph, and it takes us a minute to send.",
    ],
  },
  {
    question: "Can I put one on my own land?",
    answer: [
      "Usually. The constraints are the city or county zoning and any deed restrictions, minimum square footage or roof-pitch covenants, access for a wide load down the road you are on, frost-depth footings — Norman, Oklahoma City and Tulsa all build to 18 inches, and the southern counties to 12 — and utilities. Send us the parcel and we will look at it with you before you spend anything.",
    ],
  },
  {
    question: "Will my neighbours be able to tell?",
    answer: [
      "With a permanent foundation, a continuous perimeter, a site-built porch and a conventional roof pitch — generally not, from the street. If that matters to you, say so early: it changes which homes are worth looking at and it changes the site work. It is a completely reasonable thing to care about.",
    ],
  },
  {
    question: "What does a quoted price include?",
    answer: [
      "What is on the quote, and we will go through it line by line with you. Transport distance, the set, skirting, utility connections and any options allowance are each either in a given quote or they are not, and we would rather tell you which than let a headline number do the talking.",
      "Land, site work, permits, taxes and title fees are quoted separately, because they genuinely vary parcel by parcel — the pad, the drive, the well, the septic and the power run are the one set of numbers nobody can guess from a distance.",
    ],
  },
  {
    question: "Where do you deliver?",
    answer: [
      "The lot is at 2548 Melba Ln in Norman. We have not put a radius on this page because the honest answer depends on the road to your parcel as much as the mileage to it — a wide load and a narrow bridge is a different question from a hundred miles of highway.",
      "So ring us with the address. If you are outside what we can do, we will tell you at the start rather than at the end.",
    ],
  },
  {
    question: "How long from signing to keys?",
    answer: [
      "It depends on whether the home has to be built and on how much site work the parcel needs — and site work, not the home, is nearly always the long pole. Permits, septic and power set the calendar.",
      "Ask us for a timeline on the specific home and the specific parcel and you will get a real one. A number quoted before anybody has looked at your ground is a number somebody made up.",
    ],
  },
];
