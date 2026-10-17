import type { Metadata } from "next";
import { QualifyWizardPage } from "@/components/qualify-wizard-page";
import { qwPages } from "@/lib/prequalify";

const page = qwPages.socialMedia;

export const metadata: Metadata = {
  title: page.title,
  description: "Pre-qualify for a manufactured home with a soft credit check — no Social Security number required.",
};

export default function Page() {
  return <QualifyWizardPage page={page} />;
}
