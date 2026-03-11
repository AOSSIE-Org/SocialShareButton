import { useEffect, useRef } from "react";

/**
 * SocialShareDesigner (React wrapper)
 * Wraps window.SocialShareDesigner using the same useRef + useEffect pattern
 * as the existing SocialShareButton React wrapper.
 *
 * Usage:
 *   import { SocialShareButton } from "./social-share-button-react";
 *   import { SocialShareDesigner } from "./social-share-designer-react";
 *
 *   <SocialShareButton ref={btnRef} container="#share-btn" ... />
 *   <SocialShareDesigner targetButton={btnInstance} />
 */

export const SocialShareDesigner = ({
  /** Pass the SocialShareButton JS instance for full control,
   *  or a CSS selector string for CSS-vars-only mode. */
  targetButton = null,
}) => {
  const panelRef    = useRef(null);
  const designerRef = useRef(null);

  useEffect(() => {
    if (!panelRef.current || designerRef.current) return;

    if (typeof window === "undefined" || !window.SocialShareDesigner) {
      console.warn(
        "[SocialShareDesigner] window.SocialShareDesigner not found. " +
          "Make sure social-share-designer.js is loaded before this component mounts."
      );
      return;
    }

    designerRef.current = new window.SocialShareDesigner({
      panelContainer: panelRef.current,
      targetButton,
    });

    return () => {
      if (designerRef.current) {
        designerRef.current.destroy();
        designerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If targetButton changes (e.g. the SocialShareButton instance is replaced),
  // tear down and rebuild the designer so it points at the new instance.
  useEffect(() => {
    if (!designerRef.current) return;

    designerRef.current.destroy();
    designerRef.current = null;

    if (!panelRef.current) return;

    if (typeof window !== "undefined" && window.SocialShareDesigner) {
      designerRef.current = new window.SocialShareDesigner({
        panelContainer: panelRef.current,
        targetButton,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetButton]);

  return <div ref={panelRef} className="ssb-designer-root" />;
};

export default SocialShareDesigner;
