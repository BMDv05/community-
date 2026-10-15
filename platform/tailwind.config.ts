import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Double H Community palette
        deep: "#12393a",   // darkest teal — primary brand
        pine: "#134c4b",   // primary teal
        mist: "#e6ecec",   // light background
        sage: "#46766f",   // muted teal — secondary / accents
        ink: "#161919",    // near-black text
        // type badge colors (tinted to harmonize with brand, AA contrast)
        type: {
          workshop: "#134c4b",
          event: "#46766f",
          lecture: "#12393a",
          fieldtrip: "#134c4b",
        },
      },
      fontFamily: {
        sans: ["Poppins", "Segoe UI", "Tahoma", "Arial", "sans-serif"],
        arabic: ["Segoe UI", "Tahoma", "Cairo", "Amiri", "Arial", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        card: "0 8px 30px -12px rgba(18,57,58,.35)",
        lift: "0 16px 40px -16px rgba(18,57,58,.45)",
      },
    },
  },
  plugins: [],
};

export default config;
