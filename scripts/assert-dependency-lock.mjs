import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const packagePath = path.join(root, "package.json");
const lockPath = path.join(root, "package-lock.json");
const npmrcPath = path.join(root, ".npmrc");

const exactVersion = /^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/;
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const packageLock = JSON.parse(fs.readFileSync(lockPath, "utf8"));
const npmrc = fs.existsSync(npmrcPath) ? fs.readFileSync(npmrcPath, "utf8") : "";

const failures = [];

function checkSection(sectionName) {
  const section = packageJson[sectionName] || {};
  const lockSection = packageLock.packages?.[""]?.[sectionName] || {};

  for (const [name, version] of Object.entries(section)) {
    if (!exactVersion.test(version)) {
      failures.push(`${sectionName}.${name} must be exact, got ${version}`);
    }
    if (lockSection[name] !== version) {
      failures.push(`package-lock root ${sectionName}.${name} must match package.json (${version}), got ${lockSection[name]}`);
    }
    const installed = packageLock.packages?.[`node_modules/${name}`]?.version;
    if (!installed) {
      failures.push(`package-lock missing node_modules/${name}`);
    } else if (installed !== version) {
      failures.push(`package-lock node_modules/${name} version must be ${version}, got ${installed}`);
    }
  }
}

checkSection("dependencies");
checkSection("devDependencies");

if (!/^\s*save-exact\s*=\s*true\s*$/m.test(npmrc)) {
  failures.push(".npmrc must set save-exact=true");
}

if (!/^\s*package-lock\s*=\s*true\s*$/m.test(npmrc)) {
  failures.push(".npmrc must set package-lock=true");
}

if (failures.length) {
  console.error("[dependency-lock] FAIL");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("[dependency-lock] PASS: package versions are exact and lockfile is aligned.");
