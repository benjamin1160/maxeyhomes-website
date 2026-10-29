import type { Metadata } from "next";
import { SizePage } from "@/components/size-page";
import { sizePages } from "@/lib/size-pages";
import { pageMetadata } from "@/lib/seo";

const page = sizePages.single!;

export const metadata: Metadata = pageMetadata({
  title: page.title,
  description: page.description,
  path: page.path,
});

/** Single wide homes. The page is `components/size-page.tsx`; its copy is `lib/size-pages.ts`. */
export default function SingleWidesPage() {
  return <SizePage size="single" />;
}
