/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0f0f0f',
        'dark-panel': '#1a1a1a',
        'dark-border': '#2a2a2a',
        'accent': '#6366f1',
      },
    },
  },
  plugins: [],
}
