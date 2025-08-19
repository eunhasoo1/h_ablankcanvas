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
        background: '#ffffff', // custom background color
      },
      fontFamily: {
        marydale: ['marydale', 'sans-serif'],
        subway: ['Subway Berlin SC', 'sans-serif'],
        helvetica: ['Helvetica Neue', 'sans-serif'],
        john: ['John-Doe', 'sans-serif'],
      },
      fontSize: {
        xxxs: '0.4rem',
        xxs: '0.5rem'
      },
      animation: {
        'caret-blink': 'caret-blink 1.2s ease-out infinite',
      },
      keyframes: {
        'caret-blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
