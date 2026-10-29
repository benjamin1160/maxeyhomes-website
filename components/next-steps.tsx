import Link from "next/link";
import { ButtonLink, Container, Icon, SectionHeading, cx } from "./ui";
import { Reveal } from "./reveal";
import { contactHref } from "@/lib/navigation";
import { pages, type OptionalPage } from "@/lib/page-config";
import { qwPages } from "@/lib/prequalify";
import { routes } from "@/lib/routes";
import { site } from "@/lib/site";

type Step = {
  key: string;
  href: string;
  page: OptionalPage;
  eyebrow: string;
  title: string;
  body: string;
};

/* The path every guide on the site leads down: the homes, how to pay for
   one, how to get it onto ground, what the whole thing costs. In that order,
   because that is the order the questions arrive in. */
const STEPS: Step[] = [
  {
    key: "homes",
    href: "/listings",
    page: "listings",
    eyebrow: "The homes",
    title: "See every floor plan",
    body: "Bedrooms, bathrooms, square footage and the manufacturer's drawing for each one.",
  },
  {
    key: "financing",
    href: routes.financing,
    page: "financing",
    eyebrow: "Financing",
    title: "Work out how to pay for it",
    body: "Home-only against land-home, what each loan needs, and where your down payment comes from.",
  },
  {
    key: "homeAndLand",
    href: routes.homeAndLand,
    page: "homeAndLand",
    eyebrow: "Home + land",
    title: "Put it on ground",
    body: "Your land or land you still need — delivery, setup and one loan for both.",
  },
  {
    key: "pricing",
    href: routes.pricingGuide,
    page: "pricingGuide",
    eyebrow: "Pricing guide",
    title: "Know the whole number",
    body: "The home, delivery, setup, utilities, permits and foundation, line by line.",
  },
];

/**
 * The band at the foot of every guide and size page: where to go next, then
 * the ask.
 *
 * `exclude` drops the page the visitor is already on. Every card is filtered
 * through `pages`, so a switched-off route loses its card rather than linking
 * to a redirect.
 */
export function NextSteps({
  exclude = [],
  title = "Where to go from here.",
  index,
  className,
}: {
  exclude?: string[];
  title?: string;
  index?: string;
  className?: string;
}) {
  const steps = STEPS.filter((s) => pages[s.page] && !exclude.includes(s.key));

  return (
    <section className={cx("border-t border-line bg-surface", className)}>
      <Container className="py-20 sm:py-24">
        <Reveal>
          <SectionHeading index={index} eyebrow="Next steps" title={title} />
        </Reveal>

        {steps.length > 0 && (
          <div
            className={cx(
              "mt-12 grid gap-5 sm:grid-cols-2",
              steps.length >= 3 && "lg:grid-cols-3",
              steps.length >= 4 && "xl:grid-cols-4",
            )}
          >
            {steps.map((s, i) => (
              <Reveal key={s.key} delay={i * 70}>
                <Link
                  href={s.href}
                  className="group flex h-full flex-col rounded-card border border-line bg-paper p-6 transition-colors hover:border-ember"
                >
                  <span className="eyebrow">{s.eyebrow}</span>
                  <span className="mt-3 font-display text-xl tracking-tight text-ink">
                    {s.title}
                  </span>
                  <span className="mt-2 flex-1 text-[0.92rem] leading-relaxed text-muted">
                    {s.body}
                  </span>
                  <span className="mt-5 flex items-center gap-1.5 text-[0.85rem] font-medium text-ink transition-colors group-hover:text-ember">
                    Read it
                    <Icon.Arrow className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        )}

        <Reveal className="mt-10">
          <div className="flex flex-col items-start gap-6 rounded-card border border-line bg-paper p-8 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="font-display text-2xl tracking-tight text-ink">
                Ready to talk about a real home?
              </h3>
              <p className="mt-2 max-w-xl leading-relaxed text-muted">
                Call {site.phone}, or tell us what you are after and we will call you back.
                {pages.prequalify && " Pre-qualifying online needs no Social Security number."}
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              {pages.prequalify && (
                <ButtonLink href={qwPages.noSSN.path} className="!px-6 !py-3.5">
                  Pre-qualify
                  <Icon.Arrow className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                </ButtonLink>
              )}
              <ButtonLink href={contactHref} variant="outline" className="!px-6 !py-3.5">
                Request a call
              </ButtonLink>
              <a
                href={site.phoneHref}
                className="inline-flex items-center justify-center gap-2 px-2 py-3 text-[0.9rem] font-medium text-ink hover:text-ember"
              >
                <Icon.Phone className="size-4" />
                {site.phone}
              </a>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
