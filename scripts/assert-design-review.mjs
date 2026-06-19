import { spawnSync } from "node:child_process";
import { DESIGN_OWNER, isDesignSensitivePath, normalizePath } from "./design-sensitive-paths.mjs";

const required = ["GITHUB_TOKEN", "GITHUB_REPOSITORY", "PR_NUMBER", "PR_HEAD_SHA"];
const apiVersion = "2022-11-28";

function git(args) {
  const result = spawnSync("git", args, { encoding: "utf8" });
  if (result.status !== 0) throw new Error(result.stderr || `git ${args.join(" ")} failed`);
  return result.stdout.trim();
}

function splitLines(value) {
  return value.split(/\r?\n/).filter(Boolean);
}

function env(name) {
  return process.env[name]?.trim() || "";
}

async function github(path) {
  const token = env("GITHUB_TOKEN");
  const response = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": apiVersion,
      "User-Agent": "lipyum-design-review-guard",
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub API ${response.status} for ${path}: ${body}`);
  }

  return response.json();
}

async function paginate(path) {
  const output = [];
  let page = 1;
  while (true) {
    const separator = path.includes("?") ? "&" : "?";
    const batch = await github(`${path}${separator}per_page=100&page=${page}`);
    output.push(...batch);
    if (batch.length < 100) return output;
    page += 1;
  }
}

function localChangedFiles() {
  const base = env("DESIGN_APPROVAL_BASE") || "HEAD^";
  const head = env("DESIGN_APPROVAL_HEAD") || "HEAD";
  try {
    return splitLines(git(["diff", "--name-only", `${base}..${head}`])).map(normalizePath);
  } catch {
    return splitLines(git(["diff", "--name-only", "--cached"])).map(normalizePath);
  }
}

async function prChangedFiles(repository, prNumber) {
  const files = await paginate(`/repos/${repository}/pulls/${prNumber}/files`);
  return files.map((file) => normalizePath(file.filename));
}

const missing = required.filter((name) => !env(name));
let changedFiles = [];

if (missing.length === required.length) {
  changedFiles = localChangedFiles();
  const sensitive = changedFiles.filter(isDesignSensitivePath);
  if (!sensitive.length) {
    console.log("[design-review] PASS: no design-sensitive files changed.");
    process.exit(0);
  }

  console.error("[design-review] FAIL: design-sensitive files changed, but GitHub PR review context is missing.");
  console.error(`Missing environment: ${required.join(", ")}`);
  for (const file of sensitive) console.error(`- ${file}`);
  process.exit(1);
}

if (missing.length) {
  console.error("[design-review] FAIL: incomplete GitHub PR review context.");
  console.error(`Missing environment: ${missing.join(", ")}`);
  process.exit(1);
}

const repository = env("GITHUB_REPOSITORY");
const prNumber = env("PR_NUMBER");
const expectedHead = env("PR_HEAD_SHA");

const pull = await github(`/repos/${repository}/pulls/${prNumber}`);
if (pull.state !== "open") {
  console.error(`[design-review] FAIL: PR #${prNumber} is not open.`);
  process.exit(1);
}

if (pull.head.sha !== expectedHead) {
  console.error("[design-review] FAIL: PR head SHA does not match the checked SHA.");
  console.error(`PR head: ${pull.head.sha}`);
  console.error(`Expected: ${expectedHead}`);
  process.exit(1);
}

changedFiles = await prChangedFiles(repository, prNumber);
const sensitiveChanged = changedFiles.filter(isDesignSensitivePath);

if (!sensitiveChanged.length) {
  console.log("[design-review] PASS: no design-sensitive files changed in PR.");
  process.exit(0);
}

const reviews = await paginate(`/repos/${repository}/pulls/${prNumber}/reviews`);
const approval = [...reviews]
  .reverse()
  .find((review) =>
    review.state === "APPROVED" &&
    review.user?.login === DESIGN_OWNER &&
    review.commit_id === expectedHead
  );

if (!approval) {
  console.error("[design-review] FAIL: current design-sensitive PR head is not approved by the required GitHub user.");
  console.error(`Required reviewer: ${DESIGN_OWNER}`);
  console.error(`Required head SHA: ${expectedHead}`);
  console.error("Design-sensitive files:");
  for (const file of sensitiveChanged) console.error(`- ${file}`);
  process.exit(1);
}

console.log(`[design-review] PASS: ${DESIGN_OWNER} approved current design-sensitive head ${expectedHead}.`);
