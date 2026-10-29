/**
 * Maxey's own words about a home — the part of a listing page no other
 * dealer selling the same plan can copy.
 *
 * The specs on every listing are the manufacturer's, and so is most of what
 * any dealer's page for that plan says. What makes a page Maxey's is what
 * Maxey's people think of the home after walking through it: why they like
 * it, who it suits, what to notice. That has to come from them. It is an
 * opinion the business is putting its name to, so it is never drafted from a
 * spec sheet to fill the slot — an empty note hides its section, and the
 * page is still complete without it.
 *
 * Keyed by slug, like `lotState` in `lib/homes.ts`; `npm run lint` fails on a
 * key that matches no home. Every field is optional and each hides on its own.
 *
 * Where to start: the homes standing on the lot, which are the ones people
 * drive over to see —
 *
 *   mini-series-tulip         mini-series-buttercup
 *   prime-series-2856h32p01   prime-series-2876h53p01
 *   prime-3276h42p03          the-red-river
 *   the-swisher               origin-series-aspen
 *   origin-series-sycamore
 *
 * — then the two on their way (`origin-series-oak`, `origin-series-dogwood`),
 * then whichever plans people ask about most. Twenty or thirty good notes are
 * worth more than a hundred thin ones.
 *
 * A note looks like this:
 *
 *   "the-swisher": {
 *     whyWeLikeIt: ["One or two short paragraphs, in your own voice."],
 *     bestFor: ["A family that wants the bedrooms split", "…"],
 *     standouts: ["The walk-in pantry off the kitchen", "…"],
 *   },
 */
export type HomeNote = {
  /** Paragraphs. Why Maxey's people like this home. */
  whyWeLikeIt?: string[];
  /** Short phrases — who this home suits. */
  bestFor?: string[];
  /** Short phrases — what to notice in the floor plan. */
  standouts?: string[];
};

export const homeNotes: Record<string, HomeNote> = {};

export function noteFor(slug: string): HomeNote | undefined {
  const note = homeNotes[slug];
  if (!note) return undefined;
  const has = (a?: string[]) => !!a && a.length > 0;
  return has(note.whyWeLikeIt) || has(note.bestFor) || has(note.standouts) ? note : undefined;
}
