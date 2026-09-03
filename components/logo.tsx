import Image from "next/image";
import { site } from "@/lib/site";
import logo from "@/public/logo.png";
import { cx } from "./ui";

/**
 * Maxey's own mark — a ranch home under an Oklahoma sunset inside a dome,
 * "MAXEY" in navy over "HOMES AND LAND, LLC" in green, with the telephone
 * number on a green pill beneath — the artwork the business already uses on
 * maxeycustomhomes.com, taken from that site rather than redrawn.
 *
 * It is a square lockup on a white ground, so it is sized by height like any
 * other mark here; the header gives it the same 3.5rem it gave the last one.
 * The white ground is part of the artwork rather than transparency, which the
 * light theme does not notice and the dark theme handles the same way it
 * always did — the plate the wordmark needs is already there.
 *
 * The phone number is inside the image, so it is not selectable and not a
 * `tel:` link. That is fine: the number is a real link three times over in
 * the chrome around it (the call bar, the header button, the floating
 * button), all of them reading `site.phone`. Reset the number in
 * `lib/site.ts` and remember this file holds a fourth copy of it in pixels.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cx(
        "inline-flex items-center dark:rounded-lg dark:bg-white dark:px-2 dark:py-1",
        className,
      )}
    >
      <Image
        src={logo}
        alt={`${site.name} — ${site.legalName}`}
        priority
        sizes="260px"
        className="h-14 w-auto sm:h-16"
      />
    </span>
  );
}
