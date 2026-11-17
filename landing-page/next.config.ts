import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { readFileSync } from "fs";
import { gzipSync } from "zlib";
import path from "path";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// The website lives inside the library repository. Read the library's version and
// real on-the-wire size from the source of truth so the site can never drift from it.
const libraryRoot = path.resolve(__dirname, "..");
const libraryPackage = JSON.parse(readFileSync(path.join(libraryRoot, "package.json"), "utf8")) as {
  version: string;
};
const gzippedBytes = ["social-share-button.js", "social-share-button.css"]
  .map((file) => gzipSync(readFileSync(path.join(libraryRoot, "src", file))).length)
  .reduce((total, size) => total + size, 0);

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
  env: {
    NEXT_PUBLIC_LIBRARY_VERSION: libraryPackage.version,
    NEXT_PUBLIC_LIBRARY_GZIP_KB: String(Math.round(gzippedBytes / 1024)),
  },
};

export default withNextIntl(nextConfig);
