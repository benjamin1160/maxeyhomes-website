/**
 * The soft-credit pre-qualification on `/prequalify`, run by QualifyWizard.
 *
 * QualifyWizard hands a dealership one snippet:
 *
 *   <script type="text/javascript"
 *     src="https://plugin.qualifywizard.com/lib/qw-plugin.js?dealerId=18506&autoInstall">
 *   </script>
 *
 * Only the dealer id in it is ours, so only the id is kept here; the script
 * URL is built from it in `qualifyWizardSrc`, and an id that is not all
 * digits switches the widget off rather than becoming part of a URL. Remove
 * `qualifyWizard` (or set it to null) and `/prequalify` falls back to the
 * call-me-back form alone.
 *
 * The widget's leads go to QualifyWizard and from there wherever Maxey's
 * QualifyWizard account sends them. They do NOT pass through
 * `lib/ghl/submit.ts`, so none of the custom fields in `lib/ghl/fields.ts`
 * or the site's first-touch attribution ride along. The form underneath it
 * on the page still does.
 *
 * The copy below is what Maxey set on its own platform for this widget —
 * soft check, no SSN, under thirty seconds. Those are claims about
 * QualifyWizard's process: if the account is switched to a hard pull or
 * starts asking for an SSN, change `softCheck` / `noSSN` the same day.
 */
export const qualifyWizard: {
  dealerId: string;
  /** A soft pull: it does not affect the applicant's score. */
  softCheck: boolean;
  /** Whether the "No SSN required" reassurance is shown. */
  noSSN: boolean;
  headline: string;
  subtext: string;
} | null = {
  dealerId: "18506",
  softCheck: true,
  noSSN: true,
  headline: "Get pre-qualified in under 30 seconds",
  subtext: "It's a soft credit check, so it won't affect your credit score.",
};

export function qualifyWizardSrc(): string | null {
  const id = qualifyWizard?.dealerId.trim();
  if (!id || !/^\d+$/.test(id)) return null;
  return `https://plugin.qualifywizard.com/lib/qw-plugin.js?dealerId=${id}&autoInstall`;
}
