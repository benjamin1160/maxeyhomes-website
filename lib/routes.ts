/**
 * The search-facing routes, by name.
 *
 * These are the pages written to be found — the size pages, the home-and-land
 * guide, the financing and pricing guides — and they link to each other a
 * great deal, which is the point of them. A path typed out in twelve places is
 * a rename that misses one, so every link to these reads this table instead.
 *
 * Each one sits behind a switch in `lib/page-config.ts` like any other route.
 * The city pages under `/manufactured-homes-for-sale/<slug>` take their slugs
 * from `lib/locations.ts`.
 */
export const routes = {
  singleWides: "/single-wide-homes-for-sale",
  doubleWides: "/double-wide-homes-for-sale",
  homeAndLand: "/home-and-land",
  /* Moved from `/financing`, which `next.config.ts` redirects here. */
  financing: "/manufactured-home-financing-oklahoma",
  pricingGuide: "/manufactured-home-prices-oklahoma",
  locations: "/manufactured-homes-for-sale",
} as const;
