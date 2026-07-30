"use client";
import { useState } from "react";

export const CodeBox = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };
  return (
    <div className="bg-black dark:bg-white rounded-2xl p-4 sm:p-6 mb-4 relative group">
      <code className="text-white dark:text-black text-xs sm:text-sm md:text-base font-mono pr-16 sm:pr-20 break-all block whitespace-pre-wrap">
        {code}
      </code>
      <button
        onClick={handleCopy}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-[#FFCC00] text-black px-3 sm:px-4 py-1 sm:py-2 rounded-lg font-bold hover:brightness-110 transition-all text-xs sm:text-sm"
      >
        {copied ? "✓ Copied!" : "Copy"}
      </button>
    </div>
  );
};
