/**
 * The city pages — `/manufactured-homes-for-sale/<slug>`.
 *
 * Three, each written for its own place. That is deliberate and it is the
 * whole point: forty pages with the town name swapped in are a doorway-page
 * pattern search engines discount, and they tell a buyer in Moore nothing
 * a buyer in Edmond does not already know. A city earns a page here when
 * there is something true and useful to say about buying and setting a home
 * there that is not true of the next town over.
 *
 * What each page says is about the PLACE — its county, how far it is from the
 * lot, whose permit you need, what the ground is like — and none of it is a
 * claim about the business beyond what `lib/company.ts` already makes. The
 * distance is computed from the lot's coordinates, not written in.
 *
 * Facts here are checkable and were checked; where a rule varies parcel by
 * parcel (zoning, deed restrictions, USDA eligibility) the copy says whom to
 * ask rather than giving an answer that is wrong for half the parcels.
 *
 * To add a city: write the entry, every word of it, for that city. Edmond is
 * the obvious fourth.
 */
import { milesFromHQ } from "./land/geo";

export type Location = {
  slug: string;
  city: string;
  /** Postal abbreviation. */
  region: string;
  /** The county most of the city sits in. */
  county: string;
  /** The city centre, for the distance from the lot. */
  lat: number;
  lon: number;
  /** Search title, without the business name. */
  title: string;
  h1: string;
  description: string;
  lede: string;
  /** The page body: a few short sections, each about this place. */
  sections: { title: string; body: string[] }[];
};

const RAW: Location[] = [
  {
    slug: "norman-ok",
    city: "Norman",
    region: "OK",
    county: "Cleveland County",
    lat: 35.2226,
    lon: -97.4395,
    title: "Manufactured Homes for Sale in Norman, OK",
    h1: "Manufactured homes for sale in Norman, Oklahoma",
    description:
      "Buying a manufactured home in Norman, OK: walk through homes on our lot on Melba Ln, then put one on land inside city limits or out in Cleveland County — permits, utilities, financing and setup explained.",
    lede: "Our lot is in Norman, on Melba Ln. That makes this the easiest place we sell into: come and walk the homes standing on it, then we will talk about where yours is going.",
    sections: [
      {
        title: "Start on the lot",
        body: [
          "Most people buying in Norman come by the lot first, and that is the right order. A floor plan on a screen does not tell you how a hallway feels or whether the primary bedroom is far enough from the others. Walking a few of the homes standing on Melba Ln does, in an afternoon.",
          "From there, every plan in the catalogue is a home we can order in — so if the one you like is not standing on the lot, you will at least have stood in one close to it.",
        ],
      },
      {
        title: "Inside the city, or out in the county",
        body: [
          "Norman covers far more ground than the town most people picture. Its city limits run well east of town toward Lake Thunderbird, and a lot of that is rural acreage — land with a Norman address that is on a well and a septic system rather than city water and sewer.",
          "Which side of the line a parcel sits on decides whose rules apply. Inside city limits, the City of Norman's zoning and permits govern where a HUD-code home can go and how it has to be set. Outside them, it is Cleveland County. Check the parcel before you buy it, not after — we can help you do that.",
        ],
      },
      {
        title: "Water, sewer and the ground itself",
        body: [
          "On city utilities, connection is a tap and a permit. On rural ground it is a well and a septic system, and the septic is the one to price early: Oklahoma's Department of Environmental Quality sets the rules for on-site sewage systems, and the soil on your parcel decides what kind you can put in.",
          "Footings in Norman go below an 18-inch frost line, and the red clay common across Cleveland County moves with the seasons — which is why the pad and the foundation are worth getting right the first time.",
        ],
      },
      {
        title: "Financing a Norman home",
        body: [
          "On land you own, with the home on a permanent foundation, a Norman home can be titled as real property and financed with a conventional, FHA or VA mortgage. Norman itself does not pass USDA's rural test, but a good deal of the ground around it does, so a parcel just outside town can open a zero-down option that one inside town does not.",
        ],
      },
    ],
  },
  {
    slug: "moore-ok",
    city: "Moore",
    region: "OK",
    county: "Cleveland County",
    lat: 35.3395,
    lon: -97.4867,
    title: "Manufactured Homes for Sale in Moore, OK",
    h1: "Manufactured homes for sale in Moore, Oklahoma",
    description:
      "Buying a manufactured home in Moore, OK: what zoning and deed restrictions mean for your lot, storm shelters and anchoring, financing, and delivery from our lot in Norman, just down I-35.",
    lede: "Moore sits just up I-35 from our lot in Norman — close enough to drive down and walk the homes on a weekday evening. Here is what is different about putting one on the ground in Moore.",
    sections: [
      {
        title: "Mostly built out, so start with the lot",
        body: [
          "Most of Moore is established neighborhoods, and most of those were platted with site-built houses in mind. That makes the parcel the first question rather than the floor plan: city zoning decides whether a HUD-code home is allowed on it, and a subdivision's deed restrictions can rule one out even where zoning would not.",
          "Ask the City of Moore about the zoning, read the deed for restrictions, and do both before you put money down on the ground. If you are still looking for land, the unincorporated parts of Cleveland County around the city are worth pricing against an in-town lot.",
        ],
      },
      {
        title: "Storms are part of the plan",
        body: [
          "Moore knows tornadoes: the storms of May 1999 and May 2013 both went through the city. A manufactured home is engineered to its HUD wind zone, and Oklahoma is Zone I, which is a hurricane standard and says nothing about tornadoes. What carries a home through Oklahoma weather is the installation: the piers, the tie-downs and the anchors, set to the manufacturer's instructions by a licensed installer.",
          "For the storm itself, plan a shelter. A below-ground or above-ground safe room can go in alongside the home, and Oklahoma has run a SoonerSafe rebate program toward the cost of one — check with the state whether it is taking applications when you buy.",
        ],
      },
      {
        title: "Getting the home there",
        body: [
          "From our lot on Melba Ln, Moore is a short run up the interstate. What decides delivery day is not the distance but the last few hundred feet: the turn into the street, the width of the drive, and room to back two wide loads onto the pad for a double wide. We look at that before you commit to a plan.",
        ],
      },
      {
        title: "Financing in Moore",
        body: [
          "Moore is not USDA-eligible, so in town the mortgage options are conventional, FHA and VA — all of which need the home on a permanent foundation on land you own, titled as real property. On a leased lot, or before the land is settled, it is a home-only loan instead. Our financing page lays the two side by side.",
        ],
      },
    ],
  },
  {
    slug: "oklahoma-city-ok",
    city: "Oklahoma City",
    region: "OK",
    county: "Oklahoma County",
    lat: 35.4676,
    lon: -97.5164,
    title: "Manufactured Homes for Sale in Oklahoma City, OK",
    h1: "Manufactured homes for sale in Oklahoma City",
    description:
      "Buying a manufactured home in Oklahoma City: which of four counties and whose permits your parcel falls under, rural acreage inside city limits, financing, and delivery from our lot in Norman.",
    lede: "Oklahoma City is one of the largest cities in the country by land area, and a lot of that land is not what anyone pictures as a city. That is good news if you are looking for ground to put a home on.",
    sections: [
      {
        title: "A city with acreage in it",
        body: [
          "Oklahoma City's limits take in more than six hundred square miles across four counties — Oklahoma, Canadian, Cleveland and Pottawatomie. Away from the centre, much of that is open, rural-feeling ground, and it is where most of the city's land suited to a manufactured home is.",
          "The catch is that a parcel's county, its zoning and its utilities can all change from one road to the next. Get the parcel's details from the county assessor and the city's zoning map before you fall for a piece of land.",
        ],
      },
      {
        title: "Your mailing address is not your jurisdiction",
        body: [
          "Plenty of addresses that say “Oklahoma City” on the envelope are not inside the city at all — they are in unincorporated county land or in a neighbouring town. That matters, because it decides whose permits you need and whose rules the setup is inspected against.",
          "Inside city limits, permits go through the City of Oklahoma City. Outside them, it is the county or the town. Find out which before you buy the land, and certainly before the home is ordered.",
        ],
      },
      {
        title: "Delivery from Norman",
        body: [
          "Our lot is on Melba Ln in Norman, about twenty miles south of downtown. You can drive down and walk the homes standing on it, and the home you choose comes up I-35 or the county roads to you. As with anywhere, the access at the site — the road in, the drive, the room to set — is what we check before anything is ordered.",
        ],
      },
      {
        title: "Financing in Oklahoma City",
        body: [
          "On land you own, with the home on a permanent foundation, an OKC home can be titled as real property and financed with a conventional, FHA or VA mortgage. At the rural edges of the metro some parcels pass USDA's rural test, which opens a zero-down option — it is a parcel-by-parcel answer, so check the USDA eligibility map for the exact address.",
        ],
      },
    ],
  },
];

export const locations: (Location & { miles: number })[] = RAW.map((l) => ({
  ...l,
  miles: Math.round(milesFromHQ(l.lat, l.lon)),
}));

export function getLocation(slug: string) {
  return locations.find((l) => l.slug === slug);
}

/** The lot's own town, for the "near you" link on every listing. */
export const homeLocation = locations.find((l) => l.slug === "norman-ok");
