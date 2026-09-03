/**
 * Import the live inventory from maxeycustomhomes.com into the catalogue.
 *
 * Maxey's own site is a Mobile Home Manager deployment. Its landing page
 * server-renders "0 homes available" and a spinner, then fetches the real
 * inventory client-side from
 *
 *     https://www.maxeycustomhomes.com/api/listings?includeSold=1
 *
 * which is a public, unauthenticated JSON endpoint returning the whole
 * catalogue. That feed is the source of truth here, and this script turns it
 * into `lib/catalogue.generated.ts` + `lib/photos.generated.ts` the same way
 * `import-manufacturers.mjs` does for a manufacturer's site.
 *
 *     node scripts/import-maxey-listings.mjs          # write the files
 *     node scripts/import-maxey-listings.mjs --dry    # report, write nothing
 *
 * WHAT THE FEED IS, AND WHAT IT IS NOT
 *
 * The specs are the dealership's own and are carried over as given: name,
 * beds, baths, square footage, home type, status, price, virtual tour. Where
 * the feed has no value the field is omitted rather than defaulted — 94 of
 * the 98 homes carry no price, and the site says "call for pricing" for those
 * rather than printing a zero.
 *
 * The IMAGES are a different matter and are the reason this file is long.
 * They are an aggregated grab-bag pointing at nine different hosts — Clayton,
 * Champion's Scene7, Marathon, a manufacturer CDN, Cloudinary, even YouTube
 * thumbnails — and they are a mix of three things:
 *
 *   FLOOR PLANS. Drawings, not photographs. This template is strict that a
 *   drawing never fills a photograph's slot, so these go to `planImage`,
 *   where `components/artwork/scene.tsx` renders them contained, on white and
 *   captioned "Floor plan".
 *
 *   PHOTOGRAPHS of the model. These become the home's `exterior` scene.
 *
 *   JUNK that got swept into the feed and is not about the home at all:
 *   Champion's own website chrome (a "Terms" image, a "Blog" image, "Find a
 *   dealer"), "coming soon" placeholders, stock photography. Publishing these
 *   as pictures of a home for sale would be worse than publishing nothing, so
 *   they are dropped.
 *
 * A home with no photograph is NOT a gap to fill. It falls back to its floor
 * plan, labelled as a drawing — which is what most of this catalogue is, and
 * is the difference between a browsable catalogue and ninety grey rectangles.
 *
 * Images are downloaded into `public/photos/` rather than hot-linked. Nine
 * third-party hosts is nine ways for the site to break, and `next.config.ts`
 * would need every one of them in `remotePatterns`.
 *
 * They are also RE-ENCODED on the way in, which is not optional. The feed
 * points at originals as they were uploaded, and some of the floor plans are
 * 8MB apiece — 168MB of images for 98 homes before this step, which is not a
 * thing to put in a repository or push through a build. Each one is resized
 * to fit `MAX_EDGE` and written as WebP, which brings the set down by well
 * over an order of magnitude with no visible loss at the sizes the site
 * actually renders them.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

/** Longest edge, in pixels. The widest any of these renders is the lightbox. */
const MAX_EDGE = 1600;

const FEED = "https://www.maxeycustomhomes.com/api/listings?includeSold=1";
const ROOT = new URL("..", import.meta.url).pathname;
const DRY = process.argv.includes("--dry");

/* ------------------------------------------------------------------ *
 * Image classification
 * ------------------------------------------------------------------ */

/** Not about the home. Champion's site furniture, placeholders, stock. */
const JUNK = [
  /coming-soon/i,
  /img\.youtube\.com/i,
  /\/is\/content\//i, // Scene7 "content" is page furniture, not model imagery
  /championhomes\/(Terms|Blog|Find%20a|FInd%20a|MH%20Communit|home%20financ)/i,
  /AdobeStock/i,
  /MuddImage/i,
  /print-park/i,
  /championhomes\/Genesis%20510/i,
  /_jcr_content/i,
];

/** A drawing of the layout, not a picture of the house. */
const FLOORPLAN = [
  /\/images\/mfg\/flp\//i, // Clayton
  /\/floorplan/i,
  /floorplans?[-_.]/i,
  /\/Floorpl/i,
  /\/\d{5}[A-Z][-.]/, // Marathon model-code plans, e.g. 32764A.jpg
  /\/\d{5}[A-Z]\.jpg/i,
];

const classify = (url) => {
  if (JUNK.some((re) => re.test(url))) return "junk";
  if (FLOORPLAN.some((re) => re.test(url))) return "plan";
  return "photo";
};

/* ------------------------------------------------------------------ *
 * Field mapping
 * ------------------------------------------------------------------ */

/**
 * Their status vocabulary → ours.
 *
 * "Lot Model" is the one that carries a promise: it means the home is
 * standing on Melba Ln and can be walked through today, which is exactly
 * `onLot`. Everything else is a home they sell, not a home you can visit.
 */
const STATUS = {
  Available: { status: "available" },
  "By Order": { status: "to-order" },
  Arriving: { status: "coming-soon" },
  "Lot Model": { status: "available", onLot: true },
  "On Sale": { status: "available" },
};

/**
 * Their home type → our width bucket and size category.
 *
 * Carried over rather than re-derived. `sizeCategoryOf` infers the bucket
 * from section count and square footage, which is right for hand-authored
 * entries but wrong for two homes here: a 737 sq ft Single Wide and one with
 * no square footage at all would both be filed as tiny homes by the footprint
 * rule. The dealership's own classification wins.
 */
const TYPE = {
  "Tiny Home": { sections: "single", sizeCategory: "tiny" },
  "Single Wide": { sections: "single", sizeCategory: "single" },
  "Double Wide": { sections: "double", sizeCategory: "double" },
  "Triple Wide": { sections: "triple", sizeCategory: "triple" },
};

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);

/**
 * Split "Origin Series / MAPLE" into its line and its model.
 *
 * Three shapes in the feed. A `Series / MODEL` title splits on the slash. A
 * title starting "Prime " is the Prime line written without the slash, and is
 * folded in rather than left as ten one-off series. Everything else — the
 * thirty-seven homes named after Oklahoma towns — gets NO series: the feed
 * does not name that line, and naming it here would be inventing one.
 */
function splitTitle(title) {
  const t = title.trim();
  if (t.includes(" / ")) {
    const [series, ...rest] = t.split(" / ");
    return { series: series.trim(), model: rest.join(" / ").trim() };
  }
  if (/^Prime\s/i.test(t)) {
    return { series: "Prime Series", model: t.replace(/^Prime\s+/i, "").trim() };
  }
  return { series: undefined, model: t };
}

/* ------------------------------------------------------------------ *
 * Run
 * ------------------------------------------------------------------ */

const res = await fetch(FEED);
if (!res.ok) throw new Error(`feed ${res.status}`);
const feed = await res.json();
console.log(`feed: ${feed.length} homes`);

const seen = new Map();
const entries = [];
const lot = [];
const photoKeys = {};
const downloads = [];
const stats = { photo: 0, plan: 0, junk: 0, withPhoto: 0, withPlan: 0, withNeither: 0 };

for (const row of feed) {
  const { series, model } = splitTitle(row.title);
  const type = TYPE[row.homeType];
  if (!type) {
    console.warn(`  ! unknown homeType ${JSON.stringify(row.homeType)} on ${row.title}`);
    continue;
  }

  /* Slugs have to be stable and unique: the feed carries near-duplicate
     titles (a "Prime Series / 3276H42P03" and a "Prime 3276H42P03" that are
     different homes with different footprints), so a collision gets a
     numeric suffix rather than silently overwriting. */
  let slug = slugify(row.title);
  if (seen.has(slug)) {
    const n = seen.get(slug) + 1;
    seen.set(slug, n);
    slug = `${slug}-${n}`;
  } else {
    seen.set(slug, 1);
  }

  const pics = row.pictures ?? [];
  const plans = [];
  const photos = [];
  for (const p of pics) {
    const k = classify(p.url);
    stats[k]++;
    if (k === "plan") plans.push(p.url);
    if (k === "photo") photos.push(p.url);
  }
  /* The feed's own `image` is the card picture their site leads with, so it
     goes to the front of whichever list it belongs in. */
  if (row.image) {
    const k = classify(row.image);
    if (k === "plan" && !plans.includes(row.image)) plans.unshift(row.image);
    if (k === "photo" && !photos.includes(row.image)) photos.unshift(row.image);
  }

  const entry = {
    slug,
    name: row.title,
    construction: "manufactured", // propertyType is "Manufactured Home" for all 98
    ...(series ? { series } : {}),
    ...(model ? { model } : {}),
    beds: row.beds ?? 0,
    baths: row.baths ?? 0,
    sqft: row.sqft ?? 0,
    sections: type.sections,
    sizeCategory: type.sizeCategory,
    /* A price of 0 in the feed means "not published", not "free". */
    ...(row.price ? { price: row.price } : {}),
    ...(row.salePrice && row.price && row.salePrice < row.price
      ? { wasPrice: row.price, price: row.salePrice }
      : {}),
    ...(row.yearBuilt ? { year: row.yearBuilt } : {}),
    ...(row.matterportUrl ? { tourUrl: row.matterportUrl } : {}),
    ...(row.description ? { tagline: row.description } : {}),
    scenes: [],
    sourceUrl: FEED,
  };

  if (plans.length) {
    const dest = `/photos/plans/${slug}.webp`;
    entry.planImage = dest;
    downloads.push([plans[0], dest]);
    stats.withPlan++;
  }

  if (photos.length) {
    /* One scene, and it is the only one this feed can honestly support. The
       pictures are an unlabelled array — nothing says which is the kitchen —
       so inventing `kitchen` / `bedroom` / `bath` captions to fill the
       gallery would be writing captions that are wrong about a third of the
       time. One exterior is true. */
    entry.scenes.push({ kind: "exterior", caption: `${row.title} — exterior` });
    const dest = `/photos/homes/${slug}-exterior.webp`;
    photoKeys[`${slug}/exterior`] = dest;
    downloads.push([photos[0], dest]);
    stats.withPhoto++;
  } else if (!plans.length) {
    stats.withNeither++;
  }

  const state = STATUS[row.status];
  if (!state) console.warn(`  ! unknown status ${JSON.stringify(row.status)} on ${row.title}`);
  const featured = row.isPromoted || state?.onLot;
  if (state && (state.status !== "to-order" || featured)) {
    lot.push([slug, { ...state, ...(featured ? { featured: true } : {}) }, row.status]);
  }

  entries.push(entry);
}

console.log(
  `pictures: ${stats.photo} photos, ${stats.plan} plans, ${stats.junk} junk dropped\n` +
    `homes: ${stats.withPhoto} with a photograph, ${stats.withPlan} with a plan, ` +
    `${stats.withNeither} with neither\n` +
    `lotState: ${lot.length} entries`,
);

if (DRY) {
  for (const [slug, state, raw] of lot) console.log(`  ${raw.padEnd(10)} ${slug}`, state);
  process.exit(0);
}

/* ---- download ---------------------------------------------------- */

await mkdir(path.join(ROOT, "public/photos/homes"), { recursive: true });
await mkdir(path.join(ROOT, "public/photos/plans"), { recursive: true });

let ok = 0;
let failed = 0;
let bytesIn = 0;
let bytesOut = 0;
const dropped = new Set();
for (const [url, dest] of downloads) {
  const file = path.join(ROOT, "public", dest);
  if (existsSync(file)) {
    ok++;
    continue;
  }
  try {
    const r = await fetch(url, { headers: { "user-agent": "Mozilla/5.0" } });
    if (!r.ok) throw new Error(String(r.status));
    const buf = Buffer.from(await r.arrayBuffer());
    if (buf.length < 1024) throw new Error(`${buf.length} bytes`);
    /* `limitInputPixels: false` because one of Marathon's floor plans is a
       single image past sharp's 268MP default guard. The guard is there to
       stop a decompression bomb from a hostile source; this is a known feed
       and the output is bounded by the resize below either way. */
    const out = await sharp(buf, { limitInputPixels: false })
      .rotate()
      .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();
    await writeFile(file, out);
    bytesIn += buf.length;
    bytesOut += out.length;
    ok++;
  } catch (e) {
    failed++;
    dropped.add(dest);
    console.warn(`  ! ${dest}: ${e.message}`);
  }
}
const mb = (n) => `${(n / 1024 / 1024).toFixed(1)}MB`;
console.log(
  `images: ${ok} downloaded, ${failed} failed` +
    (bytesIn ? ` — ${mb(bytesIn)} of originals re-encoded to ${mb(bytesOut)}` : ""),
);

/* An image that would not download is not registered. The site shows the
   floor plan or the "photograph to come" plate instead, which is the correct
   outcome — a manifest entry with no file behind it fails `npm run lint`. */
for (const [key, dest] of Object.entries(photoKeys)) {
  if (dropped.has(dest)) delete photoKeys[key];
}
for (const e of entries) {
  if (e.planImage && dropped.has(e.planImage)) delete e.planImage;
  if (e.scenes.length && !photoKeys[`${e.slug}/exterior`]) e.scenes = [];
}

/* ---- write ------------------------------------------------------- */

const ts = (v) => JSON.stringify(v);
const body = entries
  .map((e) => {
    const lines = Object.entries(e)
      /* `scenes` is required on a CatalogueEntry and stays even when empty —
         a home with no photograph has an empty scene list, not a missing
         one. Every other empty array is dropped. */
      .filter(([k, v]) => v !== undefined && (k === "scenes" || !(Array.isArray(v) && v.length === 0)))
      .map(([k, v]) => `    ${k}: ${ts(v)},`);
    return `  {\n${lines.join("\n")}\n  },`;
  })
  .join("\n");

const counts = entries.reduce((a, e) => {
  a[e.sizeCategory] = (a[e.sizeCategory] ?? 0) + 1;
  return a;
}, {});

await writeFile(
  path.join(ROOT, "lib/catalogue.generated.ts"),
  `/**
 * THE IMPORTED CATALOGUE — GENERATED FILE, DO NOT EDIT BY HAND.
 *
 * Written by \`node scripts/import-maxey-listings.mjs\` from Maxey's own live
 * inventory feed, which its site fetches client-side:
 *
 *     ${FEED}
 *
 * ${entries.length} homes: ${Object.entries(counts)
    .map(([k, v]) => `${v} ${k}`)
    .join(", ")}.
 *
 * Anything a human decides — what is standing on the lot, what is featured,
 * what is sold — is NOT in here. That lives in \`lotState\` in
 * \`lib/homes.ts\`, which is applied over this file, so re-running the import
 * never overwrites it.
 *
 * ${entries.filter((e) => e.price).length} of them carry a price. The rest are
 * quoted on options, site work and delivery distance, so the site says "call
 * for pricing" rather than printing a zero.
 *
 * \`planImage\` is a floor-plan DRAWING and is labelled as one wherever it
 * renders. A home with no photograph falls back to it rather than to a grey
 * rectangle, and never shows it as though it were a photograph. See the head
 * of the import script for how the feed's images were sorted.
 */
import type { CatalogueEntry } from "./homes";

export const catalogue: CatalogueEntry[] = [
${body}
];
`,
);

await writeFile(
  path.join(ROOT, "lib/photos.generated.ts"),
  `/**
 * PHOTOGRAPHS OF IMPORTED HOMES — GENERATED FILE, DO NOT EDIT BY HAND.
 *
 * Written by \`node scripts/import-maxey-listings.mjs\` from what is really in
 * \`public/photos/homes/\`, so a key here always has a file behind it. Page
 * heroes and one-off images are hand-written in \`lib/photos.ts\`.
 *
 * ${Object.keys(photoKeys).length} photographs, one per home that has one.
 * They are the manufacturers' own model photography carried in Maxey's feed —
 * pictures of that model, not of the particular house standing on Melba Ln.
 * Photograph the lot and drop the files in over these.
 *
 * The other ${entries.length - Object.keys(photoKeys).length} homes have no
 * photograph and show their floor plan instead, captioned as a drawing.
 */

export const importedPhotos: Record<string, string> = {
${Object.entries(photoKeys)
  .map(([k, v]) => `  ${ts(k)}: ${ts(v)},`)
  .join("\n")}
};
`,
);

console.log(`wrote ${entries.length} plans and ${Object.keys(photoKeys).length} photographs`);
console.log(`\nlotState entries for lib/homes.ts:\n`);
for (const [slug, state] of lot) {
  console.log(`  ${ts(slug)}: ${JSON.stringify(state).replace(/"(\w+)":/g, "$1: ")},`);
}
