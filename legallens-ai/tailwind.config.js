/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F8F9FA",
        surface: "#FFFFFF",
        "surface-subtle": "#F1F3F5",
        "surface-dark": "#121316",
        border: "#E9ECEF",
        "border-dark": "#2B2D31",
        "text-primary": "#121316",
        "text-secondary": "#6C757D",
        "text-muted": "#ADB5BD",
        "text-inverse": "#FFFFFF",
        accent: {
          critical: "#D9381E",
          moderate: "#E67E22",
          verified: "#27AE60",
          info: "#2F80ED",
        }
      },
      fontFamily: {
        sans: ["Geist", "Inter", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
        mono: ["Geist Mono", "JetBrains Mono", "monospace"],
      },
      borderRadius: {
        none: "0px",
        sm: "2px",
        DEFAULT: "4px",
        md: "6px",
        lg: "8px",
        full: "9999px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.05)",
        elevated: "0 4px 12px rgba(0,0,0,0.08)",
        modal: "0 12px 32px rgba(0,0,0,0.12)",
      }
    },
  },
  plugins: [],
}
