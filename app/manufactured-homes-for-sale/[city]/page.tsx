import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { breadcrumbJsonLd, JsonLd } from "@/components/json-ld";
import { ListingCard } from "@/components/listing-card";
import { NextSteps } from "@/components/next-steps";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { SizeCategories } from "@/components/size-categories";
import { ButtonLink, Container, Icon, Section, SectionHeading } from "@/components/ui";
import { featuredListings } from "@/lib/homes";
import { getLocation, locations } from "@/lib/locations";
import { pages } from "@/lib/page-config";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

/* Only the cities written in `lib/locations.ts`. Anything else is a 404, not
   a page generated on the fly with the name swapped in. */
export const dynamicParams = false;

export function generateStaticParams() {
  return locations.map((l) => ({ city: l.slug }));
}

export async function generateMetadata(
  props: PageProps<"/manufactured-homes-for-sale/[city]">,
): Promise<Metadata> {
  const { city } = await props.params;
  const place = getLocation(city);
  if (!place) return {};
  return pageMetadata({
    title: place.title,
    description: place.description,
    path: `${routes.locations}/${place.slug}`,
  });
}

/**
 * One city page. The words are `lib/locations.ts`, written for that city;
 * the homes are the ones standing on the lot, which is where somebody from
 * any of these cities would come to see one.
 */
export default async function CityPage(props: PageProps<"/manufactured-homes-for-sale/[city]">) {
  if (!pages.locations) redirect("/");
  const { city } = await props.params;
  const place = getLocation(city);
  if (!place) notFound();

  const homes = featuredListings().slice(0, 6);
  const others = locations.filter((l) => l.slug !== place.slug);
  const trail = [
    { href: "/", label: "Home" },
    { href: "/listings", label: "Homes" },
    { href: `${routes.locations}/${place.slug}`, label: place.city },
  ];
  const isHome = place.city === site.address.city;

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(trail)} />

      <PageHero
        photoKey="page/homes"
        index="01"
        eyebrow={
          isHome
            ? `${place.city}, ${place.region} · ${place.county} · our home town`
            : `${place.city}, ${place.region} · ${place.county} · about ${place.miles} miles from our lot`
        }
        title={place.h1}
        lede={place.lede}
        kind="exterior"
        breadcrumb={trail}
      >
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="#homes" className="!px-6 !py-3.5">
            See homes on our lot
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

      {/* ── The place ── */}
      <Section>
        <div className="grid gap-x-16 gap-y-14 lg:grid-cols-2">
          {place.sections.map((sec, i) => (
            <Reveal key={sec.title} delay={(i % 2) * 80}>
              <h2 className="font-display text-title tracking-tight text-ink">{sec.title}</h2>
              <div className="mt-5 space-y-4">
                {sec.body.map((p) => (
                  <p key={p} className="leading-relaxed text-muted">
                    {p}
                  </p>
                ))}
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14">
          <div className="rounded-card border border-line bg-surface p-7 sm:p-9">
            <p className="eyebrow">Come and see them</p>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-ink-soft">
              Our lot is at {site.address.street}, {site.address.city}, {site.address.region}{" "}
              {site.address.postalCode}
              {isHome ? "" : ` — about ${place.miles} miles from ${place.city}`}. Open{" "}
              {site.hours.charAt(0).toLowerCase() + site.hours.slice(1)}.
            </p>
          </div>
        </Reveal>
      </Section>

      {/* ── Homes ── */}
      <section id="homes" className="scroll-mt-[calc(var(--chrome-h)+1.5rem)] border-t border-line bg-surface">
        <Container className="py-20 sm:py-24">
          <Reveal>
            <SectionHeading
              index="02"
              eyebrow="On our lot now"
              title="Homes you can walk through this week."
              lede={`Every plan in the catalogue is one we can order in. These are the ones standing on the lot in ${site.address.city} today.`}
              action={
                <ButtonLink href="/listings" variant="outline">
                  Every floor plan
                  <Icon.Arrow className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                </ButtonLink>
              }
            />
          </Reveal>
          {homes.length > 0 && (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {homes.map((l, i) => (
                <Reveal key={l.slug} delay={(i % 3) * 80}>
                  <ListingCard listing={l} className="h-full" />
                </Reveal>
              ))}
            </div>
          )}
          <Reveal className="mt-12">
            <p className="eyebrow mb-5">Or browse by size</p>
            <SizeCategories />
          </Reveal>
        </Container>
      </section>

      {others.length > 0 && (
        <Container className="pt-14">
          <nav aria-label="Other areas" className="flex flex-wrap items-center gap-2.5">
            <span className="mr-1 text-sm text-muted">Nearby:</span>
            {others.map((l) => (
              <Link
                key={l.slug}
                href={`${routes.locations}/${l.slug}`}
                className="rounded-full border border-line-strong px-4 py-1.5 text-[0.85rem] text-ink-soft transition-colors hover:border-ember hover:text-ember"
              >
                {l.city}
              </Link>
            ))}
            {pages.landDeals && (
              <Link
                href="/land-deals"
                className="rounded-full border border-line-strong px-4 py-1.5 text-[0.85rem] text-ink-soft transition-colors hover:border-ember hover:text-ember"
              >
                The full map
              </Link>
            )}
          </nav>
        </Container>
      )}

      <NextSteps index="03" className="mt-14" />
    </>
  );
}
