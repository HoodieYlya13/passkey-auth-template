import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      screens: {
        xs: "24rem",
        md: "54rem",
      },
      minHeight: {
        fullscreen: "calc(100dvh - var(--nav-height))",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
