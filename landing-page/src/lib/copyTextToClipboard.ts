/** Copy text to the clipboard; returns false when both APIs fail. */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to execCommand path (e.g. insecure context / denied permission).
  }

  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.setAttribute("readonly", "");
    textArea.style.position = "absolute";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    try {
      textArea.select();
      textArea.setSelectionRange(0, text.length);
      return document.execCommand("copy");
    } finally {
      document.body.removeChild(textArea);
    }
  } catch {
    return false;
  }
}
