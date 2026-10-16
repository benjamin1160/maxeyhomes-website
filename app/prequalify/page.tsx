import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { PreApprovalForm } from "@/components/pre-approval-form";
import { Reveal } from "@/components/reveal";
import { ButtonLink, Container, Icon, Section, SectionHeading } from "@/components/ui";
import { QualifyWizardFrame } from "@/components/qualify-wizard";
import { pages } from "@/lib/page-config";
import { qualifyWizard, qualifyWizardSrc } from "@/lib/prequalify";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Get pre-approved",
  description: qualifyWizardSrc()
    ? `Find out what you can borrow before you fall in love with a floor plan — a soft credit check that won't affect your score, or a call back from ${site.name}.`
    : `Find out what you can borrow before you fall in love with a floor plan. ${site.name} comes back with a number, a rate range and the titling path — usually the same day.`,
};

/* What a visitor gets for filling the form in, in the order it matters.
   Every line here is a promise about our own process, so it is a claim the
   dealership has to be able to keep — edit it to match what you actually do. */
const PROMISES = [
  {
    icon: Icon.Shield,
    title: "A number before a floor plan",
    body: "Knowing what you can borrow first is what stops a buyer choosing a home they then have to unchoose. It takes one conversation.",
  },
  {
    icon: Icon.Clock,
    title: "Same day, usually",
    body: "Send the form instead of running the check and a person reads it and calls you back. There is no automated decision at the end of it and no credit pull to submit it.",
  },
  {
    icon: Icon.Plan,
    title: "The titling path, in writing",
    body: "Land you own and a permanent foundation is a mortgage. A leased pad is a chattel loan. We will tell you which one you are in before you sign anything.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Tell us where you are looking",
    body: "County, whether you have ground already, and roughly what you want to spend a month.",
  },
  {
    n: "02",
    title: "We check the lending path",
    body: "Conventional, FHA, VA, USDA or chattel — which ones your situation actually opens, and what each costs.",
  },
  {
    n: "03",
    title: "You get a range, not a pitch",
    body: "A borrowing figure, a payment range and the site-work costs nobody quotes you until it is too late.",
  },
];

export default function PreQualifyPage() {
  if (!pages.prequalify) redirect("/");

  /* QualifyWizard's soft check, when `lib/prequalify.ts` configures one.
     The call-back form stays underneath it either way: some buyers would
     rather talk to a person than have their credit looked at, soft or not. */
  const qwSrc = qualifyWizardSrc();
  const qw = qwSrc && qualifyWizard ? { ...qualifyWizard, src: qwSrc } : null;

  return (
    <>
      <PageHero
        photoKey="page/prequalify"
        index="01"
        eyebrow={qw?.softCheck ? "Won't affect your credit score" : "No credit pull to ask"}
        title={
          <>
            Find out what
            <br />
            you can borrow first.
          </>
        }
        lede={
          qw
            ? `${qw.subtext} Or send the form and a person calls you back with a real number and the reasoning behind it.`
            : "Sixty seconds of typing, then a person calls you back with a real number and the reasoning behind it."
        }
        kind="exterior"
        breadcrumb={[
          { href: "/", label: "Home" },
          { href: "/prequalify", label: "Pre-approval" },
        ]}
      />

      {qw && (
        <section id="prequalify" className="scroll-mt-[calc(var(--chrome-h)+1.5rem)] border-b border-line bg-surface">
          <Container className="py-16 sm:py-20">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl tracking-tight text-ink sm:text-4xl">
                {qw.headline}
              </h2>
              <p className="mt-3 leading-relaxed text-muted">{qw.subtext}</p>
              <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-ink-soft">
                {[
                  qw.softCheck && "Won't affect your credit score",
                  qw.noSSN && "No SSN required",
                  "Takes under 30 seconds",
                ]
                  .filter(Boolean)
                  .map((label) => (
                    <li key={label as string} className="flex items-center gap-2">
                      <Icon.Check className="size-4 shrink-0 text-ember" />
                      {label}
                    </li>
                  ))}
              </ul>
            </div>
            {/* Not inside a Reveal: the plugin measures its container as it
                inserts the frame, and a transformed parent throws that off. */}
            <div className="mt-10">
              <QualifyWizardFrame src={qw.src} dealerId={qw.dealerId} />
            </div>
          </Container>
        </section>
      )}

      <Section>
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div>
            <Reveal>
              <SectionHeading
                index="02"
                eyebrow="Why bother"
                title="The cheapest hour you will spend on this."
              />
            </Reveal>
            <div className="mt-10 grid gap-8">
              {PROMISES.map((p, i) => (
                <Reveal key={p.title} delay={i * 90}>
                  <div className="flex gap-5">
                    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-surface-2 text-ember">
                      <p.icon className="size-5" />
                    </span>
                    <div>
                      <h3 className="font-display text-xl tracking-tight text-ink">{p.title}</h3>
                      <p className="mt-2.5 leading-relaxed text-muted">{p.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div id="form">
            {qw && (
              <Reveal delay={100}>
                <p className="eyebrow mb-6">Rather talk to a person first?</p>
              </Reveal>
            )}
            <Reveal delay={140}>
              <PreApprovalForm source="prequalify-page" />
            </Reveal>
          </div>
        </div>
      </Section>

      <section className="border-y border-line bg-surface">
        <Container className="py-20 sm:py-24">
          <Reveal>
            <SectionHeading index="03" eyebrow="What happens next" title="Three steps, none of them a sales floor." />
          </Reveal>
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl bg-line sm:grid-cols-3">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 90} className="bg-paper p-8">
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-ember">{s.n}</p>
                <h3 className="mt-4 font-display text-xl tracking-tight text-ink">{s.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{s.body}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={200}>
            <p className="mt-12 max-w-2xl text-sm leading-relaxed text-muted">
              Pre-approval is not a commitment to lend and does not fix a rate. Terms come
              from the lender, not from us. Prefer to talk it through first? Call{" "}
              <a href={site.phoneHref} className="text-ink underline underline-offset-4">
                {site.phone}
              </a>
              .
            </p>
          </Reveal>
          <Reveal delay={240}>
            <ButtonLink href="/financing" variant="outline" className="mt-8">
              How the financing works
              <Icon.Arrow className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
            </ButtonLink>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
