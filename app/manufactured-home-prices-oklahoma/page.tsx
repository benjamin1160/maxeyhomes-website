import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { breadcrumbJsonLd, JsonLd } from "@/components/json-ld";
import { NextSteps } from "@/components/next-steps";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { ButtonLink, Container, Icon, Section, SectionHeading } from "@/components/ui";
import { company, spellCount } from "@/lib/company";
import { money } from "@/lib/format";
import {
  enabledSizeCategories,
  inSizeCategory,
  listings,
  sizeCategoryLabels,
} from "@/lib/homes";
import { market } from "@/lib/market";
import { contactHref } from "@/lib/navigation";
import { pages } from "@/lib/page-config";
import { costLines, exampleTotals } from "@/lib/pricing-guide";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { sizeCategoryHref } from "@/lib/size-pages";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: `Manufactured Home Prices in ${site.stateName}: What It Really Costs`,
  description: `What a manufactured home costs in ${site.stateName} once it is on the ground: the home, delivery, setup, foundation, land, utilities, permits and closing — what moves each line and who quotes it. From ${site.name} in ${site.address.city}.`,
  path: routes.pricingGuide,
});

const deliveryIncluded = company.badges?.some((b) => /delivery included/i.test(b));

/* The catalogue's own price range per size, when the site prints prices at
   all. With `SHOW_PRICES` off every home is "Call for pricing" and this is
   empty, so the page never prints a figure the rest of the site withholds. */
function priceRanges() {
  return enabledSizeCategories
    .map((id) => {
      const prices = listings
        .filter((l) => inSizeCategory(l, id) && l.price !== undefined)
        .map((l) => l.price!);
      return prices.length
        ? { id, label: sizeCategoryLabels[id], low: Math.min(...prices), high: Math.max(...prices) }
        : undefined;
    })
    .filter((r) => r !== undefined);
}

export default function PricingGuidePage() {
  if (!pages.pricingGuide) redirect("/");

  const ranges = priceRanges();
  const trail = [
    { href: "/", label: "Home" },
    { href: routes.pricingGuide, label: "Pricing guide" },
  ];

  /* Facts this market and this dealership actually publish, attached to the
     line they belong to. */
  const local: Record<string, string | undefined> = {
    delivery: deliveryIncluded
      ? `Delivery is included with a home from ${site.short}. Ask how far that reaches for your site.`
      : undefined,
    foundation: market.frostDepthInches
      ? `Around ${site.address.city}, footings go below an ${market.frostDepthInches}-inch frost line.`
      : undefined,
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(trail)} />

      <PageHero
        photoKey="page/financing"
        index="01"
        eyebrow={`Pricing guide · ${site.stateName}`}
        title={
          <>
            What a manufactured home
            <br />
            really costs in {site.stateName}.
          </>
        }
        lede="The price of the home is the number everybody asks about and the one that tells you least. Here is every line between a floor plan and moving in — what each pays for, what moves it, and who puts a number on it."
        kind="exterior"
        breadcrumb={trail}
      >
        <nav aria-label="On this page" className="mt-9 flex flex-wrap gap-2">
          {costLines.map((c) => (
            <a
              key={c.id}
              href={`#${c.id}`}
              className="rounded-full border border-white/35 px-3.5 py-1.5 text-[0.8rem] text-white/85 transition-colors hover:bg-white hover:text-ink"
            >
              {c.title}
            </a>
          ))}
        </nav>
      </PageHero>

      {/* ── The home's own price ── */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <Reveal>
            <SectionHeading
              index="02"
              eyebrow="Start with the whole number"
              title={`The home is one line of ${spellCount(costLines.length)}.`}
            />
          </Reveal>
          <Reveal delay={80}>
            <div className="space-y-5 text-lg leading-relaxed text-muted">
              <p>
                Two buyers can choose the same floor plan and end up a long way apart, because
                one owns level ground with city water at the road and the other is buying
                acreage that needs a well, a septic system and a quarter-mile of power line.
                The home did not change. Everything around it did.
              </p>
              {ranges.length > 0 ? (
                <ul className="space-y-2 text-base">
                  {ranges.map((r) => (
                    <li key={r.id}>
                      <Link
                        href={sizeCategoryHref(r.id)}
                        className="text-ink underline underline-offset-4"
                      >
                        {r.label}s
                      </Link>{" "}
                      in our catalogue: {money(r.low)}
                      {r.high !== r.low ? ` to ${money(r.high)}` : ""}, before options.
                    </li>
                  ))}
                </ul>
              ) : (
                <p>
                  We quote every home against the options you choose and the site it is going
                  to, rather than print a sticker that turns out to be wrong. Call{" "}
                  <a href={site.phoneHref} className="text-ink underline underline-offset-4">
                    {site.phone}
                  </a>{" "}
                  and we will price a plan while you are on the phone.
                </p>
              )}
              <p>
                So ask any dealer — us included — for the whole number in writing, early, and
                for each of the lines below to be on it.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ── Line by line ── */}
      <section className="border-t border-line bg-surface">
        <Container className="py-20 sm:py-24">
          <Reveal>
            <SectionHeading
              index="03"
              eyebrow="Line by line"
              title="Every cost, what moves it, and who quotes it."
            />
          </Reveal>
          <ol className="mt-14 space-y-6">
            {costLines.map((c, i) => (
              <Reveal
                as="li"
                key={c.id}
                delay={(i % 3) * 60}
                className="scroll-mt-[calc(var(--chrome-h)+1.5rem)] rounded-card border border-line bg-paper p-7 sm:p-9"
              >
                <div id={c.id} className="grid gap-6 lg:grid-cols-[minmax(0,16rem)_1fr_minmax(0,16rem)] lg:gap-10">
                  <div>
                    <span className="font-mono text-xs text-ember">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-3 font-display text-2xl tracking-tight text-ink">{c.title}</h3>
                    <p className="mt-3 leading-relaxed text-muted">{c.covers}</p>
                  </div>
                  <div>
                    <p className="eyebrow">What moves it</p>
                    <ul className="mt-4 space-y-2.5">
                      {c.moves.map((m) => (
                        <li key={m} className="flex gap-3 text-[0.95rem] leading-relaxed text-ink-soft">
                          <span aria-hidden className="font-mono text-ember">
                            ·
                          </span>
                          {m}
                        </li>
                      ))}
                    </ul>
                    {local[c.id] && (
                      <p className="mt-4 text-[0.95rem] leading-relaxed text-ink">{local[c.id]}</p>
                    )}
                  </div>
                  <div className="lg:border-l lg:border-line lg:pl-8">
                    <p className="eyebrow">Who quotes it</p>
                    <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-soft">{c.quotedBy}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* ── Worked examples — only real ones, see `lib/pricing-guide.ts` ── */}
      {exampleTotals.length > 0 && (
        <Section>
          <Reveal>
            <SectionHeading
              index="04"
              eyebrow="Worked examples"
              title="What it came to, on real homes."
            />
          </Reveal>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {exampleTotals.map((ex) => {
              const total = ex.lines.reduce((sum, l) => sum + l.amount, 0);
              return (
                <Reveal key={ex.label}>
                  <div className="h-full rounded-card border border-line bg-surface p-7">
                    <h3 className="font-display text-2xl tracking-tight text-ink">{ex.label}</h3>
                    <dl className="mt-6">
                      {ex.lines.map((l) => (
                        <div
                          key={l.item}
                          className="flex items-baseline justify-between gap-4 border-b border-line py-2.5"
                        >
                          <dt className="text-sm text-muted">{l.item}</dt>
                          <dd className="font-mono text-sm text-ink">{money(l.amount)}</dd>
                        </div>
                      ))}
                      <div className="flex items-baseline justify-between gap-4 pt-4">
                        <dt className="font-medium text-ink">Total</dt>
                        <dd className="font-mono text-base text-ink">{money(total)}</dd>
                      </div>
                    </dl>
                    <p className="mt-5 text-sm leading-relaxed text-muted">{ex.note}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Section>
      )}

      {/* ── Get yours ── */}
      <Section className={exampleTotals.length > 0 ? "border-t border-line" : undefined}>
        <Reveal>
          <div className="flex flex-col items-start gap-6 rounded-card border border-line bg-surface p-8 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-display text-3xl tracking-tight text-ink">
                Want your number instead of the general one?
              </h2>
              <p className="mt-3 max-w-2xl leading-relaxed text-muted">
                Tell us the plan you like and where it is going — or that you are still looking
                for land — and we will put the home, delivery, setup and site work against it.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <ButtonLink href={contactHref} className="!px-6 !py-3.5">
                Ask for a quote
                <Icon.Arrow className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </ButtonLink>
              {pages.financing && (
                <ButtonLink href={`${routes.financing}#calculator`} variant="outline" className="!px-6 !py-3.5">
                  Estimate a payment
                </ButtonLink>
              )}
            </div>
          </div>
        </Reveal>
      </Section>

      <NextSteps exclude={["pricing"]} />
    </>
  );
}
