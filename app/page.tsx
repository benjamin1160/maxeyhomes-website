import type { Metadata } from "next";
import { Landing } from "@/components/landing";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

/* Product and place first, name last — see `lib/seo.ts`. */
export const metadata: Metadata = pageMetadata({
  title: `Manufactured Homes for Sale in ${site.address.city}, ${site.address.region}`,
  description: `Manufactured homes for sale in ${site.address.city}, ${site.stateName} — single wides, double wides and tiny homes, with homes open to walk through at ${site.address.street} and financing, delivery and setup handled for you. Call ${site.phone}.`,
  path: "/",
});

/**
 * The home page is the landing composition and nothing else. Which bands it
 * shows, and in what order, is `lib/page-config.ts` and
 * `components/landing.tsx` — the same pair every custom page under
 * `/p/<slug>` renders through.
 */
export default function HomePage() {
  return <Landing />;
}
