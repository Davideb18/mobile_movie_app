/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", `./components/**/*.{js,jsx,ts,tsx}`],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Deep Minimalist Dark Theme
        background: "#000000",
        surface: "#111111", // Very dark gray for cards
        surfaceLight: "#1A1A1A", // Lighter gray for inputs/borders

        // Text
        text: "#FFFFFF",
        textMuted: "#888888",

        // Accents
        primary: "#FFFFFF", // Use white as primary high-contrast element
        accent: "#6366f1", // Still keep a vibrant indigo for special actions if needed
        primaryDark: "#1A1A1A", // Just in case existing primary classes need it

        glass: {
          border: "rgba(255, 255, 255, 0.08)",
          bg: "rgba(20, 20, 20, 0.7)",
        },
      },
    },
  },
  plugins: [],
};
