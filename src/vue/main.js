import { createApp } from "vue";
import { createPinia } from "pinia";
import { resolveVuePage } from "./router/routes.js";
import router from "./router/index.js";
import App from "./App.vue";
import "./styles/vue.css";

const mountedIslands = new WeakMap();

export function mountVueIslands(root = document, context = {}) {
  const islands = Array.from(root.querySelectorAll("[data-vue-island]"));

  islands.forEach((node) => {
    if (mountedIslands.has(node)) return;

    const componentName = node.dataset.vueIsland || "ui-kit";
    const Component = resolveVuePage(componentName);
    const app = createApp(Component, {
      currentRoute: context.currentRoute || `/${componentName}`,
      navigateTo: context.navigateTo || window.navigateToPage,
    });

    app.mount(node);
    mountedIslands.set(node, app);
  });
}

export function mountVueApp(root = document.getElementById("app")) {
  if (!root) return null;
  const app = createApp(App);
  app.use(createPinia());
  app.use(router);
  app.mount(root);
  return app;
}

export default mountVueIslands;
