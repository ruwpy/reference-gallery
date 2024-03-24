import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    fontFamily: {
      inter: "var(--font-inter)",
      ibm: "var(--font-ibm)",
    },
  },
  plugins: [],
};
export default config;
