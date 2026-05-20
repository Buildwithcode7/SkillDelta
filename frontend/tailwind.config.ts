import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        }
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(91, 141, 255, 0.22), 0 18px 70px rgba(91, 141, 255, 0.16)",
        violet: "0 0 0 1px rgba(168, 85, 247, 0.25), 0 18px 60px rgba(168, 85, 247, 0.14)"
      },
      backgroundImage: {
        "radial-grid": "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.12) 1px, transparent 0)",
        "premium-line": "linear-gradient(135deg, rgba(37,99,235,0.22), rgba(168,85,247,0.22) 45%, rgba(14,165,233,0.14))"
      },
      animation: {
        "float-slow": "float 7s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2.8s ease-in-out infinite",
        marquee: "marquee 26s linear infinite",
        "marquee-reverse": "marqueeReverse 28s linear infinite"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" }
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.58" },
          "50%": { opacity: "1" }
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" }
        },
        marqueeReverse: {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" }
        }
      }
    }
  },
  plugins: []
};

export default config;
