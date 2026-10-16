"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";

type QwPlugin = {
  appendIframe?: (
    opts: { dealerId: string; pageType?: string },
    selector: string,
  ) => Promise<unknown>;
};

declare global {
  interface Window {
    qwPlugin?: QwPlugin;
  }
}

/** The container QualifyWizard's `framePage` rule looks for. The id is set in
    Maxey's QualifyWizard account, not here — change it there first. */
const CONTAINER_ID = "qw-frame-page-container-id";
const FRAME = '[data-qw-framepage="true"]';

/**
 * QualifyWizard's pre-qualification, inline — see `lib/prequalify.ts`.
 *
 * The plugin's `autoInstall` finds the container and puts the wizard's iframe
 * in it, on a hard load and again after every client-side navigation (it
 * hooks `history.pushState`). If the plugin is there and the frame still is
 * not after a few seconds, `appendIframe` is called once by hand. If nothing
 * has rendered after twelve — the script blocked, the account changed — the
 * phone number shows instead of an empty box.
 */
export function QualifyWizardFrame({ src, dealerId }: { src: string; dealerId: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let called = false;
    const started = Date.now();

    const tick = () => {
      if (cancelled) return;
      if (box.current?.querySelector(FRAME)) {
        setFailed(false);
        return;
      }
      const qw = window.qwPlugin;
      if (qw?.appendIframe && !called && Date.now() - started > 3000) {
        called = true;
        qw.appendIframe({ dealerId, pageType: "framePage" }, `#${CONTAINER_ID}`).catch((err) =>
          console.warn("[prequalify] appendIframe failed:", err),
        );
      }
      if (Date.now() - started > 12_000) setFailed(true);
      setTimeout(tick, 200);
    };
    tick();

    /* The wizard focuses its first field as it loads, and the browser
       scrolls the page to it — straight past the hero, before the visitor
       has read a word. For the first few seconds, a scroll the visitor did
       not make, landing focus in the frame, is put back. */
    let touched = false;
    const touch = () => {
      touched = true;
    };
    const inputs = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
    inputs.forEach((e) => window.addEventListener(e, touch, { passive: true }));
    const home = window.scrollY;
    const onScroll = () => {
      if (touched || Date.now() - started > 8000) return;
      if (document.activeElement?.tagName === "IFRAME") {
        (document.activeElement as HTMLElement).blur();
        window.scrollTo({ top: home, behavior: "instant" });
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelled = true;
      inputs.forEach((e) => window.removeEventListener(e, touch));
      window.removeEventListener("scroll", onScroll);
    };
  }, [dealerId]);

  return (
    <>
      <Script id="qualify-wizard" src={src} strategy="afterInteractive" />
      {/* The plugin styles its container as a centred grid, which shrinks the
          frame to an iframe's default 300px on a phone; block and full-width
          let it use the column. */}
      <div ref={box} id={CONTAINER_ID} className="mx-auto w-full !max-w-[600px] !block [&_iframe]:!w-full" />
      {failed && (
        <p className="mt-3 text-center text-sm text-muted">
          The pre-qualification form didn&apos;t load. Call{" "}
          <a href={site.phoneHref} className="text-ink underline underline-offset-4">
            {site.phone}
          </a>{" "}
          or use the form below.
        </p>
      )}
    </>
  );
}
