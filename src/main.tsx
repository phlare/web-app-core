import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { EnvSchema } from "./config/env";
import { TokenStorage } from "./lib/token-storage";
import { Logger } from "./lib/logger";
import { ApiClient } from "./lib/api-client";
import { App } from "./App";
import "./index.css";

const env = EnvSchema.parse({
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL
});

const tokenStorage = new TokenStorage();
const logger = new Logger(import.meta.env.DEV ? "debug" : "warn");
const apiClient = new ApiClient(env.VITE_API_BASE_URL, tokenStorage, logger);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App apiClient={apiClient} tokenStorage={tokenStorage} />
  </StrictMode>
);
