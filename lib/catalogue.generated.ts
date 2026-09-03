/**
 * THE IMPORTED CATALOGUE — GENERATED FILE, DO NOT EDIT BY HAND.
 *
 * Written by `node scripts/import-manufacturers.mjs homes` from the
 * manufacturers this dealership retails. Every figure it writes is read from
 * the model page named in its `sourceUrl` and can be checked against it in
 * one click.
 *
 * Anything a human decides — what is standing on the lot, what is featured,
 * what is sold — is NOT in here. That lives in `lotState` in `lib/homes.ts`,
 * which is applied over this file, so re-running the import never overwrites
 * it.
 *
 * ------------------------------------------------------------------------
 * EMPTY, DELIBERATELY, AND THIS IS THE HONEST STATE.
 *
 * This file previously held 348 Pine Grove and Pleasant Valley plans,
 * imported for a previous deployment. Every one of them rendered as
 * "Available to order" — which is a claim that THIS dealership can order that
 * plan from that manufacturer. Maxey publishes no manufacturer line-up, so
 * that claim could not be checked, and 348 unverifiable ones is not a
 * catalogue, it is a liability.
 *
 * maxeycustomhomes.com lists no inventory either: it renders its size buttons
 * over "0 homes available". So zero is not a gap here — it is what the
 * business is currently saying about itself, and the site now says the same
 * thing.
 *
 * The whole site is built to read honestly at zero: the size buttons still
 * render (see `sizeCategoryEnabled` in `lib/homes.ts`), `/listings` says
 * plainly that there is nothing in it yet, and the landing band shows the
 * count rather than an empty shelf.
 *
 * To fill it: point `scripts/import-manufacturers.mjs` at the manufacturers
 * Maxey actually retails and run
 *
 *     node scripts/import-manufacturers.mjs photos
 *     node scripts/import-manufacturers.mjs homes
 *     node scripts/import-manufacturers.mjs manifest
 *
 * Homes standing on the lot then get flagged in `lotState`.
 * ------------------------------------------------------------------------
 */
import type { CatalogueEntry } from "./homes";

export const catalogue: CatalogueEntry[] = [];
