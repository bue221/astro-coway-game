import react from "@astrojs/react";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: process.env.PUBLIC_SITE,
  integrations: [react()],
});
