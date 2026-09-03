/**
 * Claims Maxey Custom Homes makes about itself.
 *
 * Everything in here is a statement a *specific* business makes — how long
 * it has traded, who works there, what the price includes, what it warrants.
 * None of it is true of whoever deploys this template next, which is why it
 * lives in one file instead of being written into the pages.
 *
 * The rule is the same one `lib/communities.ts` and `lib/photos.ts` follow:
 * an absent value is hidden, never guessed at. Every field below is
 * optional, and every section that consumes one disappears when it is
 * missing — delete `team` and the About page has no team section; delete
 * `founded` and nothing anywhere claims a founding year. A shorter page is
 * always the correct outcome. Inventing a plausible-sounding number is not.
 *
 * What is filled in below is what Maxey publishes about itself: the three
 * promises in its hero, the Our Story text and the three cards beneath it on
 * its About page. Everything the business does not publish — a founding year,
 * a headcount, named staff, a dealer licence number, a warranty term, a
 * deposit schedule, a mileage a delivery is included to, a public reviews
 * profile — is absent rather than guessed at, and the sections that read
 * those fields hide themselves. Fill one in only from something Maxey has
 * actually put in writing.
 *
 * Note the one number Maxey does publish is a span of experience, not a
 * founding year: "over 85 years of combined experience" across "three
 * generations". Combined experience is a sum across people and cannot be
 * turned into a `founded`, so it lives in `experienceClaim` below and
 * `founded` stays absent.
 */

/** Icon keys from `components/ui.tsx`, referenced by name so this file stays free of components. */
export type PrincipleIcon = "Shield" | "Wrench" | "Truck" | "Bolt" | "Leaf" | "Plan" | "Pin";

export type TeamMember = {
  name: string;
  role: string;
  /** Year they joined. Omit if you don't know it — the card drops the line. */
  since?: string;
  body: string;
};

export type Principle = {
  icon: PrincipleIcon;
  title: string;
  body: string;
};

export type Company = {
  /** Year the business started trading. Drives the About hero, the story and the "Years" stat. */
  founded?: number;
  /**
   * Experience stated as a sum across people rather than a date — "over 85
   * years of combined experience", "three generations". Plenty of family
   * businesses publish this and no founding year, and the two are different
   * claims: a `founded` of 1941 says the doors opened in 1941, while 85
   * combined years says nothing at all about when they opened.
   *
   * So it gets its own field, and the copy that reads it always says
   * "combined". Never convert one into the other.
   */
  experienceClaim?: {
    /** Combined years across the team, e.g. 85. Rendered as "85+ years". */
    years: number;
    /** Generations the business spans, where it claims one. */
    generations?: number;
  };
  /** Homes sold or set to date, written out for prose, e.g. "four thousand".
      Becomes the first line of the About headline. */
  homesSoldWords?: string;
  /** Headcount, for the team section heading. Omit and the heading loses the count. */
  teamSize?: number;
  /** Homes standing open on the lot for walkthroughs. */
  homesOpenOnLot?: number;

  /** The founding story. Both halves are required together or the section is dropped. */
  story?: {
    eyebrow: string;
    heading: string;
    paragraphs: string[];
  };

  /** Operating rules the business will stand behind. Shipped empty is fine. */
  principles?: Principle[];

  /** Named staff. Portraits are wired through `page/about-team-N` in `lib/photos.ts`. */
  team?: TeamMember[];
  /** One-line note under the team grid, e.g. about how nobody works on commission. */
  teamNote?: string;

  /** Dealer licence number, where the state issues one and the business
      publishes it. Shown in the trust row under the hero and nowhere else.
      Omit it rather than inventing one — an unverifiable licence number is
      the single worst field on this list to guess at. */
  licenseId?: string;
  /** Short claims for the trust row under the hero, three or four at most.
      Every one is a promise the business has to keep, so write them from what
      it already advertises and delete the rest. */
  badges?: string[];
  /** Where the business's public reviews live — a Google Business Profile, a
      Facebook page, a Better Business Bureau listing. The testimonials band
      links to it so a sceptic can check the quotes against a source we do not
      control. Omit it and the band simply does not offer the link; do not
      point it at a profile with no reviews on it. */
  reviewsUrl?: string;
  /** What to call that source in the link — "Google", "Facebook". */
  reviewsLabel?: string;

  /** Structural warranty on a new home, in months. Omit to make no warranty claim. */
  warrantyMonths?: number;
  /** Transport included in the listed price, in miles from the lot. */
  transportIncludedMiles?: number;
  /** Deposit schedule for a cash purchase, as a sentence. */
  cashDepositSchedule?: string;
};

export const company: Company = {
  /* The three promises in Maxey's hero, in its own order and wording. Each
     one is a promise the business already advertises. */
  badges: ["Licensed dealer", "Financing available", "Delivery included"],

  /* Maxey publishes a span of combined experience rather than a founding
     year — "over 85 years of combined experience" across "three
     generations" — so it is stated as what it is. */
  experienceClaim: {
    years: 85,
    generations: 3,
  },

  /* Maxey's own Our Story text, as the About page on maxeycustomhomes.com
     words it today. Every sentence below is the business's own — do not
     embroider it. Note it names the registered entity, Maxey Homes & Land,
     rather than the trading name the rest of the site uses. */
  story: {
    eyebrow: "Our story",
    heading: "Built on generations of trust.",
    paragraphs: [
      "At Maxey Homes & Land we believe finding the right home should be simple, honest, and stress-free. Backed by three generations of hard work and integrity, our team brings over 85 years of combined experience in the manufactured housing industry.",
      "We specialize in helping individuals and families find quality manufactured homes and land solutions that fit their needs, lifestyle, and budget. Whether you're purchasing your first home, upgrading, or searching for the right piece of land, we guide you every step of the way with clear communication and dependable service.",
      "What sets us apart is our commitment to honesty, transparency, and long-term relationships. We don't just sell homes — we help people build a future they can feel confident in.",
      "At Maxey Homes & Land, LLC, you're not just another customer — you're part of a legacy built on trust.",
    ],
  },

  /* The three cards under Our Story on Maxey's About page, verbatim. They
     restate the story in a shorter form rather than adding to it, which is
     what this section is for. */
  principles: [
    {
      icon: "Shield",
      title: "Generations of experience",
      body: "Built on three generations and over 85 years of combined experience in manufactured housing. We know what works — and what doesn't.",
    },
    {
      icon: "Pin",
      title: "Homes + land made simple",
      body: "We help you find the right home, the right land, and the right setup — without confusion or guesswork.",
    },
    {
      icon: "Wrench",
      title: "No pressure. Just real help.",
      body: "Straight answers, honest guidance, and a team that actually cares about getting it right for you.",
    },
  ],

  /* Deliberately absent, because Maxey does not publish them: `founded`,
     `homesSoldWords`, `teamSize`, `homesOpenOnLot`, `team`, `teamNote`,
     `licenseId`, `reviewsUrl`, `reviewsLabel`, `warrantyMonths`,
     `transportIncludedMiles` and `cashDepositSchedule`. Each one hides its
     own section. Maxey's hero says "Licensed dealer" but publishes no licence
     number, so the badge stands and `licenseId` does not — an unverifiable
     licence number is the single worst field on this list to guess at. Do not
     fill one in from a directory listing or an estimate; only from something
     the business has put in writing itself. */
};

const SMALL_NUMBERS = [
  "zero", "one", "two", "three", "four", "five", "six",
  "seven", "eight", "nine", "ten", "eleven", "twelve",
];

/**
 * Small counts read better spelled out in display type — "Nine people", not
 * "9 people". Anything past twelve stays a numeral, which is also the house
 * style for the catalogue.
 */
export function spellCount(n: number): string {
  return SMALL_NUMBERS[n] ?? String(n);
}

/** Years trading, or undefined when no founding year is on record. */
export function yearsTrading(now = new Date().getFullYear()): number | undefined {
  return company.founded ? now - company.founded : undefined;
}
