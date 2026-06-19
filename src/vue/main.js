import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./router/index.js";
import "./styles/vue.css";

const root = document.getElementById("app");

if (!root) {
  throw new Error("Lipyum Partner root container (#app) bulunamadı.");
}

const app = createApp(App);

app.config.errorHandler = (error) => {
  console.error("[Lipyum Vue]", error);
};

app.use(createPinia());
app.use(router);
app.mount(root);

window.__LIPYUM_VUE_ROOT__ = true;
