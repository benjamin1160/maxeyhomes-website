import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Accordion } from "@/components/accordion";
import { breadcrumbJsonLd, JsonLd } from "@/components/json-ld";
import { NextSteps } from "@/components/next-steps";
import { PageHero } from "@/components/page-hero";
import { PaymentCalculator } from "@/components/payment-calculator";
import { Reveal } from "@/components/reveal";
import {
  Badge,
  ButtonLink,
  Container,
  Icon,
  Section,
  SectionHeading,
} from "@/components/ui";
import { company } from "@/lib/company";
import { hasPrices, priceBounds } from "@/lib/homes";
import { money } from "@/lib/format";
import { market } from "@/lib/market";
import { pages } from "@/lib/page-config";
import { contactHref } from "@/lib/navigation";
import { qwPages } from "@/lib/prequalify";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: `Manufactured Home Financing in ${site.stateName}`,
  description: `How to finance a manufactured home in ${site.stateName}: pre-qualifying with no SSN, home-only against land-home loans, conventional, FHA, VA and cash, and what you need for a down payment — from ${site.name} in ${site.address.city}.`,
  path: routes.financing,
});

/* Home-only against land-home, row by row. The one decision that sets the
   rate, the term and which loans are open — and it is decided by the land,
   not by the home. */
const COMPARE: { row: string; homeOnly: string; landHome: string }[] = [
  {
    row: "What it pays for",
    homeOnly: "The home, delivered and set",
    landHome: "The land, the site work and the home, on one loan",
  },
  {
    row: "Where the home sits",
    homeOnly: "A leased lot, family land, or land you keep out of the loan",
    landHome: "Land you own or are buying in the same closing",
  },
  {
    row: "How it is titled",
    homeOnly: "Personal property, with its own certificate of title",
    landHome: "Real property, conveyed with the land",
  },
  {
    row: "Loan types",
    homeOnly: "Home-only (chattel) loans, FHA Title I",
    landHome: "Conventional, FHA, VA, and USDA where the parcel qualifies",
  },
  {
    row: "Rate and term",
    homeOnly: "Higher rates, shorter terms",
    landHome: "Mortgage rates and terms, up to 30 years",
  },
  {
    row: "Foundation",
    homeOnly: "Piers and anchors to the installation standard",
    landHome: "A permanent foundation, usually with an engineer's certification",
  },
  {
    row: "Best when",
    homeOnly: "You want in quickly, or the land is not yours to borrow against",
    landHome: "You own the ground or are buying it — this is where the equity is",
  },
];

/* What decides the down payment, in plain terms. Program minimums as the
   programs publish them; the lender's own overlays can ask for more. */
const DOWN = [
  {
    title: "The loan sets the minimum",
    body: "FHA asks for 3.5% at a credit score of 580 or more. VA asks for nothing from an eligible borrower. Conventional manufactured-home programs start from 3 to 5%. Home-only loans usually ask for more than any of them.",
  },
  {
    title: "Land you own can count",
    body: "On a land-home loan, equity in land you already own can often go toward the down payment — sometimes all of it. If you have the land paid off, ask about this before you save for a down payment you may not need.",
  },
  {
    title: "Gifts are allowed",
    body: "Most mortgage programs, FHA among them, accept a down payment gifted by family, with a signed gift letter and a paper trail for the money. Tell the lender early rather than at closing.",
  },
  {
    title: "Budget the rest separately",
    body: "Closing costs, the site work and anything the loan does not cover are on top of the down payment. Get the setup number in writing before the loan is sized, so the loan is sized to the whole thing.",
  },
];

const PATHS = [
  {
    name: "Home-only (chattel)",
    rate: "Higher",
    term: "Shorter",
    down: "Varies",
    tone: "neutral" as const,
    needs: "Leased lot or owned land · home titled as personal property",
    body: "The home financed on its own, the way most homes on a leased lot are. Quicker to close and no land in the deal, but the rate is higher and the term shorter than a mortgage, and the home is titled like a vehicle rather than a house.",
  },
  {
    name: "Conventional",
    rate: "6.4 – 7.1%",
    term: "30 yr",
    down: "5% down",
    tone: "ember" as const,
    needs: "Owned land · permanent foundation · real-property title",
    body: "Fannie Mae's MH Advantage and Freddie's CHOICEHome both price manufactured homes at or near site-built rates when the home meets the eligibility criteria. Ask whether the home you are looking at is built to that specification — it is worth a great deal at closing.",
  },
  {
    name: "FHA Title II",
    rate: "6.2 – 6.9%",
    term: "30 yr",
    down: "3.5% down",
    tone: "moss" as const,
    needs: "Owned land · permanent foundation · 400+ sq ft",
    body: "The most forgiving credit profile of any real-property option, and the lowest down payment. It requires an engineer's foundation certification, so build that into the schedule rather than discovering it at the end.",
  },
  {
    name: "VA",
    rate: "6.0 – 6.7%",
    term: "30 yr",
    down: "0% down",
    tone: "moss" as const,
    needs: "Eligible service · owned land · permanent foundation",
    body: "No down payment and no mortgage insurance. Fewer lenders write VA on manufactured homes, so the shortlist is short — ask us who is writing them in Oklahoma this month before you spend six weeks with the wrong originator.",
  },
  {
    name: "Cash / construction",
    rate: "—",
    term: "—",
    down: "—",
    tone: "neutral" as const,
    needs: "Any",
    /* The deposit schedule is this dealership's own term, not an industry
       standard — it lives in `lib/company.ts` and this row falls back to a
       claim-free line when none is set. */
    body:
      company.cashDepositSchedule ??
      "No lender, no appraisal and no rate to compare. Ask us for the deposit schedule in writing before you pay anything.",
  },
];

const ORDER = [
  {
    n: "01",
    title: "Call or visit the team",
    body: "Before a lender, before a floor plan. Ten minutes on the phone, or a walk through the homes standing on the lot, tells us where you are — land or no land, credit, budget — and tells you which of the paths above is actually open to you. If you do not own land yet, the buyer's guide at /start-here walks through the three ways onto ground.",
  },
  {
    n: "02",
    title: "Pre-approval, not pre-qualification",
    body: "A pre-qualification is a lender being polite. A pre-approval is underwriting having actually looked. Ask for the second one; it costs nothing and takes about four days, and it sets the ceiling for everything that follows.",
  },
  {
    n: "03",
    title: "Pick the home, the options and a deposit",
    body: "With the ceiling known, choose the plan, the finishes and the options. A deposit holds a build slot. Colour and finish selections stay open until the build lock date, typically three weeks before the plant run.",
  },
  {
    n: "04",
    title: "Find the land and walk the site",
    body: "If you do not own ground yet, we help you look. Once there is a parcel, we visit it: access, utilities, setbacks, soil, permits. We produce a written number for the development. This is the line item that surprises people, and it is the one nobody else will quote you up front.",
  },
  {
    n: "05",
    title: "Close at set, not at order",
    body: "You do not start paying a mortgage on a home that is still a stack of lumber. Funding happens when the home is on its piers and the foundation certification is signed.",
  },
];

const FAQ = [
  {
    title: "What credit score do I need?",
    body: (
      <p>
        We can work with credit as low as 580. If you are below that, contact us and we
        will enrol you in one of our credit restoration programs — buyers who have gone
        through it have been approved in two to six months.
      </p>
    ),
  },
];

/**
 * Reviews from buyers who came through credit restoration, shown under the
 * credit answer. Same rule as the landing page: take each one from a review
 * the customer actually published, or with their written permission, and
 * never draft one to fill the row. Empty, the block does not render.
 */
const CREDIT_REVIEWS: { quote: string; name: string; detail: string }[] = [];

export default function FinancingPage() {
  /* Turned off in `lib/page-config.ts`, this route sends visitors home rather
     than 404ing — an indexed link or a printed card outlives the switch. */
  if (!pages.financing) redirect("/");

  /* Sections number themselves, because two of them are conditional. */
  let n = 2;
  const index = () => String(n++).padStart(2, "0");
  const programs = company.financingPrograms ?? [];
  const trail = [
    { href: "/", label: "Home" },
    { href: routes.financing, label: "Financing" },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(trail)} />
      <PageHero
        photoKey="page/financing"
        index="01"
        eyebrow="Financing"
        title={
          <>
            Manufactured home financing in {site.stateName},
            <br />
            plainly.
          </>
        }
        lede={
          hasPrices
            ? `Homes here run ${money(priceBounds.min)} to ${money(priceBounds.max)}. What that costs you every month depends far more on how you finance it than on which one you pick.`
            : "What a home costs you every month depends far more on how you finance it than on which one you pick. Here is how the paths differ, and how to work out your own number."
        }
        kind="exterior"
        breadcrumb={trail}
      >
        {pages.prequalify && (
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={qwPages.noSSN.path} className="!px-6 !py-3.5">
              Pre-qualify — no SSN required
              <Icon.Arrow className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
            </ButtonLink>
            <a
              href="#compare"
              className="inline-flex items-center justify-center rounded-button border border-white/60 px-6 py-3.5 text-[0.9rem] font-medium text-white transition-colors hover:bg-white hover:text-ink"
            >
              Home-only or land-home?
            </a>
          </div>
        )}
      </PageHero>

      {/* Pre-qualification */}
      {pages.prequalify && (
        <section className="border-b border-line bg-surface">
          <Container className="py-16 sm:py-20">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center lg:gap-16">
              <Reveal>
                <SectionHeading
                  index={index()}
                  eyebrow="Start here"
                  title="Pre-qualify before you pick a home."
                />
              </Reveal>
              <Reveal delay={80}>
                <div className="space-y-4 text-lg leading-relaxed text-muted">
                  <p>
                    Knowing what you can borrow first saves falling for a home, or a parcel,
                    that the numbers will not reach. Our online pre-qualification needs no
                    Social Security number, and it takes the guesswork out of the first
                    conversation with us.
                  </p>
                  <p>
                    It is the first step, not the last: a pre-approval — underwriting actually
                    looking at your file — comes once you are ready to choose. The order is
                    laid out further down this page.
                  </p>
                  <ButtonLink href={qwPages.noSSN.path} className="!mt-7">
                    Pre-qualify now
                    <Icon.Arrow className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </ButtonLink>
                </div>
              </Reveal>
            </div>
          </Container>
        </section>
      )}

      {/* Home-only against land-home */}
      <Section id="compare" className="scroll-mt-[calc(var(--chrome-h)+1.5rem)]">
        <Reveal>
          <SectionHeading
            index={index()}
            eyebrow="The first decision"
            title="Home-only, or home and land together?"
            lede="Which loans you can use, the rate and the term are all decided by one thing: whether the land is in the deal. Here are the two side by side."
          />
        </Reveal>
        <Reveal className="mt-12">
          <div className="overflow-x-auto rounded-card border border-line">
            <table className="w-full min-w-[40rem] text-left">
              <thead className="bg-surface font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
                <tr>
                  <th scope="col" className="w-1/5 px-5 py-4 font-normal">
                    <span className="sr-only">Question</span>
                  </th>
                  <th scope="col" className="px-5 py-4 font-normal">Home-only</th>
                  <th scope="col" className="px-5 py-4 font-normal">Land-home</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {COMPARE.map((r) => (
                  <tr key={r.row}>
                    <th scope="row" className="px-5 py-4 align-top text-sm font-medium text-ink">
                      {r.row}
                    </th>
                    <td className="px-5 py-4 align-top text-[0.95rem] leading-relaxed text-muted">
                      {r.homeOnly}
                    </td>
                    <td className="px-5 py-4 align-top text-[0.95rem] leading-relaxed text-muted">
                      {r.landHome}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
        {market.realPropertyConversion && (
          <Reveal className="mt-8">
            <p className="max-w-3xl leading-relaxed text-muted">
              <span className="font-medium text-ink">In {site.stateName}: </span>
              {market.realPropertyConversion}
            </p>
          </Reveal>
        )}
        {pages.homeAndLand && (
          <p className="mt-6 text-muted">
            Putting a home on land — yours or land you still need — is laid out step by step
            on{" "}
            <Link href={routes.homeAndLand} className="text-ink underline underline-offset-4">
              home + land
            </Link>
            .
          </p>
        )}
      </Section>

      {/* Paths */}
      <Section className="border-t border-line">
        <Reveal>
          <SectionHeading
            index={index()}
            eyebrow={`The ${PATHS.length} paths`}
            title="How the paths differ, plainly."
            lede="Indicative ranges for comparing the paths against each other, not quotes and not an offer of credit. Your number comes from a lender after underwriting, and depends on credit, term, down payment and how the home is titled."
          />
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {PATHS.map((p, i) => (
            <Reveal key={p.name} delay={i * 80}>
              <div className="flex h-full flex-col rounded-card border border-line bg-surface p-7">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-display text-2xl tracking-tight text-ink">{p.name}</h3>
                  <Badge tone={p.tone}>{p.down}</Badge>
                </div>
                <div className="mt-5 flex items-baseline gap-3 border-y border-line py-4">
                  <span className="font-display text-3xl tracking-tight text-ink">{p.rate}</span>
                  <span className="font-mono text-xs text-muted">{p.term}</span>
                </div>
                <p className="mt-5 flex-1 text-[0.94rem] leading-relaxed text-muted">{p.body}</p>
                <p className="mt-6 flex gap-2.5 text-[0.8rem] leading-relaxed text-ink-soft">
                  <Icon.Check className="mt-0.5 size-4 shrink-0 text-ember" />
                  {p.needs}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Down payment */}
      <Section className="border-t border-line">
          <Reveal>
            <SectionHeading
              index={index()}
              eyebrow="Down payment"
              title="What you need to put down, and where it can come from."
            />
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {DOWN.map((d, i) => (
              <Reveal key={d.title} delay={(i % 2) * 80}>
                <div className="h-full rounded-card border border-line bg-surface p-7">
                  <h3 className="font-display text-2xl tracking-tight text-ink">{d.title}</h3>
                  <p className="mt-4 leading-relaxed text-muted">{d.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
          {pages.pricingGuide && (
            <p className="mt-8 text-muted">
              Every line of the cost the loan has to cover is in the{" "}
              <Link href={routes.pricingGuide} className="text-ink underline underline-offset-4">
                pricing guide
              </Link>
              .
            </p>
          )}
      </Section>

      {/* What this dealership actually arranges — `lib/company.ts`. Absent
          until the business says which programs and lenders it writes
          through; the loan types above are true of any dealer. */}
      {programs.length > 0 && (
        <Section>
          <Reveal>
            <SectionHeading
              index={index()}
              eyebrow="Through us"
              title="What we can set up for you."
            />
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {programs.map((p, i) => (
              <Reveal key={p.name} delay={(i % 3) * 80}>
                <div className="h-full rounded-card border border-line bg-surface p-7">
                  <h3 className="font-display text-2xl tracking-tight text-ink">{p.name}</h3>
                  <p className="mt-4 leading-relaxed text-muted">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      {/* Calculator */}
      <section id="calculator" className="scroll-mt-[calc(var(--chrome-h)+1.5rem)] border-y border-line bg-surface">
        <Container className="py-20 sm:py-28">
          <Reveal>
            <SectionHeading
              index={index()}
              eyebrow="Run it yourself"
              title="Move the sliders. Find your number."
              lede="Put in the home and development price you are working with, then the land, the rate and the down payment. Every figure is a slider, so change the one you are unsure of and watch what it does to the month."
            />
          </Reveal>
          <Reveal className="mt-12">
            <div className="mx-auto max-w-3xl">
              {/* No listing here to take a price from, so the visitor sets
                  one. Seeded at the calculator's own worked example, not a
                  home's sticker. */}
              <PaymentCalculator price={240000} editablePrice />
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Order of operations */}
      <Section>
        <Reveal>
          <SectionHeading
            index={index()}
            eyebrow="Order of operations"
            title="Do these in this order and nothing goes wrong."
            lede="Almost every purchase that falls apart falls apart because somebody took the steps out of order."
          />
        </Reveal>

        <ol className="mt-14 space-y-px overflow-hidden rounded-2xl border border-line bg-line">
          {ORDER.map((s, i) => (
            <Reveal
              key={s.n}
              delay={i * 70}
              as="li"
              className="grid gap-4 bg-paper p-7 sm:grid-cols-[6rem_minmax(0,20rem)_1fr] sm:items-baseline sm:gap-8 sm:p-9"
            >
              <span className="font-mono text-sm text-ember">{s.n}</span>
              <h3 className="font-display text-2xl leading-snug tracking-tight text-ink">
                {s.title}
              </h3>
              <p className="leading-relaxed text-muted">{s.body}</p>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* FAQ */}
      <section className="border-t border-line bg-surface">
        <Container className="py-20 sm:py-28">
          <Reveal>
            <SectionHeading index={index()} eyebrow="Credit" title="Asked and answered." />
          </Reveal>
          <Reveal className="mt-12">
            <Accordion items={FAQ} defaultOpen={0} />
          </Reveal>

          {CREDIT_REVIEWS.length > 0 && (
            <Reveal className="mt-12">
              <p className="eyebrow">From buyers who came through credit restoration</p>
              <div className="mt-6 grid gap-6 md:grid-cols-3">
                {CREDIT_REVIEWS.map((r) => (
                  <figure
                    key={r.name}
                    className="flex h-full flex-col rounded-card border border-line bg-paper p-7"
                  >
                    <blockquote className="flex-1 leading-relaxed text-ink">
                      &ldquo;{r.quote}&rdquo;
                    </blockquote>
                    <figcaption className="mt-5 text-sm text-muted">
                      <span className="font-medium text-ink">{r.name}</span> &middot; {r.detail}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </Reveal>
          )}

          <Reveal className="mt-16">
            <div className="flex flex-col items-start gap-6 rounded-card border border-line bg-paper p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
              <div>
                <h3 className="font-display text-2xl tracking-tight text-ink">
                  Want a real number instead of an estimate?
                </h3>
                <p className="mt-2 max-w-lg leading-relaxed text-muted">
                  Tell us the parcel, or that you are still looking for one, and we will put
                  a lender quote and a written development cost in front of you.
                </p>
              </div>
              <ButtonLink href={contactHref} className="shrink-0 !px-7 !py-4 !text-base">
                Start there
                <Icon.Arrow className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </ButtonLink>
            </div>
          </Reveal>
        </Container>
      </section>

      <NextSteps exclude={["financing"]} />
    </>
  );
}
