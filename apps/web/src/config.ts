export const apiMode = import.meta.env.VITE_API_MODE === "api" ? "api" : "mock";

export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api";

export const demoOwnerId = import.meta.env.VITE_DEMO_OWNER_ID ?? "u-ava";

export const demoManagerId = import.meta.env.VITE_DEMO_MANAGER_ID ?? "u-morgan";

export const demoWeekStart = import.meta.env.VITE_DEMO_WEEK_START ?? "2026-06-22";

export const authToken = import.meta.env.VITE_AUTH_TOKEN;
