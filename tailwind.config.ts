import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#172026",
        moss: "#547A5E",
        coral: "#D96C4F",
        cloud: "#F6F7F3",
        line: "#D9DED6"
      },
      boxShadow: {
        soft: "0 16px 40px rgba(23, 32, 38, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
