/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Manrope", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        slateBg: "#F5F7FB",
        ink: "#0F172A",
        muted: "#64748B",
        borderSoft: "#E2E8F0",
        brand: {
          50: "#EEF2FF",
          100: "#E0E7FF",
          500: "#6366F1",
          600: "#4F46E5",
          700: "#4338CA"
        },
        violetAccent: "#7C3AED"
      },
      boxShadow: {
        card: "0 12px 36px rgba(15, 23, 42, 0.08)",
        glow: "0 14px 40px rgba(79, 70, 229, 0.25)"
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
        "hero-gradient": "radial-gradient(circle at top left, rgba(99,102,241,.25), rgba(124,58,237,.12) 45%, rgba(245,247,251,.75) 80%)"
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(12px)" },
          "100%": { opacity: 1, transform: "translateY(0)" }
        }
      },
      animation: {
        fadeUp: "fadeUp .35s ease-out"
      }
    }
  },
  plugins: []
};
