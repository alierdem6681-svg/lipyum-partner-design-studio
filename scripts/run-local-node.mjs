import { existsSync } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const localNode = process.platform === "win32"
  ? path.join(root, "node_modules", "node", "bin", "node.exe")
  : path.join(root, "node_modules", "node", "bin", "node");

const nodeBin = existsSync(localNode) ? localNode : process.execPath;
const args = process.argv.slice(2);

if (!args.length) {
  console.error("[run-local-node] Missing script path.");
  process.exit(1);
}

const child = spawn(nodeBin, args, {
  cwd: root,
  stdio: "inherit",
  shell: false,
});

child.on("error", (error) => {
  console.error("[run-local-node] Failed to start local Node:", error);
  process.exit(1);
});

child.on("exit", (code, signal) => {
  if (signal) {
    console.error(`[run-local-node] Interrupted by ${signal}`);
    process.exit(1);
  }
  process.exit(code ?? 1);
});
