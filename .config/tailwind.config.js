/** @type {import('tailwindcss').Config} */
export default {
  // The Vite root is `frontend/` so point Tailwind at the frontend files.
  // Paths are relative to this config file (.config/). Adjust accordingly.
  content: [
    "../frontend/index.html",
    "../frontend/**/*.{html,js,ts,jsx,tsx}",
    "../frontend/**/*.{css}",
    "../shared/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
