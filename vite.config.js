import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "lipyum-partner-design-studio";
const base = process.env.GITHUB_PAGES === "true" ? `/${repositoryName}/` : "/";

export default defineConfig({
  base,
  plugins: [vue()],
  server: {
    allowedHosts: true,
  },
});
