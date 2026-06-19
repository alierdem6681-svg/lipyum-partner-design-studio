import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const nodeBin = process.platform === "win32"
  ? path.join(root, "node_modules", "node", "bin", "node.exe")
  : path.join(root, "node_modules", "node", "bin", "node");

const roots = process.argv.slice(2);
const searchRoots = roots.length > 0 ? roots : ["src", "tests", "scripts"];

function collectJsFiles(dir, files = []) {
  if (!fs.existsSync(dir)) {
    return files;
  }

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === "dist" || entry.name === "test-results") {
      continue;
    }

    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectJsFiles(entryPath, files);
      continue;
    }

    if (entry.isFile() && /\.(c|m)?js$/.test(entry.name)) {
      files.push(entryPath);
    }
  }

  return files;
}

function runNodeCheck(file) {
  return new Promise((resolve, reject) => {
    const child = spawn(nodeBin, ["--check", file], {
      cwd: root,
      stdio: "inherit",
      env: process.env,
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`syntax check failed: ${path.relative(root, file)}`));
    });
  });
}

const files = searchRoots.flatMap((searchRoot) => collectJsFiles(path.join(root, searchRoot)));

for (const file of files) {
  await runNodeCheck(file);
}

console.log(`check passed: ${files.length} JS file(s) checked`);
