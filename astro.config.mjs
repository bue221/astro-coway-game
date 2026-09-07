import react from "@astrojs/react";
import { defineConfig } from "astro/config";

const site = process.env.PUBLIC_SITE?.trim();

export default defineConfig({
  ...(site ? { site } : {}),
  output: "static",
  integrations: [react()],
});
