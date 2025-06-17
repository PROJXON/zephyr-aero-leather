/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "var(--border)",
        primary: "var(--primary)",
        'neutral-dark': "var(--neutral-dark)",
        'neutral-medium': "var(--neutral-medium)",
        'neutral-light': "var(--neutral-light)",
      },
    },
  },
  plugins: [],
};

export default config;
