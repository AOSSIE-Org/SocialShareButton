// Runs before `dev` and `build`. Copies the library from the repository root (../src) into
// public/vendor so the website always demos the exact code in this commit, and keeps the
// CDN version pinned in public/llms.txt in step with ../package.json.
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const websiteRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = join(websiteRoot, "..");
const target = join(websiteRoot, "public", "vendor", "social-share-button");

mkdirSync(target, { recursive: true });
for (const file of ["social-share-button.js", "social-share-button.css"]) {
  copyFileSync(join(repoRoot, "src", file), join(target, file));
}
console.log(`Synced SocialShareButton library into ${target}`);

const { version } = JSON.parse(readFileSync(join(repoRoot, "package.json"), "utf8"));
const llmsPath = join(websiteRoot, "public", "llms.txt");
const llms = readFileSync(llmsPath, "utf8");
const pinned = llms.replace(/SocialShareButton@v\d+\.\d+\.\d+/g, `SocialShareButton@v${version}`);
if (pinned !== llms) {
  writeFileSync(llmsPath, pinned);
  console.log(`Updated CDN version in public/llms.txt to v${version}`);
}
