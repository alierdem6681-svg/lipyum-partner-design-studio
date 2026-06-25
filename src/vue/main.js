import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router/index.js";
import App from "./App.vue";
import "./styles/vue.css";
import "./styles/score-badge-advantages.css";

export function mountVueApp(root = document.getElementById("app")) {
  if (!root) return null;
  const app = createApp(App);
  app.use(createPinia());
  app.use(router);
  app.mount(root);
  return app;
}
