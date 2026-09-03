<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Maxey Custom Homes — where things live

This is the Maxey Custom Homes site (Maxey Homes & Land, LLC, Norman, Oklahoma). Almost every change is a data
change; routes derive from the data and should rarely be edited directly.

```
lib/homes.ts        The catalogue's types, and `lotState` — the ONE
                    hand-maintained part: which plans are standing on
                    Melba Ln, what is featured, what is sold. It ships
                    EMPTY — nothing claims to be on the lot. The plans
                    themselves are generated (below) and `listings` is the
                    two composed. Also the size buckets, including `Mods`,
                    which keys off `construction` rather than width.
lib/catalogue.generated.ts
                    GENERATED, and currently EMPTY — the site shows no homes,
                    which is what maxeycustomhomes.com shows too. It held 348
                    Pine Grove and Pleasant Valley plans imported for a
                    previous deployment, each reading "Available to order",
                    which is a claim Maxey could not stand behind. Read the
                    header of that file before repopulating it.
                    Rewritten by `node scripts/import-manufacturers.mjs
                    homes`; never hand-edit it, edit `lotState` instead.
lib/projects.ts     Past projects — houses Maxey has actually delivered.
                    Evidence, as against the catalogue's plans. Ships
                    EMPTY and `/projects` is switched off to match.
lib/videos.ts       Informational videos — the process, construction loan
                    versus end loan, site work. Ships EMPTY and `/videos`
                    is switched off to match.
lib/floor-plans.ts  Room geometry in feet. Rooms must tile the footprint.
lib/communities.ts  Communities, tenure, lot rents, amenities. Currently
                    EMPTY, and `/communities` is switched off to match.
lib/photos.ts       Page heroes and one-offs, by key, plus the generated
                    `lib/photos.generated.ts` for imported homes. Absent
                    key = an empty plate; the site shows photographs only.
                    A floor-plan DRAWING is not a photograph and lives in
                    `planImage` on the listing, labelled as a drawing.
lib/site.ts         Business name, phone, address, canonical URL.
lib/page-config.ts  Which bands the landing page renders, in what order,
                    and which routes exist at all. Turning a page off
                    redirects it to `/` and removes its links everywhere.
                    Also the two pieces of phone chrome: `callBar`, the
                    strip above the header, and `floatingCall`.
lib/navigation.ts   Header, drawer and footer links, filtered through
                    page-config. Add a route here, not as a stray anchor.
lib/faq.ts          The questions. `/faq` shows all of them, the foot of
                    `/why-manufactured` shows the first six.
lib/promotions.ts   Live offers, each with an end date. Ships empty.
lib/blog.ts         Posts. Ships empty; `/blog` is switched off to match.
lib/custom-pages.ts Campaign pages at `/p/<slug>` — the landing page
                    narrowed to one series. Ships empty.
lib/legal.ts        Privacy and terms clauses. A draft to be reviewed by
                    a lawyer, not legal advice.
lib/company.ts      What the business claims about itself — founding year,
                    staff, principles, warranty, deposit terms. Every field
                    optional; an absent one hides its section rather than
                    being guessed at.
lib/market.ts       Facts true of this market only — counties, wind and
                    thermal zone, state titling, USDA notes. Also optional;
                    the copy falls back to a portable sentence.
lib/land/           Everything behind /land-deals: `areas.ts` prices each
                    county in the delivery radius, `geo.ts` holds the lot's
                    coordinates and the projection, and the generated file
                    holds the county boundaries. Market data in the sense
                    above — true of one radius and of no other. `geo.ts`
                    points at the lot in Norman, but the boundaries are
                    STILL Maine and its neighbours and `areas.ts` prices
                    nothing, so `/land-deals` is switched off until both are
                    regenerated and priced for Oklahoma.
lib/chat.ts         Every word the chat widget says, in order — the
                    greeting, the five questions, the buttons on the first
                    one, the sign-off. `components/chat-widget.tsx` reads
                    them and holds no copy of its own. The widget is a
                    guided intake, not an AI, and says so in its first
                    message; `chatWidget` in page-config switches it off.
lib/ghl/            The CRM. `fields.ts` is every contact custom field the
                    site fills in — the ONE list, read at request time by
                    `client.ts` and by `scripts/ghl-setup.mjs`, which
                    creates them in a sub-account. `custom-values.ts` is the
                    location-level values, drawn from `lib/site.ts`.
                    `map.ts` decides which answer lands in which field;
                    `submit.ts` is the single door every lead leaves by —
                    GoHighLevel, then `LEAD_WEBHOOK_URL`, then the log.
                    Adding a field is one entry in `fields.ts`, one line in
                    `map.ts`, and the next deploy — `postbuild` creates
                    whatever the CRM is missing and never fails a build.
                    `chat-embed.ts` reads the `CHAT_WIDGET` variable: set it
                    to GHL's embed snippet and GHL's own chat widget loads
                    in place of this site's — one bubble, never two.
lib/attribution.ts  First-touch UTM parameters and referrer, kept in
                    sessionStorage and posted with every lead, because GHL's
                    own attribution only sees GHL's own forms.
lib/skin.ts         Skins: the whole palette, the brand gradient, the
                    typeface pairing, the corner radii and the primary
                    button, as data. Two ship — `hearthline` (warm and
                    editorial, a serif on limestone) and `nerto` (white
                    ground, slate type, a blue-to-orange gradient on every
                    primary button, system sans — the look a Mobile Home
                    Manager deployment wears, taken from a live one rather
                    than guessed at). `activeSkin` picks one; that one line
                    restyles the site.
app/globals.css     Token structure and the fallback values. A skin
                    overrides whatever it names; edit here to restyle one
                    deployment without adding a skin.
components/landing.tsx
                    The landing page, as an ordered list of switchable
                    bands. `/` and every `/p/<slug>` render it — edit the
                    band here and both follow. It ships in the short,
                    conversion-shaped order: hero, offer, one wide
                    photograph, reviews, three steps, the catalogue, the
                    closing call and form, the hours. Eight more bands are
                    written, styled and switched off — among them the whole
                    editorial argument for a manufactured home (`ticker`,
                    `numbers`, `myth`, `cutaway`) — each one `true` away.
```

The catalogue is at `/listings`; `/homes` permanently redirects there.

Homes are browsed by size first — tiny, single, double, triple, mods. The
bucket comes from `sections` where the home has one, never from square
footage alone, because "single wide" is a claim about width and filing a
1,000 sq ft double-section home under it would be false. `Mods` is checked
before any width rule and keys off `construction: "modular"`: a modular is a
build standard, not a width.

WHICH buckets appear is `sizeCategoryEnabled` in `lib/homes.ts`, not the
counts — Maxey shows tiny, single and double, which is its own site's
`homeTypeConfig`, and an enabled bucket renders whether or not it has homes
in it. That is the difference between "we do not sell these" and "we sell
these, none in stock today", and a count cannot tell them apart. An enabled
bucket shows its footprint range and count only once there is something to
measure.

Two statuses matter. `to-order` — "Available to order" — is the catalogue's
default: a plan the dealership can build for you. `onLot` says a home is
standing on Melba Ln, open to walk through, and it is the strongest thing a
card can say. Both are set in `lotState`, which is empty, as is the catalogue
it points into — so no home on this site claims either today.

Re-importing the catalogue is three commands, in this order:

    node scripts/import-manufacturers.mjs photos     # images
    node scripts/import-manufacturers.mjs homes      # lib/catalogue.generated.ts
    node scripts/import-manufacturers.mjs manifest   # lib/photos.generated.ts

`npm run lint` runs `scripts/check-data.mjs`, which fails if `lotState`, a
project or a custom page points at a plan that no longer exists — a model
code changing upstream is loud rather than silent.

Detailed conventions and recipes are in `.claude/skills/` — `homes`,
`photos`, `brand`, `voice`, `land-deals` and `crm`. Read the matching one before
editing; it is the contract for these files. `EDITING.md` is the same ground
for the human asking.

Never invent a fact about the business. If a dealership does not publish
its founding year, its staff or its warranty terms, delete the field in
`lib/company.ts` — the page shortens itself. `npm run check:placeholders`
(part of `npm run lint`) lists the template's fictional values still in
place, and fails outright once `NEXT_PUBLIC_SITE_URL` is a real domain.

Roughly 5,000 words of editorial copy in `components/landing.tsx`,
`lib/faq.ts` and on `/why-manufactured`, `/start-here`, `/land-deals` and
`/financing` are the template's own writing, and every deployment ships them identically. That is fine for one site and a problem
for the second one sold into the same market. `npm run check:boilerplate`
scores how much is still verbatim; the `voice` skill does the rewrite, which
keeps a locked list of facts intact.

Run `npm run lint` and `npm run build` before reporting a change done.
