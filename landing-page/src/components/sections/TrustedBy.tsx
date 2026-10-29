/* eslint-disable @next/next/no-img-element -- static export serves unoptimized images anyway */
import { useTranslations } from "next-intl";
import { Eyebrow } from "@/components/ui/Section";

interface Organization {
  name: string;
  /** Path under public/; every logo is rendered in grayscale until hovered. */
  logo: string;
}

/** Organizations that use Social Share Button. Add yours with a pull request. */
const organizations: Organization[] = [
  { name: "AOSSIE", logo: "/brand/icons/aossie_logo.svg" },
  { name: "DJED", logo: "/brand/icons/djed_alliance_logo.svg" },
  { name: "Stability Nexus", logo: "/brand/icons/stability_nexus_logo.svg" },
];

function Logo({ organization }: { organization: Organization }) {
  return (
    <span className="flex items-center gap-2.5 whitespace-nowrap text-foreground-primary opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0">
      <img src={organization.logo} alt="" width={28} height={28} className="h-7 w-auto" loading="lazy" />
      <span className="text-lg font-semibold tracking-tight uppercase">{organization.name}</span>
    </span>
  );
}

export function TrustedBy() {
  const t = useTranslations("TrustedBy");
  // Repeat the list so a single run is wider than the viewport, then render it twice for a seamless -50% loop.
  const run = Array.from({ length: 3 }, () => organizations).flat();

  return (
    <div>
      <Eyebrow as="h2" id="trusted-heading" tone="highlight">
        {t("title")}
      </Eyebrow>
      <div className="relative mt-6 overflow-hidden rounded-xl bg-card-bg ring-1 ring-line sm:w-3/4 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <p className="sr-only">{organizations.map((organization) => organization.name).join(", ")}</p>
        <ul aria-hidden className="flex w-max animate-marquee items-center py-7 hover:[animation-play-state:paused]">
          {[...run, ...run].map((organization, index) => (
            <li key={`${organization.name}-${index}`} className="px-7">
              <Logo organization={organization} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
