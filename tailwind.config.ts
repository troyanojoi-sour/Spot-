import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#080a25",
        night: "#10123a",
        violet: "#7628ef",
        grape: "#4b1bb1",
        amber: "#ffc466",
        cream: "#f6f1e8",
        spot: {
          primary: "#7628ef",      // Violeta
          secondary: "#ffc466",    // Ámbar/Oro
          dark: "#080a25",         // Ink
          success: "#10b981",      // Esmeralda/Éxito
          info: "#3b82f6",         // Azul/Precisión de ubicación
          gray: "#9ca3af",         // Gris
        }
      },
      boxShadow: {
        soft: "0 24px 60px rgba(13, 12, 42, 0.22)",
        glow: "0 18px 36px rgba(118, 40, 239, 0.28)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
