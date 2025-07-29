/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", 
    "./src/**/*.{js,ts,jsx,tsx}", 
    "./components/**/*.{js,ts,jsx,tsx}",
    "*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    screens: {
      xs: "480px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
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
        cream: {
          DEFAULT: "#fdf4ec",
          light: "#fdf4ec",
        },
        dark: "#262626",
        beach: {
          light: "#d0e1f2",
          DEFAULT: "#d0e1f2",
          dark: "#a3c2e0",
          darker: "#7ba3c9",
        },
        ocean: {
          DEFAULT: "#0077b6",
          light: "#0096c7",
          dark: "#023e8a",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
      },
      letterSpacing: {
        wider: "0.05em",
        widest: "0.1em",
      },
      lineHeight: {
        tighter: "1.1",
        tight: "1.25",
        snug: "1.375",
        normal: "1.5",
        relaxed: "1.625",
        loose: "2",
      },
      keyframes: {
        wave: {
          "0%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(-10px)" },
          "100%": { transform: "translateX(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        wave: "wave 3s ease-in-out infinite",
        fadeIn: "fadeIn 0.5s ease-in-out",
        shimmer: "shimmer 2s linear infinite",
      },
      backgroundImage: {
        "beach-gradient": "linear-gradient(to right, #d0e1f2, #a3c2e0)",
        "wave-pattern":
          "url(\"data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 C30 0, 70 0, 100 10 C70 20, 30 20, 0 10z' fill='%23d0e1f2' /%3E%3C/svg%3E\")",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "65ch",
            color: "var(--tw-prose-body)",
            lineHeight: (theme) => theme("lineHeight.relaxed"),
            p: {
              marginTop: "1.25em",
              marginBottom: "1.25em",
            },
            '[class~="lead"]': {
              fontSize: (theme) => theme("fontSize.xl")[0],
              lineHeight: (theme) => theme("lineHeight.snug"),
            },
            h1: {
              fontSize: (theme) => theme("fontSize.4xl")[0],
              lineHeight: (theme) => theme("lineHeight.tight"),
              marginBottom: "0.75em",
            },
            h2: {
              fontSize: (theme) => theme("fontSize.2xl")[0],
              lineHeight: (theme) => theme("lineHeight.tight"),
              marginTop: "1.5em",
              marginBottom: "0.5em",
            },
            h3: {
              fontSize: (theme) => theme("fontSize.xl")[0],
              lineHeight: (theme) => theme("lineHeight.snug"),
              marginTop: "1.5em",
              marginBottom: "0.5em",
            },
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
