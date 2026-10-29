import { site } from "@/lib/site";

/** One block of schema.org data, inlined where search engines read it. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * The breadcrumb trail as schema.org reads it — the same trail the page
 * draws, so the two cannot disagree. The last crumb is the page itself.
 */
export function breadcrumbJsonLd(trail: { href: string; label: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: b.label,
      item: `${site.url}${b.href === "/" ? "" : b.href}`,
    })),
  };
}
