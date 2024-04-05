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
        background: '#edece4', // custom background color
      },
      fontFamily: {
        marydale: ['marydale', 'sans-serif'],
        subway: ['Subway Berlin SC', 'sans-serif'],
        helvetica: ['Helvetica Neue', 'sans-serif'],
        john: ['John-Doe', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
