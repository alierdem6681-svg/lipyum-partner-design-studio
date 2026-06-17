/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.js",
    "./src/**/*.html",
  ],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Text",
          "SF Pro Display",
          "Roboto",
          "Inter",
          "Noto Sans",
          "Segoe UI",
          "sans-serif",
        ],
      },
      colors: {
        primary: {
          DEFAULT: "#12B76A",
          dark: "#079455",
          soft: "#ECFDF5",
          border: "#BBF7D0",
        },
        info: {
          DEFAULT: "#175CD3",
          soft: "#EFF6FF",
          border: "#BFDBFE",
        },
        warning: {
          DEFAULT: "#F59E0B",
          soft: "#FFFBEB",
          border: "#FDE68A",
        },
        danger: {
          DEFAULT: "#D92D20",
          soft: "#FEF2F2",
          border: "#FECACA",
        },
        neutral: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
        },
      },
      boxShadow: {
        soft: "0 8px 20px rgba(16, 24, 40, 0.06)",
        card: "0 10px 28px rgba(15, 23, 42, 0.08)",
        cta: "0 10px 24px rgba(0, 122, 61, 0.30)",
      },
      borderRadius: {
        card: "16px",
        xl2: "20px",
      },
    },
  },
};
