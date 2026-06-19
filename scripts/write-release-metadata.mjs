import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function git(args, fallback = "") {
  try {
    return execFileSync("git", args, {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return fallback;
  }
}

const gitSha = process.env.GITHUB_SHA || process.env.LIPYUM_GIT_SHA || git(["rev-parse", "HEAD"], "unknown");
const branch = process.env.GITHUB_REF_NAME || process.env.LIPYUM_GIT_BRANCH || git(["rev-parse", "--abbrev-ref", "HEAD"], "unknown");
const platform = process.env.GITHUB_PAGES === "true" ? "github-pages" : "local";
const buildDate = new Date().toISOString();
const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] || "lipyum-partner-design-studio";
const basePath = platform === "github-pages" ? `/${repositoryName}/` : "/";

const release = {
  gitSha,
  version: process.env.LIPYUM_RELEASE_VERSION || "v13-fast-finish",
  buildDate,
  branch,
  platform,
  runtime: "vue",
  designContractVersion: "V13-FINAL-RELEASE-CONTRACT",
  basePath,
};

const publicDir = path.join(root, "public");
mkdirSync(publicDir, { recursive: true });
writeFileSync(path.join(publicDir, "release.json"), `${JSON.stringify(release, null, 2)}\n`, "utf8");
console.log(`[release] wrote public/release.json for ${gitSha}`);
