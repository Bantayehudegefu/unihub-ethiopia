import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "neon-blue": "#00d4ff",
        "neon-purple": "#b347ea",
        dark: "#0b0f19",
        surface: "#141821",
        glass: "rgba(255,255,255,0.05)",
      },
      backgroundImage: {
        "gradient-glow": "radial-gradient(circle at 50% 0%, #1e2a4a, #0b0f19)",
      },
    },
  },
  plugins: [],
};
export default config;