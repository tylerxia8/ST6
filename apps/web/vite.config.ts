import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "st6_weekly_commitments",
      filename: "remoteEntry.js",
      exposes: {
        "./WeeklyCommitments": "./src/remote/WeeklyCommitmentsRemote.tsx"
      },
      shared: ["react", "react-dom", "@reduxjs/toolkit", "react-redux"]
    })
  ],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true
      }
    }
  },
  preview: {
    port: 4173
  },
  build: {
    target: "esnext",
    cssCodeSplit: false
  }
});
