/** Library constants, safe to import from Server and Client Components alike. */

export const platformIds = [
  "whatsapp",
  "facebook",
  "twitter",
  "linkedin",
  "telegram",
  "reddit",
  "email",
  "pinterest",
  "discord",
] as const;
export type PlatformId = (typeof platformIds)[number];

export const buttonStyles = ["default", "primary", "compact", "icon-only"] as const;
export type ButtonStyle = (typeof buttonStyles)[number];

export const platformLabels: Record<PlatformId, string> = {
  whatsapp: "WhatsApp",
  facebook: "Facebook",
  twitter: "X",
  linkedin: "LinkedIn",
  telegram: "Telegram",
  reddit: "Reddit",
  email: "Email",
  pinterest: "Pinterest",
  discord: "Discord",
};
