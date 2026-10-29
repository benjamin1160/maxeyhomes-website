import type { Metadata } from "next";
import { site } from "./site";

/**
 * Metadata for a page written to be found.
 *
 * The title is absolute — product and place first, the business name last —
 * because a search result cuts it at about sixty characters and the layout's
 * "· Maxey" template would otherwise stack a second name on the end. The
 * Open Graph block is restated whole because Next replaces a parent's
 * `openGraph` rather than merging into it, and a page that sets only a title
 * there loses the site name and type it inherited.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  /** Without the business name; it is appended here. */
  title: string;
  description: string;
  path: string;
}): Metadata {
  const full = `${title} | ${site.name}`;
  return {
    title: { absolute: full },
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: "en_US",
      title: full,
      description,
      url: path,
    },
  };
}
