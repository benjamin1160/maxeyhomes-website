/**
 * Facts that are true of this dealership's market and nowhere else.
 *
 * The editorial pages argue a case about manufactured housing that holds in
 * any state — the HUD Code, the chattel-versus-mortgage gap, how titling
 * works. But the moment copy names a county, a wind zone or a state statute,
 * it stops being portable, and shipping one market's answer to another
 * dealership is worse than saying nothing: it is confidently wrong.
 *
 * It is also the cheapest way to stop two sites built from this template
 * reading identically. A page that knows the buyer's wind zone and their
 * state's real-property conversion is both unique and more useful than the
 * generic version of itself.
 *
 * Same contract as `lib/company.ts`: every field is optional, and the copy
 * that reads one falls back to a portable sentence when it is absent. Fill
 * in what you can verify for the market; leave the rest out.
 */
export type Market = {
  /** Counties the dealership actually sells into, for USDA and permitting copy. */
  /** What people here call the area — "Central Maine", "the Midcoast".
      Used in the headline. Absent, the headline says the state instead. */
  regionName?: string;
  countiesServed?: string[];
  /**
   * HUD wind zone for the market — I inland, II and III coastal and
   * hurricane-prone. Decides what the home must be engineered to.
   */
  windZone?: "I" | "II" | "III";
  /** HUD thermal zone, 1–3, which sets the insulation requirement. */
  thermalZone?: 1 | 2 | 3;
  /**
   * How this state converts a manufactured home to real property, in one
   * sentence — the affidavit or certificate, and where it is filed. This
   * varies enough between states that a generic answer is useless.
   */
  realPropertyConversion?: string;
  /** Anything locally specific about USDA eligibility worth telling a buyer. */
  usdaNote?: string;
  /** Frost depth in inches, which drives footing depth on owned land. */
  frostDepthInches?: number;
};

export const market: Market = {
  regionName: "Central Oklahoma",
  /* Absent on purpose. Maxey names one place on its own site — Norman — and
     publishes no county list, no delivery radius and no service-area map. A
     county here is a promise to deliver there, so add one only when the
     business says it does. Norman itself sits in Cleveland County. */
  // countiesServed: [],
  /* Oklahoma is HUD Wind Zone I. Worth knowing what that does and does not
     mean here: the HUD wind zones model sustained hurricane-force wind, so
     Zone I is a statement about the Gulf coast being somewhere else, not a
     statement about tornadoes. Anchoring and the installation are what carry
     a home through Oklahoma weather, and those are set-crew work. */
  windZone: "I",
  /* Oklahoma is HUD Thermal Zone 2 — the middle band, with Arkansas, Kansas,
     Missouri, New Mexico and Tennessee. An envelope specified for Zone 1 is
     under-insulated for a Norman summer and a Norman January both. */
  thermalZone: 2,
  realPropertyConversion:
    "Oklahoma issues a manufactured home its own certificate of title, the way it does a vehicle. Once the home is permanently affixed to land the owner also owns, the owner files to cancel that title — the county assessor certifies the land description first, and the cancellation has to follow within 60 days — under 47 O.S. § 1110. From then on the home is conveyed with the real estate. A title cannot be surrendered while a security interest on the home is unreleased.",
  usdaNote:
    "USDA lending is a rural-eligibility test on the parcel, not on the buyer's idea of rural, and a great deal of the ground around Norman passes it even though Norman itself does not. It is worth ten minutes with the USDA eligibility map before you assume you do not qualify — and note it applies to land you own, not a leased pad.",
  /* Norman, Oklahoma City and Tulsa all build to an 18-inch frost line;
     southern Oklahoma counties go to 12. Confirm with the building
     department for the jurisdiction you are setting in — the city and county
     amendments are where the real number lives. */
  frostDepthInches: 18,
};

/** "Cleveland and McClain" — for prose that lists the service area. */
export function countyList(): string | undefined {
  const c = market.countiesServed;
  if (!c || c.length === 0) return undefined;
  if (c.length === 1) return c[0];
  return `${c.slice(0, -1).join(", ")} and ${c[c.length - 1]}`;
}
