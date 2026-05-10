import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import VueDevTools from "vite-plugin-vue-devtools";

export default defineConfig({
  plugins: [
    tailwindcss(),
    vue(),
    VueDevTools(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["apple-touch-icon.svg"],
      manifest: {
        name: "rpg-player-helper",
        short_name: "RPG Helper",
        description: "Compagnon de personnage JDR mobile-first en local.",
        theme_color: "#16100d",
        background_color: "#110c09",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/pwa-192.svg",
            sizes: "192x192",
            type: "image/svg+xml",
          },
          {
            src: "/pwa-512.svg",
            sizes: "512x512",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
          {
            src: "/apple-touch-icon.svg",
            sizes: "180x180",
            type: "image/svg+xml",
          },
        ],
      },
    }),
  ],
});
