import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { EnvSchema } from "./config/env";
import { App } from "./App";
import "./index.css";

const env = EnvSchema.parse({
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App apiBaseUrl={env.VITE_API_BASE_URL} />
  </StrictMode>
);
