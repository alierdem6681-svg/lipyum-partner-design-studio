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

const gitSha = process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA || git(["rev-parse", "HEAD"], "unknown");
const branch = process.env.VERCEL_GIT_COMMIT_REF || process.env.GITHUB_REF_NAME || git(["rev-parse", "--abbrev-ref", "HEAD"], "unknown");
const buildDate = process.env.VERCEL_ENV ? new Date().toISOString() : "local-build";

const release = {
  gitSha,
  version: process.env.LIPYUM_RELEASE_VERSION || "v12-k3",
  buildDate,
  branch,
  runtimePolicy: {
    default: "stable-legacy",
    vuePreview: "?engine=vue",
  },
  designContractVersion: "V12-K-STABLE-DESIGN-CONTRACT",
};

const publicDir = path.join(root, "public");
mkdirSync(publicDir, { recursive: true });
writeFileSync(path.join(publicDir, "release.json"), `${JSON.stringify(release, null, 2)}\n`, "utf8");
console.log(`[release] wrote public/release.json for ${gitSha}`);
