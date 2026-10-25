/* eslint-disable @next/next/no-img-element -- static export serves unoptimized images anyway */
import type { ComponentType, SVGProps } from "react";
import { useTranslations } from "next-intl";
import {
  BrandMark,
  DiscordIcon,
  LinkedInIcon,
  TelegramIcon,
  XLogoIcon,
  YouTubeIcon,
} from "@/components/ui/Icons";
import { docsUrl, npmUrl, repoUrl, socialLinks } from "@/config/site";

const socials: { key: keyof typeof socialLinks; icon: ComponentType<SVGProps<SVGSVGElement>> }[] = [
  { key: "discord", icon: DiscordIcon },
  { key: "telegram", icon: TelegramIcon },
  { key: "x", icon: XLogoIcon },
  { key: "linkedin", icon: LinkedInIcon },
  { key: "youtube", icon: YouTubeIcon },
];

export function Footer() {
  const t = useTranslations("Footer");
  const nav = useTranslations("Nav");

  const projectLinks = [
    { label: t("github"), href: repoUrl },
    { label: t("docs"), href: docsUrl },
    { label: t("npm"), href: npmUrl },
    { label: t("releases"), href: `${repoUrl}/releases` },
  ];
  const communityLinks = [
    { label: t("contributing"), href: `${repoUrl}/blob/main/CONTRIBUTING.md` },
    { label: t("issues"), href: `${repoUrl}/issues/new/choose` },
    { label: t("discord"), href: socialLinks.discord },
  ];

  const linkClass =
    "text-sm/6 text-foreground-secondary transition-colors hover:text-foreground-primary focus-visible:outline-2 focus-visible:outline-accent";

  return (
    <footer className="border-t border-line">
      <div className="grid gap-12 px-4 py-14 sm:px-6 md:grid-cols-[1fr_auto_auto] md:gap-x-16 lg:gap-x-24 lg:px-10">
        <div>
          <div className="flex items-center gap-2.5">
            <BrandMark className="size-7" />
            <span className="text-[15px] font-semibold tracking-tight text-foreground-primary">{nav("brand")}</span>
          </div>
          <p className="mt-4 max-w-sm text-sm/6 text-foreground-secondary">{t("tagline")}</p>
          <div className="mt-6 flex items-center gap-5">
            <a href="https://aossie.org" target="_blank" rel="noopener noreferrer" className="rounded-md focus-visible:outline-2 focus-visible:outline-accent">
              <img src="/brand/icons/aossie_logo.svg" alt={t("aossieLogo")} width={37} height={40} className="h-10 w-auto" loading="lazy" />
            </a>
            <a href="https://stability.nexus" target="_blank" rel="noopener noreferrer" className="rounded-md focus-visible:outline-2 focus-visible:outline-accent">
              <img src="/brand/icons/stability_nexus_logo.svg" alt={t("stabilityNexusLogo")} width={35} height={40} className="h-10 w-auto" loading="lazy" />
            </a>
          </div>
        </div>

        {[
          { title: t("project"), links: projectLinks },
          { title: t("community"), links: communityLinks },
        ].map((column) => (
          <div key={column.title}>
            <h2 className="text-sm font-semibold text-foreground-primary">{column.title}</h2>
            <ul className="mt-4 space-y-2.5">
              {column.links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Separated by a hairline: socials on the left, copyright and license on the right edge */}
        <div className="flex flex-col-reverse gap-4 border-t border-line pt-8 md:col-span-3 md:flex-row md:items-center md:justify-between">
          <ul className="-ml-2 flex items-center gap-1">
            {socials.map(({ key, icon: Icon }) => (
              <li key={key}>
                <a
                  href={socialLinks[key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${t(key)} ${nav("external")}`}
                  className="inline-grid size-9 place-items-center rounded-full text-foreground-muted transition-colors hover:bg-button-secondary-bg hover:text-foreground-primary focus-visible:outline-2 focus-visible:outline-accent"
                >
                  <Icon className="size-4.5" />
                </a>
              </li>
            ))}
          </ul>
          <p className="text-sm text-foreground-muted md:text-right">
            {t("copyright", { year: new Date().getFullYear() })} {t("license")}
          </p>
        </div>
      </div>
    </footer>
  );
}
