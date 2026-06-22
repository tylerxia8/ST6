import flowbite from "flowbite/plugin";
import type { Config } from "tailwindcss";

export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
    "../../node_modules/flowbite-react/lib/esm/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#172026",
        moss: "#4f6f52",
        copper: "#b56b45",
        cloud: "#f6f8f9"
      }
    }
  },
  plugins: [flowbite]
} satisfies Config;
