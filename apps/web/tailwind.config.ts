import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          default: "#F1EFE5",
          secondary: "#FFFFFF",
          tone: "#E6E3D6",
          avatar: "#E0E0E0",
        },
        typo: {
          primary: "#000",
          secondary: "#333",
          social: "#5B75A6",
          time: "#6E664E",
        },
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
} satisfies Config;
