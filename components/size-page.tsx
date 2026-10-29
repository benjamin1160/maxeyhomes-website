import { redirect } from "next/navigation";
import Link from "next/link";
import { Accordion } from "./accordion";
import { breadcrumbJsonLd, JsonLd } from "./json-ld";
import { ListingCard } from "./listing-card";
import { NextSteps } from "./next-steps";
import { PageHero } from "./page-hero";
import { Reveal } from "./reveal";
import { ButtonLink, Container, Icon, Section, SectionHeading, Stat } from "./ui";
import {
  builderRank,
  homeTitle,
  inSizeCategory,
  listings,
  sizeCategoryFacets,
  sizeCategoryLabels,
  type Listing,
  type SizeCategory,
} from "@/lib/homes";
import { contactHref } from "@/lib/navigation";
import { pages } from "@/lib/page-config";
import { sizePages } from "@/lib/size-pages";
import { site } from "@/lib/site";

/* Standing on the lot first — the homes you can walk this week — then the
   ones on their way, then the rest in the catalogue's own builder order. */
const shelf = (l: Listing) =>
  l.onLot ? 0 : l.status === "coming-soon" ? 1 : l.status === "sold" ? 3 : 2;

export function sizePageHomes(size: SizeCategory): Listing[] {
  return listings
    .filter((l) => inSizeCategory(l, size))
    .sort((a, b) => shelf(a) - shelf(b) || builderRank(a) - builderRank(b));
}

/**
 * A size page: one width of the catalogue, with what a buyer of that width
 * needs to know, and the way on to financing, land and a phone call.
 *
 * Everything countable is counted from the catalogue — the number of homes,
 * the footprint range, the bedroom links — so the page cannot drift from it.
 * The copy is `lib/size-pages.ts`.
 */
export function SizePage({ size }: { size: SizeCategory }) {
  const page = sizePages[size];
  if (!pages.sizePages || !page) redirect("/listings");

  const homes = sizePageHomes(size);
  const facet = sizeCategoryFacets(listings).find((f) => f.id === size);
  const onLot = homes.filter((l) => l.onLot).length;
  const bedCounts = [...new Set(homes.map((l) => l.beds))].sort((a, b) => a - b);
  const label = sizeCategoryLabels[size];
  const plural = `${label}s`;

  const trail = [
    { href: "/", label: "Home" },
    { href: "/listings", label: "Homes" },
    { href: page.path, label: plural },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(trail)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: page.title,
          numberOfItems: homes.length,
          itemListElement: homes.map((l, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${site.url}/listings/${l.slug}`,
            name: homeTitle(l),
          })),
        }}
      />

      <PageHero
        photoKey="page/homes"
        index="01"
        eyebrow={
          homes.length
            ? `${homes.length} ${plural.toLowerCase()} · ${site.address.city}, ${site.address.region}`
            : `${plural} · ${site.address.city}, ${site.address.region}`
        }
        title={page.h1}
        lede={page.lede}
        kind="exterior"
        breadcrumb={trail}
      >
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="#homes" className="!px-6 !py-3.5">
            See the {plural.toLowerCase()}
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

      {/* ── The numbers, then the homes ── */}
      <div id="homes" className="scroll-mt-[calc(var(--chrome-h)+1.5rem)]">
      <Container className="py-14 sm:py-20">
        {homes.length > 0 && (
          <div className="grid grid-cols-2 gap-8 border-b border-line pb-10 md:grid-cols-4">
            <Stat value={homes.length} label="Floor plans" />
            {facet?.range && <Stat value={facet.range.replace(" sq ft", "")} label="Square feet" />}
            <Stat
              value={
                bedCounts.length > 1
                  ? `${bedCounts[0]}–${bedCounts[bedCounts.length - 1]}`
                  : bedCounts[0]
              }
              label="Bedrooms"
            />
            {onLot > 0 && <Stat value={onLot} label="On our lot now" sub="Open to walk through" />}
          </div>
        )}

        {bedCounts.length > 1 && (
          <nav aria-label="By bedrooms" className="mt-8 flex flex-wrap items-center gap-2.5">
            <span className="mr-1 text-sm text-muted">By bedrooms:</span>
            {bedCounts.map((n) => (
              <Link
                key={n}
                href={`/listings?size=${size}&beds=${n}`}
                className="rounded-full border border-line-strong px-4 py-1.5 text-[0.85rem] text-ink-soft transition-colors hover:border-ember hover:text-ember"
              >
                {n}+ bedroom {label.toLowerCase()}s
              </Link>
            ))}
          </nav>
        )}

        {homes.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {homes.map((l) => (
              <ListingCard key={l.slug} listing={l} className="h-full" />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-line-strong px-8 py-20 text-center">
            <p className="font-display text-3xl tracking-tight text-ink">
              None listed online this week.
            </p>
            <p className="mx-auto mt-4 max-w-md text-muted">
              We still sell them. Tell us the bedrooms and where the home is going and we will
              tell you what we can get.
            </p>
            <ButtonLink href={contactHref} className="mt-8">
              Tell us what you&apos;re after
            </ButtonLink>
          </div>
        )}
      </Container>
      </div>

      {/* ── What the width means ── */}
      <Section className="border-t border-line">
        <Reveal>
          <SectionHeading
            index="02"
            eyebrow={`Buying a ${label.toLowerCase()}`}
            title="What the width means for you."
          />
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {page.points.map((p, i) => (
            <Reveal key={p.title} delay={i * 80}>
              <div className="h-full rounded-card border border-line bg-surface p-7">
                <h3 className="font-display text-2xl tracking-tight text-ink">{p.title}</h3>
                <p className="mt-4 leading-relaxed text-muted">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {page.faq.length > 0 && (
          <Reveal className="mt-16">
            <Accordion
              items={page.faq.map((q) => ({
                title: q.question,
                body: (
                  <div className="space-y-4">
                    {q.answer.map((a) => (
                      <p key={a}>{a}</p>
                    ))}
                  </div>
                ),
              }))}
            />
          </Reveal>
        )}
      </Section>

      <NextSteps index="03" />
    </>
  );
}
