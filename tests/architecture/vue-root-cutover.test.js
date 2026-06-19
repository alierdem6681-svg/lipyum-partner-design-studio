import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const appSource = readFileSync("src/app.js", "utf8");
const mainSource = readFileSync("src/vue/main.js", "utf8");
const shellSource = readFileSync("src/vue/App.vue", "utf8");

assert.match(appSource, /import\s+["']\.\/vue\/main\.js["']/, "src/app.js must boot the Vue root");
assert.match(mainSource, /createApp\(App\)/, "Vue main must create the root App");
assert.match(mainSource, /createPinia\(\)/, "Vue root must install Pinia");
assert.match(mainSource, /app\.use\(router\)/, "Vue root must install Vue Router");
assert.match(mainSource, /window\.__LIPYUM_VUE_ROOT__\s*=\s*true/, "Vue root marker must be exposed for smoke tests");
assert.match(shellSource, /<RouterView\s*\/>/, "App shell must own RouterView");
assert.match(shellSource, /<AppHeader/, "App shell must own global AppHeader");
assert.match(shellSource, /<AppBottomBar/, "App shell must own global AppBottomBar");
assert.match(shellSource, /<AppDrawer/, "App shell must own global AppDrawer");
