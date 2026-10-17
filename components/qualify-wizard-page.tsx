import { redirect } from "next/navigation";
import { Container } from "@/components/ui";
import { QualifyWizardFrame } from "@/components/qualify-wizard";
import { pages } from "@/lib/page-config";
import { qualifyWizard, qualifyWizardSrc, type QwPage } from "@/lib/prequalify";
import { site } from "@/lib/site";

/**
 * One of QualifyWizard's iframe pages — a plain-text title and the wizard's
 * container, nothing else. QualifyWizard specified these pages and their
 * titles; the copy is theirs, so keep it to the title.
 */
export function QualifyWizardPage({ page }: { page: QwPage }) {
  if (!pages.prequalify) redirect("/");
  const live = qualifyWizardSrc() && qualifyWizard;

  return (
    <section className="bg-surface">
      <Container className="py-12 sm:py-16">
        <h1 className="text-center font-display text-3xl tracking-tight text-ink sm:text-4xl">
          {page.title}
        </h1>
        {/* Not inside a Reveal: the plugin measures its container as it
            inserts the frame, and a transformed parent throws that off. */}
        <div className="mt-8">
          {live ? (
            <QualifyWizardFrame dealerId={live.dealerId} container={page.container} />
          ) : (
            <p className="text-center text-muted">
              Call{" "}
              <a href={site.phoneHref} className="text-ink underline underline-offset-4">
                {site.phone}
              </a>{" "}
              and we&apos;ll take you through it.
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
