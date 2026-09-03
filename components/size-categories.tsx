import Link from "next/link";
import { cx } from "./ui";
import {
  sizeCategoryFacets,
  type Listing,
  type SizeCategory,
} from "@/lib/homes";

/**
 * The buckets a buyer shops by — tiny, single, double, triple, mods — as a row
 * of big obvious buttons. This is the primary way into the catalogue on both
 * the landing page and `/listings`.
 *
 * Which buttons exist is decided by `sizeCategoryEnabled` in `lib/homes.ts`,
 * not by the counts — a lot that does not sell triple-wides turns that bucket
 * off and shows three buttons rather than four, and a lot that does sell them
 * but has none in stock this week still shows the button. The two are
 * different statements and the counts cannot tell them apart.
 *
 * The footprint and count under each label are measured from the homes
 * actually in that bucket, so they cannot disagree with the catalogue. A
 * bucket with nothing in it has neither, and shows just the glyph and the
 * label — which is what the caption would otherwise degrade into, and it is
 * also exactly how maxeycustomhomes.com draws the same row.
 *
 * Two modes. Given `active`/`onSelect` it behaves as a filter control; given
 * neither it renders links to `/listings?size=<id>`, which is what the
 * landing page wants.
 */
export function SizeCategories({
  from,
  active,
  onSelect,
  className,
}: {
  /** Measure the counts against this catalogue. Defaults to all listings. */
  from?: Listing[];
  active?: SizeCategory | null;
  onSelect?: (id: SizeCategory | null) => void;
  className?: string;
}) {
  const facets = sizeCategoryFacets(from);
  /* One lone button is a filter with nothing to filter against, and no
     buttons is not a row. Either way there is nothing worth drawing. */
  if (facets.length < 2) return null;

  const shell =
    "relative flex flex-col items-center justify-center rounded-xl border p-4 text-center transition-all duration-300 hover:scale-[1.02] md:p-5";
  const on = "border-ember bg-ember-wash";
  const off = "border-line bg-paper hover:border-ember";

  return (
    <div
      className={cx(
        "grid grid-cols-2 gap-3 md:gap-4",
        facets.length >= 5
          ? "md:grid-cols-5"
          : facets.length >= 4
            ? "md:grid-cols-4"
            : "md:grid-cols-3",
        className,
      )}
    >
      {facets.map((facet) => {
        const selected = active === facet.id;
        const body = (
          <>
            <span className="mb-2 text-2xl leading-none" aria-hidden>
              {facet.glyph}
            </span>
            <span
              className={cx(
                "text-sm font-semibold md:text-base",
                selected ? "text-ember" : "text-ink",
              )}
            >
              {facet.label}
            </span>
            {/* Only once there is something to measure. At zero this would
                read " · 0 homes" against a missing range, which is worse than
                the label standing on its own. */}
            {facet.count > 0 && (
              <span className="mt-0.5 text-xs text-muted">
                {facet.range} · {facet.count} home{facet.count === 1 ? "" : "s"}
              </span>
            )}
          </>
        );

        return onSelect ? (
          <button
            key={facet.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onSelect(selected ? null : facet.id)}
            className={cx(shell, selected ? on : off)}
          >
            {body}
          </button>
        ) : (
          <Link
            key={facet.id}
            href={`/listings?size=${facet.id}`}
            className={cx(shell, off)}
          >
            {body}
          </Link>
        );
      })}
    </div>
  );
}
