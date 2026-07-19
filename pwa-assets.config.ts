import { defineConfig, minimalPreset } from "@vite-pwa/assets-generator/config";

export default defineConfig({
  preset: {
    ...minimalPreset,
    transparent: {
      ...minimalPreset.transparent,
      padding: 0,
      resizeOptions: { fit: "contain", background: "transparent" },
    },
    maskable: {
      sizes: [512],
      padding: 0,
      resizeOptions: { fit: "contain", background: "#6e2436" },
    },
    apple: {
      sizes: [180],
      padding: 0,
      resizeOptions: { fit: "contain", background: "#6e2436" },
    },
  },
  images: ["public/icon.svg"],
});
