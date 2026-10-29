import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { breadcrumbJsonLd, JsonLd } from "@/components/json-ld";
import { ListingCard } from "@/components/listing-card";
import { NextSteps } from "@/components/next-steps";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { SizeCategories } from "@/components/size-categories";
import { Badge, ButtonLink, Container, Icon, Section, SectionHeading } from "@/components/ui";
import { company } from "@/lib/company";
import { featuredListings } from "@/lib/homes";
import { market } from "@/lib/market";
import { pages } from "@/lib/page-config";
import { qwPages } from "@/lib/prequalify";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: `Manufactured Home and Land Packages in ${site.stateName}`,
  description: `Putting a manufactured home on land in ${site.stateName}: what to check on land you own, how to find land if you need it, home-only against land-home financing, and how delivery and setup work — from ${site.name} in ${site.address.city}.`,
  path: routes.homeAndLand,
});

/* Maxey's own words for this, from its About page — see `lib/company.ts`. */
const promise = company.principles?.find((p) => p.title.toLowerCase().includes("land"))?.body;
const deliveryIncluded = company.badges?.some((b) => /delivery included/i.test(b));

type Point = { title: string; body: string; link?: { href: string; label: string } };

const OWN_LAND: Point[] = [
  {
    title: "Send us the address first",
    body: "Before you choose a floor plan, we look at the parcel: the road in and the room to set a home, where water, sewer and power will come from, setbacks, flood zone, and what the ground will take. It decides which homes can go there at all.",
  },
  {
    title: "Your land can help pay for the home",
    body: "On a land-home loan, the equity in a parcel you own can often count toward the down payment. Lenders treat it differently, so ask how yours does before you set money aside for a down payment you may not need.",
  },
  {
    title: "Title the home with the land",
    body:
      market.realPropertyConversion ??
      "Once the home is permanently affixed to land you own, it can be converted from personal property to real property, so it is conveyed and financed with the land.",
  },
];

const NEED_LAND: Point[] = [
  {
    title: "Check the parcel before you buy it",
    body: "Zoning and deed restrictions decide whether a manufactured home can go on a piece of land at all, and a cheap lot with no water line is not a cheap lot. Send us a listing before you make an offer and we will tell you what we see.",
  },
  ...(market.usdaNote
    ? [{ title: "Look at USDA before you rule it out", body: market.usdaNote }]
    : []),
  {
    title: "Or lease a lot instead",
    body: "Without land of your own, a home can go on a leased lot in a community. You buy the home, pay lot rent for the ground, and finance it with a home-only loan. It is the quickest way in, and the one that builds the least equity.",
  },
];

const SETUP = [
  {
    title: "Site work",
    body: `The pad or foundation, built to the plan and to the ground.${
      market.frostDepthInches
        ? ` Around ${site.address.city} footings go below an ${market.frostDepthInches}-inch frost line.`
        : ""
    } Utilities are brought to where the home will sit.`,
  },
  {
    title: "Delivery",
    body: `The home comes from the plant on its own running gear — one load for a single wide, two for a double.${
      deliveryIncluded ? " Delivery is included with the home." : ""
    } What matters on the day is the last few hundred feet: the turn, the drive and the room to set.`,
  },
  {
    title: "The set",
    body: "The home is placed, levelled on its piers and anchored. A double wide's two halves are joined along the marriage line and the roof, ducts and finishes tied together so it lives as one house.",
  },
  {
    title: "Hook-ups and finish",
    body: "Water, sewer or septic, electric and gas are connected and inspected. Then skirting, steps and the final walk-through with you.",
  },
];

const PROCESS = [
  "Call or come to the lot — tell us whether you have land, and roughly where.",
  "Pre-qualify, so you know which loans are open to you before you choose anything.",
  "We check the parcel and put the site work in writing.",
  "Choose the home, the options and the finishes.",
  "The loan closes, the home is ordered and the site is prepared.",
  "Delivery, set, hook-ups and the final walk-through.",
];

export default function HomeAndLandPage() {
  if (!pages.homeAndLand) redirect("/");

  const onLot = featuredListings().slice(0, 3);
  const trail = [
    { href: "/", label: "Home" },
    { href: routes.homeAndLand, label: "Home + land" },
  ];

  const column = (heading: string, badge: string, points: Point[]) => (
    <div className="flex h-full flex-col rounded-card border border-line bg-surface p-7 sm:p-9">
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-display text-3xl tracking-tight text-ink">{heading}</h3>
        <Badge tone="ember">{badge}</Badge>
      </div>
      <ul className="mt-8 space-y-7">
        {points.map((p) => (
          <li key={p.title} className="flex gap-4">
            <Icon.Check className="mt-1 size-5 shrink-0 text-ember" />
            <div>
              <p className="font-medium text-ink">{p.title}</p>
              <p className="mt-1.5 leading-relaxed text-muted">{p.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(trail)} />

      <PageHero
        photoKey="page/start-here"
        index="01"
        eyebrow={`Home + land · ${market.regionName ?? site.stateName}`}
        title={
          <>
            The home and the land,
            <br />
            handled together.
          </>
        }
        lede={
          promise ??
          "The right home, the right land and the right setup — one conversation instead of three."
        }
        kind="exterior"
        breadcrumb={trail}
      >
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="#paths" className="!px-6 !py-3.5">
            Own land, or need it?
            <Icon.Arrow className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </ButtonLink>
          <a
            href={site.phoneHref}
            className="inline-flex items-center justify-center gap-2 rounded-button border border-white/60 px-6 py-3.5 text-[0.9rem] font-medium text-white transition-colors hover:bg-white hover:text-ink"
          >
            <Icon.Phone className="size-4" />
            {site.phone}
          </a>
        </div>
      </PageHero>

      {/* ── Two starting points ── */}
      <Section id="paths" className="scroll-mt-[calc(var(--chrome-h)+1.5rem)]">
        <Reveal>
          <SectionHeading
            index="02"
            eyebrow="Where you are starting from"
            title="Own land, or need land?"
            lede="Everything else — the loan, the home that fits, the setup cost — follows from this one answer, so it is the first thing we ask."
          />
        </Reveal>
        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <Reveal>{column("I own land", "Start here", OWN_LAND)}</Reveal>
          <Reveal delay={90}>{column("I need land", "Start here", NEED_LAND)}</Reveal>
        </div>
        {pages.landDeals && (
          <Reveal className="mt-8">
            <Link
              href="/land-deals"
              className="group flex flex-col gap-2 rounded-card border border-line p-6 transition-colors hover:border-ember sm:flex-row sm:items-center sm:justify-between"
            >
              <span>
                <span className="font-medium text-ink">Looking for land?</span>{" "}
                <span className="text-muted">
                  See the counties around {site.address.city} on the land-and-home map.
                </span>
              </span>
              <span className="flex items-center gap-1.5 text-[0.9rem] font-medium text-ink group-hover:text-ember">
                Open the map
                <Icon.Arrow className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
          </Reveal>
        )}
      </Section>

      {/* ── Financing ── */}
      <section className="border-y border-line bg-surface">
        <Container className="py-20 sm:py-24">
          <Reveal>
            <SectionHeading
              index="03"
              eyebrow="Financing"
              title="One loan for both, or the home on its own."
            />
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              {
                name: "Land-home",
                body: "The land, the site work and the home on one loan, closed once. With the home on a permanent foundation and titled with the land, it is a mortgage — conventional, FHA, VA, or USDA where the parcel qualifies — at mortgage rates and terms.",
              },
              {
                name: "Home-only",
                body: "The home financed on its own, as personal property — on a leased lot, or on land you already own when you would rather keep the land out of the loan. Simpler and quicker to close; rates run higher and terms shorter than a mortgage.",
              },
            ].map((f, i) => (
              <Reveal key={f.name} delay={i * 80}>
                <div className="h-full rounded-card border border-line bg-paper p-7">
                  <h3 className="font-display text-2xl tracking-tight text-ink">{f.name}</h3>
                  <p className="mt-4 leading-relaxed text-muted">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-8 flex flex-col gap-3 sm:flex-row">
            {pages.financing && (
              <ButtonLink href={routes.financing} variant="outline">
                How the loans compare
                <Icon.Arrow className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </ButtonLink>
            )}
            {pages.prequalify && (
              <ButtonLink href={qwPages.noSSN.path}>Pre-qualify — no SSN required</ButtonLink>
            )}
          </Reveal>
        </Container>
      </section>

      {/* ── Delivery and setup ── */}
      <Section>
        <Reveal>
          <SectionHeading
            index="04"
            eyebrow="Delivery and setup"
            title="From the plant to your front door."
            lede="The part people worry about most, and the part with the fewest surprises once the site has been looked at properly."
          />
        </Reveal>
        <ol className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2 xl:grid-cols-4">
          {SETUP.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 70} className="bg-paper p-7">
              <span className="font-mono text-xs text-ember">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-4 font-display text-2xl tracking-tight text-ink">{s.title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{s.body}</p>
            </Reveal>
          ))}
        </ol>
        {pages.pricingGuide && (
          <p className="mt-8 text-muted">
            What each of those costs, and what moves the number, is in the{" "}
            <Link href={routes.pricingGuide} className="text-ink underline underline-offset-4">
              pricing guide
            </Link>
            .
          </p>
        )}
      </Section>

      {/* ── The process ── */}
      <section className="border-t border-line bg-surface">
        <Container className="py-20 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
            <Reveal>
              <SectionHeading
                index="05"
                eyebrow="The process"
                title="Six steps, in this order."
                lede="Taken out of order is how a purchase goes sideways — a home chosen before the land is checked, a lot bought before the loan is known."
              />
            </Reveal>
            <ol className="space-y-px overflow-hidden rounded-2xl border border-line bg-line">
              {PROCESS.map((step, i) => (
                <Reveal as="li" key={step} delay={i * 60} className="flex gap-5 bg-paper p-6">
                  <span className="font-mono text-sm text-ember">{String(i + 1).padStart(2, "0")}</span>
                  <span className="leading-relaxed text-ink-soft">{step}</span>
                </Reveal>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* ── Homes ── */}
      <Section>
        <Reveal>
          <SectionHeading
            index="06"
            eyebrow="The homes"
            title="Start with the ones on our lot."
            action={
              <ButtonLink href="/listings" variant="outline">
                Every floor plan
                <Icon.Arrow className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </ButtonLink>
            }
          />
        </Reveal>
        {onLot.length > 0 && (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {onLot.map((l, i) => (
              <Reveal key={l.slug} delay={i * 80}>
                <ListingCard listing={l} className="h-full" />
              </Reveal>
            ))}
          </div>
        )}
        <Reveal className="mt-12">
          <SizeCategories />
        </Reveal>
      </Section>

      <NextSteps exclude={["homeAndLand"]} index="07" />
    </>
  );
}
