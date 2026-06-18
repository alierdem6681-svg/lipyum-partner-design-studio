const params = new URLSearchParams(window.location.search);
const useVueEngine = params.get("engine") === "vue";

if (useVueEngine) {
  import("./vue/main.js").then(({ mountVueApp }) => mountVueApp());
} else {
  import("./legacyApp.js");
}
