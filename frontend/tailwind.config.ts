import type { Config } from "tailwindcss"

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        headline: ['Manrope', 'Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        label: ['Inter', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        glow: "hsl(var(--glow))",
        "glow-muted": "hsl(var(--glow-muted))",

        /* ── Sentinel Extended Surface Tiers ── */
        surface: {
          DEFAULT: "hsl(var(--surface))",
          hover: "hsl(var(--surface-hover))",
          lowest: "hsl(var(--surface-lowest))",
          low: "hsl(var(--surface-low))",
          container: "hsl(var(--surface-container))",
          high: "hsl(var(--surface-high))",
          highest: "hsl(var(--surface-highest))",
          bright: "hsl(var(--surface-bright))",
        },

        /* ── Sentinel Status Colors ── */
        sentinel: {
          primary: "hsl(var(--sentinel-primary))",
          tertiary: "hsl(var(--sentinel-tertiary))",
          error: "hsl(var(--sentinel-error))",
          "error-container": "hsl(var(--sentinel-error-container))",
          "tertiary-container": "hsl(var(--sentinel-tertiary-container))",
          success: "hsl(var(--sentinel-success))",
        },

        /* ── Figma Token Direct Mappings ── */
        "on-surface": "hsl(225 85% 92%)",           /* #DAE2FD */
        "on-surface-variant": "hsl(240 3% 76%)",    /* #C6C6CD */
        "on-primary": "hsl(200 100% 15%)",           /* #00354A */
        "on-primary-container": "hsl(195 100% 37%)", /* #008ABB */
        "on-primary-fixed": "hsl(200 100% 8%)",      /* #001E2C */
        "primary-fixed-dim": "hsl(200 100% 74%)",    /* #7BD0FF */
        "primary-fixed": "hsl(200 100% 88%)",        /* #C4E7FF */
        "primary-container": "hsl(200 100% 8%)",     /* #001A27 */
        "secondary-snt": "hsl(216 30% 80%)",         /* #B7C8E1 */
        "secondary-container": "hsl(216 20% 30%)",   /* #3A4A5F */
        "on-secondary-container": "hsl(216 22% 74%)",/* #A9BAD3 */
        "tertiary-snt": "hsl(1 100% 85%)",           /* #FFB3B0 */
        "tertiary-container": "hsl(0 100% 11%)",     /* #390005 */
        "on-tertiary-container": "hsl(0 56% 59%)",   /* #D65759 */
        "error-snt": "hsl(6 100% 84%)",              /* #FFB4AB */
        "error-container": "hsl(0 100% 29%)",        /* #93000A */
        "on-error-container": "hsl(4 100% 92%)",     /* #FFDAD6 */
        "outline-variant": "hsl(230 5% 29%)",        /* #45464D */
        "outline-snt": "hsl(240 3% 57%)",            /* #909097 */
        "surface-tint": "hsl(200 100% 74%)",         /* #7BD0FF */

        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 2s infinite linear",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
