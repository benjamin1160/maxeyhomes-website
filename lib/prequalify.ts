/**
 * QualifyWizard's soft-credit pre-qualification, run on three pages of its
 * own (see `qwPages` below).
 *
 * QualifyWizard hands a dealership one snippet:
 *
 *   <script type="text/javascript"
 *     src="https://plugin.qualifywizard.com/lib/qw-plugin.js?dealerId=18506&autoInstall">
 *   </script>
 *
 * QualifyWizard asked for it to be on every page, once, so `app/layout.tsx`
 * loads it. With `autoInstall` it finds whichever container the page carries
 * and puts the matching wizard in it — on a hard load and again after every
 * client-side navigation. Only the dealer id in it is ours, so only the id
 * is kept here; the script URL is built from it in `qualifyWizardSrc`, and an
 * id that is not all digits switches the widget off rather than becoming
 * part of a URL. Set `qualifyWizard` to null and the script is not loaded.
 *
 * The widget's leads go to QualifyWizard and from there wherever Maxey's
 * QualifyWizard account sends them. They do NOT pass through
 * `lib/ghl/submit.ts`, so none of the custom fields in `lib/ghl/fields.ts`
 * or the site's first-touch attribution ride along.
 */
export const qualifyWizard: { dealerId: string } | null = {
  dealerId: "18506",
};

export function qualifyWizardSrc(): string | null {
  const id = qualifyWizard?.dealerId.trim();
  if (!id || !/^\d+$/.test(id)) return null;
  return `https://plugin.qualifywizard.com/lib/qw-plugin.js?dealerId=${id}&autoInstall`;
}

/** The two containers QualifyWizard's account is set up to fill. The ids are
    set in Maxey's QualifyWizard account, not here — change them there first. */
export const QW_CONTAINER = {
  /** The no-SSN wizard. */
  frame: "qw-frame-page-container-id",
  /** The no-score-impact wizard. */
  ssn: "qw-frame-page-ssn-container-id",
} as const;

export type QwPage = {
  path: string;
  /** Plain text above the wizard — QualifyWizard's wording, word for word. */
  title: string;
  container: keyof typeof QW_CONTAINER;
  /** In the header, drawer, footer and sitemap. The social-media and
      no-score-impact pages are reached from links QualifyWizard and Maxey
      hand out, and are kept out of all four at their request. */
  inNav: boolean;
};

/* The three pages, as QualifyWizard specified them. The titles make claims
   about QualifyWizard's process (no SSN, no effect on the score); if the
   account changes, change them the same day. */
export const qwPages = {
  noSSN: {
    path: "/pre-qualify-no-ssn-required",
    title: "Pre-Qualify No SSN Required",
    container: "frame",
    inNav: true,
  },
  socialMedia: {
    path: "/pre-qualify-no-ssn-social-media",
    title: "Welcome Friends and Followers!",
    container: "frame",
    inNav: false,
  },
  noScoreImpact: {
    path: "/pre-qualify-no-score-impact",
    title: "Pre-Qualify No Score Impact",
    container: "ssn",
    inNav: false,
  },
} satisfies Record<string, QwPage>;
