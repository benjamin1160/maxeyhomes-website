import type { Metadata } from "next";
import { QualifyWizardPage } from "@/components/qualify-wizard-page";
import { qwPages } from "@/lib/prequalify";

const page = qwPages.noScoreImpact;

export const metadata: Metadata = {
  title: page.title,
  description: "Pre-qualify for a manufactured home without affecting your credit score.",
};

export default function Page() {
  return <QualifyWizardPage page={page} />;
}
