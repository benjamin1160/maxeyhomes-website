/**
 * The pricing guide — `/manufactured-home-prices-oklahoma`.
 *
 * Every line of what a manufactured home costs once it is standing on ground
 * with the lights on, what moves each line, and who quotes it. The guide is
 * written so it is true without a single dollar figure in it, and it ships
 * that way: the home's own price comes from the catalogue (and only when
 * `SHOW_PRICES` in `lib/homes.ts` is on), and the example totals below are
 * EMPTY.
 *
 * Fill `exampleTotals` from real deals — a home Maxey actually set, with what
 * each line actually cost — and the page grows a worked-examples section on
 * its own. Do not fill it from industry averages or a competitor's page: a
 * number on this site reads as Maxey's number, and somebody will hold the
 * business to it. Round the figures, and note what each example assumes.
 */

export type CostLine = {
  /** Anchor on the page, e.g. `#delivery`. */
  id: string;
  title: string;
  /** What this line pays for. */
  covers: string;
  /** What makes it bigger or smaller. */
  moves: string[];
  /** Who puts a number on it. */
  quotedBy: string;
};

export const costLines: CostLine[] = [
  {
    id: "home",
    title: "The home",
    covers:
      "The house itself, built in the plant to the HUD code, with the options and finishes you choose.",
    moves: [
      "Size and sections — a double wide is two homes' worth of plant work",
      "The builder and the series",
      "Options: upgraded kitchens, porches, roof pitch, siding, flooring",
    ],
    quotedBy: "Us, against the exact plan and options you choose.",
  },
  {
    id: "delivery",
    title: "Delivery",
    covers: "Moving the home from the plant or the lot to your site on its own running gear.",
    moves: [
      "Distance from the lot",
      "One load or two",
      "Road access — tight turns, low wires or a soft drive can mean extra work on the day",
    ],
    quotedBy: "Us, once we know where the home is going.",
  },
  {
    id: "setup",
    title: "Setup",
    covers:
      "Placing the home, levelling it on its piers, anchoring it, and — for a double wide — joining the two sections and finishing the seam inside and out.",
    moves: [
      "Single or double section",
      "How level the site is",
      "The installation standard the loan or the jurisdiction requires",
    ],
    quotedBy: "Us — the set is done by a state-licensed installer.",
  },
  {
    id: "foundation",
    title: "Foundation",
    covers:
      "What the home stands on: piers and anchors, or a permanent foundation built to a mortgage lender's requirements.",
    moves: [
      "Piers and anchors against a permanent foundation",
      "The soil — expansive clay asks more of a footing",
      "An engineer's certification, which FHA, VA and most conventional loans require",
    ],
    quotedBy: "Us, after the site visit, with the engineer where the loan needs one.",
  },
  {
    id: "land",
    title: "Land",
    covers: "The ground the home sits on — owned, bought, or leased.",
    moves: [
      "Owning it already (and whether it can count toward your down payment)",
      "Buying it: the county, the acreage, and what is already on it",
      "Leasing a lot instead: monthly lot rent in place of a purchase",
    ],
    quotedBy: "The seller or the community — we will help you check a parcel before you buy it.",
  },
  {
    id: "utilities",
    title: "Utilities",
    covers: "Water, sewer, electric and gas brought to the home and connected.",
    moves: [
      "City water and sewer, or a well and a septic system",
      "Septic design — Oklahoma's DEQ sets the rules, and the soil decides the system",
      "How far the nearest power pole, water main or gas line is from the pad",
    ],
    quotedBy: "The utility companies, the well driller and the septic installer.",
  },
  {
    id: "permits",
    title: "Permits and inspections",
    covers:
      "The placement permit, utility and septic permits, and the inspections that sign the work off.",
    moves: [
      "Whether the parcel is inside city limits or in the county",
      "What the jurisdiction requires — some ask for much more than others",
    ],
    quotedBy: "The city or county, and DEQ for a septic system.",
  },
  {
    id: "finishing",
    title: "Finishing the site",
    covers: "Everything that makes it a home to drive up to rather than a home on a pad.",
    moves: [
      "Skirting, steps and decks",
      "A driveway and parking pad",
      "A storm shelter or safe room — worth planning in Oklahoma",
    ],
    quotedBy: "Us or the specialist for each — ask which of these the setup quote covers.",
  },
  {
    id: "closing",
    title: "Financing and closing costs",
    covers: "The down payment, the lender's fees, title work, and insurance at closing.",
    moves: [
      "Home-only against a land-home loan",
      "The loan program and the down payment it asks for",
      "Whether land you own counts toward the down payment",
    ],
    quotedBy: "Your lender, on a Loan Estimate.",
  },
];

export type ExampleTotal = {
  /** e.g. "A 3 bed double wide on two acres the buyer already owned". */
  label: string;
  /** Each line and what it actually cost, in dollars. */
  lines: { item: string; amount: number }[];
  /** What the example assumes — the year, the county, what was left out. */
  note: string;
};

/** Real, worked examples. EMPTY until there are real ones — see the head of this file. */
export const exampleTotals: ExampleTotal[] = [];
