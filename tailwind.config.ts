import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        portal: {
          dark: "#0c0a09",
          card: "#1c1917",
          accent: "#ea580c",
          accent2: "#dc2626",
        },
      },
      boxShadow: {
        portal: "0 25px 50px -12px rgb(0 0 0 / 0.5)",
      },
    },
  },
  plugins: [],
};

export default config;
