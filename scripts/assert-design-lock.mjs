import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];

function read(relativePath) {
  const fullPath = path.join(root, relativePath);
  if (!fs.existsSync(fullPath)) {
    failures.push(`missing required file: ${relativePath}`);
    return "";
  }
  return fs.readFileSync(fullPath, "utf8");
}

function requireIncludes(file, source, expected) {
  if (!source.includes(expected)) failures.push(`${file} must include ${JSON.stringify(expected)}`);
}

function forbidIncludes(file, source, forbidden) {
  if (source.includes(forbidden)) failures.push(`${file} must not include ${JSON.stringify(forbidden)}`);
}

const appJs = read("src/app.js");
requireIncludes("src/app.js", appJs, 'const useVueEngine = requestedEngine === "vue";');
requireIncludes("src/app.js", appJs, 'markRuntime("legacy")');
requireIncludes("src/app.js", appJs, 'import("./legacyApp.js")');
forbidIncludes("src/app.js", appJs, "const useLegacyEngine");

const appHeader = read("src/vue/components/ui/AppHeader.vue");
requireIncludes("AppHeader.vue", appHeader, "nav-alert-item");
requireIncludes("AppHeader.vue", appHeader, "nav-alert-copy");
requireIncludes("AppHeader.vue", appHeader, 'role="button"');
forbidIncludes("AppHeader.vue", appHeader, "nav-status-copy");

const profileMenu = read("src/vue/components/profile/ProfileMenuGrid.vue");
requireIncludes("ProfileMenuGrid.vue", profileMenu, "{{ item.label }}");
forbidIncludes("ProfileMenuGrid.vue", profileMenu, "shortLabel ||");

const appDrawer = read("src/vue/components/ui/AppDrawer.vue");
requireIncludes("AppDrawer.vue", appDrawer, "sheet partner-menu");
requireIncludes("AppDrawer.vue", appDrawer, "drawer-upgrade-banner");
forbidIncludes("AppDrawer.vue", appDrawer, "fixed inset-0");

const appShell = read("src/vue/layouts/AppShell.vue");
requireIncludes("AppShell.vue", appShell, "DrawerProfileCard");
requireIncludes("AppShell.vue", appShell, "DrawerMenuCard");
forbidIncludes("AppShell.vue", appShell, "v-drawer-menu__item");

const vueCss = read("src/vue/styles/vue.css");
requireIncludes("src/vue/styles/vue.css", vueCss, "grid-template-columns: repeat(5, minmax(0, 1fr));");
forbidIncludes("src/vue/styles/vue.css", vueCss, "grid-template-columns: 1fr 1fr 76px 1fr 1fr");

const stableDefaultSpec = read("tests/e2e/stable-design-default.spec.js");
requireIncludes("stable-design-default.spec.js", stableDefaultSpec, "normal URLs use the stable profile, sidebar and bottom bar design");
requireIncludes("stable-design-default.spec.js", stableDefaultSpec, "Vue preview keeps stable profile design");

const shellParitySpec = read("tests/e2e/stable-vue-shell-parity.spec.js");
requireIncludes("stable-vue-shell-parity.spec.js", shellParitySpec, "Vue preview bottom bar is centered and symmetric");
requireIncludes("stable-vue-shell-parity.spec.js", shellParitySpec, "Vue preview drawer uses stable Lipyum sidebar contract");
requireIncludes("stable-vue-shell-parity.spec.js", shellParitySpec, "Fotoğraflarım");

const contract = JSON.parse(read("STABLE_DESIGN_CONTRACT.json") || "{}");
for (const key of ["header", "bottomBar", "drawer", "profile"]) {
  if (!contract.surfaces?.[key]) failures.push(`STABLE_DESIGN_CONTRACT.json missing surface: ${key}`);
}

if (failures.length) {
  console.error("[design-lock] FAIL");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("[design-lock] PASS: stable design contract is protected.");
