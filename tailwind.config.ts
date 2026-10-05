import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "gradient-nusa": "linear-gradient(#1c2d44, #101e2b)",
        "dark-orange": "#d44f53",
        "nusa-pink": "#FF3E9D"
      },
      fontFamily: {
        "space-grotesk": [ "var(--font-space-grotesk)" ],
        "archivo-black": [ "var(--font-archivo-black)" ],
        "space-mono": [ "var(--font-space-mono)" ],
        "public-sans": [ "var(--font-public-sans)" ],
        "bricolage": [ "var(--font-bricolage)" ],
      }
    },
  },
  plugins: [],
}
export default config
