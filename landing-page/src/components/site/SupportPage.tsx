import { PageFrame } from "./PageFrame";
import { SupportUs } from "./SupportUs";

/** The support page, framed like the home page and the legal pages. */
export function SupportPage({ locale }: { locale: string }) {
  return (
    <PageFrame locale={locale}>
      {/*
        The widget reads its colours from the nearest parent with a background. <body> fades
        between themes, so give it a parent with the same tokens that switches at once:
        otherwise a theme toggle is read mid-fade and the widget keeps the old theme's colours.
      */}
      <div className="bg-background-primary text-foreground-primary">
        <SupportUs />
      </div>
    </PageFrame>
  );
}
