/**
 * Import Maxey's inventory feed into the catalogue.
 *
 * The feed was maxeycustomhomes.com's own until this site replaced it there;
 * the last copy is `scripts/maxey-feed.snapshot.json`, and that is what this
 * script reads.
 *
 * Maxey's old site was a Mobile Home Manager deployment. Its landing page
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
 *     node scripts/import-maxey-listings.mjs --refresh URL   # re-read a live feed
 *
 * Behind this container's proxy, run it with NODE_USE_ENV_PROXY=1.
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
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

/** Longest edge, in pixels. The widest any of these renders is the lightbox. */
const MAX_EDGE = 1600;

/** owntru.com turns away a bare "Mozilla/5.0" with a 403; a browser's string passes. */
const UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";

const FEED = "https://www.maxeycustomhomes.com/api/listings?includeSold=1";
/** The last copy of FEED, taken from old.bigtrailersavings.com in October 2026. */
const SNAPSHOT = new URL("./maxey-feed.snapshot.json", import.meta.url);
const ROOT = new URL("..", import.meta.url).pathname;
const DRY = process.argv.includes("--dry");

/**
 * Which picture leads each feed home, chosen by looking at every image the
 * feed carries for it — `scripts/maxey-photo-selection.json`, keyed by slug.
 *
 * The feed's own order cannot be trusted for this: its first "photograph" is
 * as often a bathroom, a bedroom, a "3D Tour" button or a floor plan as it is
 * the house, and Champion's CDN files real photographs under a `/floorplan/`
 * path, so the classifier above throws away exteriors it should keep. Every
 * card in the catalogue should lead with the same thing — the outside of the
 * house — so each entry names the image to use:
 *
 *   { kind: "exterior", url }   an exterior of this model
 *   { kind: "living", url }     no exterior exists anywhere in the feed for
 *                               this home; the best interior instead
 *   { drawing: url }            the floor plan to use as `planImage` — a
 *                               drawing the feed misfiled as a photograph, or
 *                               one read from the manufacturer's own listing
 *                               where the feed carries none
 *   null                        reviewed, nothing usable: floor plan only
 *
 * An entry may also carry `caption`, which replaces the room label. Every
 * Prime Series home uses one of three shared exteriors (single, double,
 * tiny), and on all but the model actually photographed the caption says
 * the picture is representative rather than of that plan.
 * `drawing` may sit beside `url`, and always wins over the feed's own plans.
 *
 * A slug that is not in the file (a home new to the feed) falls back to the
 * classifier and the feed's order. Review it and add it.
 */
const SELECTION = JSON.parse(
  await readFile(new URL("./maxey-photo-selection.json", import.meta.url), "utf8"),
);

/**
 * Clayton's TRU homes — the Origin and Mini series — are read from TRU's own
 * model pages at owntru.com rather than from the feed: beds, baths, square
 * footage, the model code, the box size and the floor-plan drawing, and a
 * gallery of five rooms. `scripts/tru-selection.json`, keyed by slug, names
 * each home's TRU page and which of its photographs is the exterior, the
 * living room, the kitchen, a bedroom and a bath — chosen by looking at
 * every image on the page, because TRU's own order opens on a floor plan.
 * An entry may carry `captions`, replacing a room label (the Redwood's
 * gallery has no living room, so its "living" scene is the dining area).
 *
 * A Clayton row that is not in the file keeps the feed's own data.
 */
const TRU = JSON.parse(await readFile(new URL("./tru-selection.json", import.meta.url), "utf8"));

/**
 * Virtual tours the feed has wrong, by slug.
 *
 * Maxey's feed swapped the Aspen's and the Birch's: the Aspen pointed at the
 * Momento360 tour titled "TRT16763BH_Birch" and the Birch at the one titled
 * "TRT16763PH_Aspen". TRU's own site cannot settle it either — it shows the
 * Birch tour on both pages — so the tour's own title is the authority. Check
 * a tour with `curl -s <url> | grep -o '<title>[^<]*'`.
 */
const TOUR_FIX = {
  "origin-series-aspen":
    "https://momento360.com/e/uc/6fe7651ff5c44903887d8a269dbaa94c?utm_campaign=embed&utm_source=other&reset-heading=true&size=large",
  "origin-series-birch":
    "https://momento360.com/e/uc/4c840b26dee64f3c909b1d80511ab038?utm_campaign=embed&utm_source=other&reset-heading=true&size=large",
};

/**
 * The order the catalogue is written in, and so the order /listings shows it
 * by default: Clayton first, Marathon second, Champion's Prime line after.
 */
const BUILDER_ORDER = ["Clayton", "Marathon Homes", "Champion Homes"];

/**
 * The Marathon Homes plans Maxey carries — these and no others.
 *
 * The feed lists Marathon's whole line, so every feed row whose model is
 * built by Marathon is skipped, and these are read from Marathon's own plan
 * pages instead: name, beds, baths, square footage, box size, the floor-plan
 * drawing, the first gallery photograph and the Matterport tour. Add or
 * remove an entry here to change the line-up.
 *
 * `size` is where Maxey files the plan, and is carried over rather than
 * derived from the footprint: the Alamo is 472 sq ft and still a single wide.
 * `exterior` names the gallery image to use where the first one is not an
 * exterior — the Midland's gallery opens on its kitchen.
 */
const MARATHON = [
  ...["lanny", "chapman", "daniel", "jackson", "darrell", "terra"].map((p) => ({
    url: `https://marathonhomes.com/floorplans/the-${p}/`,
    size: "tiny",
  })),
  ...[
    "temple",
    "alamo",
    "mesquite",
    "pearland",
    "midland",
    "katy",
    "ranger",
    "grapevine",
    "conroe",
    "cisco",
    "breckenridge",
    "beaumont",
    "amarillo",
    "abilene",
  ].map((p) => ({ url: `https://marathonhomes.com/floorplans/the-${p}/`, size: "single" })),
  ...[
    "archer",
    "stonewall",
    "grayson",
    "maverick",
    "liberty",
    "swisher",
    "red-river",
    "sterling",
    "brewster",
    "caldwell",
    "hays",
    "jasper",
    "kendall",
    "bell",
    "bailey",
    "trinity",
    "fisher",
    "dawson",
    "coleman",
    "jefferson",
  ].map((p) => ({ url: `https://marathonhomes.com/floorplans/the-${p}/`, size: "double" })),
].map((m) => (m.url.endsWith("/the-midland/") ? { ...m, exterior: "Sw-dormer" } : m));

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

/**
 * Who built it — the `builder` the Brand filter on /listings is made from.
 *
 * The feed's own manufacturer field is unreliable (most of the Prime rows
 * carry a scrap of Champion's website navigation in it), so the brand is read
 * from the line instead: the Prime lines and Dutch Elite are Champion Homes,
 * and the Origin and Mini series are Clayton-built — every image they carry
 * is served from Clayton's own API. A row that matches none is left without
 * a brand rather than guessed at.
 */
function brandOf(row) {
  const t = row.title.trim();
  const m = row.homeModel?.manufacturer ?? "";
  if (/^Prime\b/i.test(t) || /^Dutch\b/i.test(t) || /champion/i.test(m)) return "Champion Homes";
  if (/^(Origin|Mini) Series\b/i.test(t)) return "Clayton";
  return undefined;
}

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
 * folded in rather than left as ten one-off series. Everything else gets NO
 * series: the feed does not name that line, and naming it here would be
 * inventing one.
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

/* The feed is read from the snapshot beside this script, not from the
   network. maxeycustomhomes.com now serves THIS site, and the old Mobile Home
   Manager deployment the feed came from moved to a temporary host that is
   being switched off — so the snapshot is the only copy. `--refresh URL`
   re-reads a live feed of the same shape and overwrites it. */
const refresh = process.argv[process.argv.indexOf("--refresh") + 1];
let feed;
if (process.argv.includes("--refresh")) {
  const res = await fetch(refresh);
  if (!res.ok) throw new Error(`feed ${res.status}`);
  feed = await res.json();
  if (!DRY) await writeFile(SNAPSHOT, JSON.stringify(feed, null, 1));
} else {
  feed = JSON.parse(await readFile(SNAPSHOT, "utf8"));
}
console.log(`feed: ${feed.length} homes`);

/* ---- floor plans by model code ------------------------------------ *
 *
 * Champion's Prime plans are named by a model code — 3260H32P03 is a
 * 32 x 60 three-bedroom — and the feed carries several of them twice, once
 * as "Prime Series / 3260H32P03" and again as "Prime 3260H32P03 042". Only
 * one copy of each pair was given the drawing. Same code, same plan, so the
 * drawing is found across every row that carries the code and shared.
 *
 * Which image IS the drawing is not the feed's first `/floorplan/` image:
 * the listing host files a model's whole gallery under that path, kitchens
 * and all, and taking the first one put a bathroom where the plan belongs.
 * The drawing is the one file named after the code itself
 * (`…/floorplan/232185/1656H32P05.jpg`, `…/Monte 1676H32P06 .jpg`); the
 * gallery photographs carry a room suffix (`-int-1`, `-kit-4`) or a number.
 */
const modelCode = (title) => title.match(/\b(\d{4}H\d{2}[P9]\d{2})\b/i)?.[1].toUpperCase();

const imagesOf = (row) => {
  let modelPhotos = [];
  try {
    modelPhotos = JSON.parse(row.homeModel?.photos ?? "[]");
  } catch {}
  return [row.image, row.homeModel?.image, ...(row.pictures ?? []).map((p) => p.url), ...modelPhotos].filter(Boolean);
};

const PLAN_BY_CODE = new Map();
for (const row of feed) {
  const code = modelCode(row.title);
  if (!code || PLAN_BY_CODE.has(code)) continue;
  const named = imagesOf(row).find((u) => {
    const m = u.match(/cloudfront\.net\/manufacturer\/\d+\/floorplan\/\d+\/([^/?]+)$/);
    if (!m) return false;
    const file = decodeURIComponent(m[1]).replace(/\.\w+$/, "").trim();
    return file.toUpperCase().endsWith(code) && !/_thumb|-(int|ext|kit|uti)-/i.test(file);
  });
  if (named) PLAN_BY_CODE.set(code, named);
}

const seen = new Map();
const entries = [];
const lot = [];
const photoKeys = {};
const downloads = [];
const stats = { photo: 0, plan: 0, junk: 0, withPhoto: 0, withPlan: 0, withNeither: 0 };

for (const row of feed) {
  /* Marathon is imported from Marathon's own pages below, and only the plans
     in MARATHON — not the whole line the feed carries. */
  if (row.homeModel?.manufacturer === "Marathon Homes") {
    stats.marathonSkipped = (stats.marathonSkipped ?? 0) + 1;
    continue;
  }
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
    ...(brandOf(row) ? { builder: brandOf(row) } : {}),
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

  if (TOUR_FIX[slug]) entry.tourUrl = TOUR_FIX[slug];

  const tru = TRU[slug];
  if (tru) {
    /* See `TRU` above: TRU's page is the authority for every fact it
       publishes, and the feed is only the list of which homes Maxey sells. */
    const r = await get(tru.page);
    if (r instanceof Error) throw r;
    if (!r.ok) throw new Error(`${tru.page}: ${r.status}`);
    const html = await r.text();
    const text = html
      .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ");
    const spec = text.match(/(\d+) beds? \/ ([\d.]+) baths? \/ ([\d,]+) sq\.?\s*ft/i);
    const code = html.match(/<title>\s*(TRT\w+)/i)?.[1];
    const plan = html.match(/https:\/\/api\.claytonhomes\.com\/images\/mfg\/flp\/[0-9a-f-]+\.\w+/)?.[0];
    if (!spec || !code) throw new Error(`${tru.page}: could not read the spec line`);
    /* TRU's model code is the box: TRT16763AH is 16 wide, 76 long, 3 beds. */
    const [, w, l] = code.match(/^TRT(\d{2})(\d{2})/);
    const line = series?.replace(/ Series$/, "");
    Object.assign(entry, {
      name: row.title.replace(/\s+/g, " ").trim(),
      model: code,
      beds: Number(spec[1]),
      baths: Number(spec[2]),
      sqft: Number(spec[3].replace(/,/g, "")),
      widthFt: Number(w),
      lengthFt: Number(l),
      dimensions: `${Number(w)}' × ${Number(l)}'`,
      tagline: `${Number(w)}' × ${Number(l)}' ${entry.sections}-section home from Clayton's TRU ${line} line.`,
      sourceUrl: tru.page,
    });
    if (plan) {
      entry.planImage = `/photos/plans/${slug}.webp`;
      downloads.push([plan, entry.planImage]);
      stats.withPlan++;
    }
    const labels = { living: "living room" };
    for (const [kind, url] of Object.entries(tru.scenes)) {
      entry.scenes.push({ kind, caption: `${entry.name} — ${tru.captions?.[kind] ?? labels[kind] ?? kind}` });
      const dest = `/photos/homes/${slug}-${kind}.webp`;
      photoKeys[`${slug}/${kind}`] = dest;
      downloads.push([url, dest]);
    }
    stats.withPhoto++;
    stats.tru = (stats.tru ?? 0) + 1;
  } else {
    /* The plan named after this home's model code leads, from whichever feed
       row carries it; a `drawing` chosen by hand in the selection file leads
       over that. */
    const named = PLAN_BY_CODE.get(modelCode(row.title));
    const pick = SELECTION[slug];
    for (const lead of [named, pick?.drawing]) {
      if (!lead) continue;
      if (plans.includes(lead)) plans.splice(plans.indexOf(lead), 1);
      plans.unshift(lead);
    }

    if (plans.length) {
      const dest = `/photos/plans/${slug}.webp`;
      entry.planImage = dest;
      downloads.push([plans[0], dest]);
      stats.withPlan++;
    }

    if (pick?.url) {
      const label = { exterior: "exterior", living: "living room" }[pick.kind] ?? pick.kind;
      entry.scenes.push({ kind: pick.kind, caption: `${row.title} — ${pick.caption ?? label}` });
      const dest = `/photos/homes/${slug}-${pick.kind}.webp`;
      photoKeys[`${slug}/${pick.kind}`] = dest;
      downloads.push([pick.url, dest]);
      stats.withPhoto++;
    } else if (slug in SELECTION) {
      if (!plans.length) stats.withNeither++;
    } else if (photos.length) {
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

  }

  const state = STATUS[row.status];
  if (!state) console.warn(`  ! unknown status ${JSON.stringify(row.status)} on ${row.title}`);
  const featured = row.isPromoted || state?.onLot;
  if (state && (state.status !== "to-order" || featured)) {
    lot.push([slug, { ...state, ...(featured ? { featured: true } : {}) }, row.status]);
  }

  entries.push(entry);
}

/* ---- Marathon ---------------------------------------------------- */

const decode = (s) =>
  s
    .replace(/<[^>]+>/g, " ")
    .replace(/&#8217;|&rsquo;/g, "’")
    .replace(/&#8221;|&quot;/g, '"')
    .replace(/&#8242;|&#039;|&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

/** Marathon's server drops the odd request under a run of forty; retry it. */
async function get(url, tries = 4) {
  for (let i = 1; ; i++) {
    const r = await fetch(url, { headers: { "user-agent": UA } }).catch((e) => e);
    if ((r instanceof Response && (r.ok || r.status < 500)) || i === tries) return r;
    await new Promise((ok) => setTimeout(ok, 2000 * i));
  }
}

for (const { url, size, exterior } of MARATHON) {
  const r = await get(url);
  if (r instanceof Error) throw r;
  if (!r.ok) throw new Error(`${url}: ${r.status}`);
  const html = await r.text();
  const text = decode(html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, " "));

  const name = decode(html.match(/<title>([^<|]+)/)?.[1] ?? "");
  const box = text.match(/(\d+'\s*(?:\d+")?\s*x\s*\d+'\s*(?:\d+")?)\s*(?:Park Model\/Tiny Home|Singlewide|Doublewide)(?:\s*-\s*([\d,]+)\s*SF)?/i);
  const bb = text.match(/(\d+)\s*Bed\s*x\s*(\d+(?:\.\d)?)\s*Bath/i);
  if (!name || !box || !bb) throw new Error(`${url}: could not read the spec line`);

  /* Square footage is on every page but the Lanny's. Maxey's own feed lists
     the Lanny, so its figure is the fallback; a plan in neither fails loudly
     rather than printing a guess. */
  const fromFeed = feed.find((row) => row.title.trim().toLowerCase() === name.toLowerCase());
  const sqft = Number(box[2]?.replace(/,/g, "")) || fromFeed?.sqft;
  if (!sqft) throw new Error(`${url}: no square footage on the page or in Maxey's feed`);

  /* Images in page order. The lead image is the floor-plan drawing; the
     gallery after it is photographs, almost always exterior first. */
  const images = [];
  for (const [u] of html.matchAll(/https:\/\/marathonhomes\.com\/wp-content\/uploads\/[^"' )]+?\.(?:jpe?g|png|webp)/gi)) {
    if (/-\d+x\d+\./.test(u) || /Floorplan-CTA|coming-soon/i.test(u) || images.includes(u)) continue;
    images.push(u);
  }
  const [plan, ...gallery] = images;
  const photo = exterior ? gallery.find((u) => u.split("/").pop().startsWith(exterior)) : gallery[0];
  if (exterior && !photo) throw new Error(`${url}: no gallery image named ${exterior}`);

  const tour = html.match(/<iframe[^>]+src="(https:\/\/my\.matterport\.com\/[^"]+)"/)?.[1];
  const slug = slugify(name);
  seen.set(slug, 1);
  /* Marathon's model number, which it names each floor-plan drawing after:
     the Midland is 16763B. The tiny homes' drawings carry their name
     instead, and they get no number rather than an invented one. */
  const code = plan?.split("/").pop().match(/^(?:floorplan-)?(\d{5}[A-Z])\b/)?.[1];
  const dims = box[1].trim().replace(/\s*x\s*/i, " × ").replace(/'\s+(\d)/g, "'$1");
  const entry = {
    slug,
    name,
    construction: "manufactured",
    builder: "Marathon Homes",
    ...(code ? { model: code } : {}),
    beds: Number(bb[1]),
    baths: Number(bb[2]),
    sqft,
    sections: size === "double" ? "double" : "single",
    sizeCategory: size,
    dimensions: dims,
    tagline: `${dims} ${{ tiny: "park model / tiny home", single: "single-section home", double: "double-section home" }[size]}, built by Marathon Homes.`,
    ...(tour ? { tourUrl: tour } : {}),
    scenes: [],
    sourceUrl: url,
  };
  if (plan) {
    entry.planImage = `/photos/plans/${slug}.webp`;
    downloads.push([plan, entry.planImage]);
    stats.withPlan++;
  }
  if (photo) {
    entry.scenes.push({ kind: "exterior", caption: `${name} — exterior` });
    const dest = `/photos/homes/${slug}-exterior.webp`;
    photoKeys[`${slug}/exterior`] = dest;
    downloads.push([photo, dest]);
    stats.withPhoto++;
  }
  entries.push(entry);
  console.log(`  marathon: ${name}, ${entry.beds} bd / ${entry.baths} ba, ${sqft} sq ft, ${dims}`);
}
console.log(`marathon: ${stats.marathonSkipped ?? 0} feed rows skipped, ${MARATHON.length} plans read`);
console.log(`tru: ${stats.tru ?? 0} Clayton homes read from owntru.com`);

console.log(
  `pictures:${stats.photo} photos, ${stats.plan} plans, ${stats.junk} junk dropped\n` +
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
    const r = await get(url);
    if (r instanceof Error) throw r;
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
  if (e.scenes.length && !photoKeys[`${e.slug}/${e.scenes[0].kind}`]) e.scenes = [];
}

/* ---- write ------------------------------------------------------- */

/* Clayton, then Marathon, then Champion — see `BUILDER_ORDER`. Stable, so
   each builder's homes keep the order they were read in. */
const rank = (e) => {
  const i = BUILDER_ORDER.indexOf(e.builder);
  return i === -1 ? BUILDER_ORDER.length : i;
};
entries.sort((a, b) => rank(a) - rank(b));

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
 * Written by \`node scripts/import-maxey-listings.mjs\` from Maxey's own
 * inventory feed, as its old site served it from
 *
 *     ${FEED}
 *
 * and as kept in \`scripts/maxey-feed.snapshot.json\`, since that URL now
 * serves this site.
 *
 * except Marathon Homes, which is read from Marathon's own plan pages and
 * limited to the ${MARATHON.length} plans listed in \`MARATHON\` in the import script,
 * and Clayton's TRU homes, whose specs, floor plans and photographs are read
 * from TRU's own model pages at owntru.com (\`scripts/tru-selection.json\`).
 *
 * Written in builder order — Clayton, then Marathon, then Champion — which
 * is the order /listings shows by default.
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
 * ${Object.keys(photoKeys).length} photographs, one per home that has one: ${
    Object.keys(photoKeys).filter((k) => k.endsWith("/exterior")).length
  } exteriors, and an
 * interior for the ${
    Object.keys(photoKeys).filter((k) => !k.endsWith("/exterior")).length
  } homes no source carries an exterior of. Which image leads each home
 * is \`scripts/maxey-photo-selection.json\`, and \`scripts/tru-selection.json\` for the
 * Clayton homes, which carry a room-by-room gallery from TRU's own pages. They are the manufacturers' own model photography carried in Maxey's feed —
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
