import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { App } from "../src/App";
import { ApiClient } from "../src/lib/api-client";
import { TokenStorage } from "../src/lib/token-storage";
import { Logger } from "../src/lib/logger";
import { server } from "./mocks/server";

const BASE_URL = "http://localhost:4000";

function buildTestDeps(): { apiClient: ApiClient; tokenStorage: TokenStorage } {
  const tokenStorage = new TokenStorage();
  const apiClient = new ApiClient(
    BASE_URL,
    tokenStorage,
    new Logger("silent")
  );
  return { apiClient, tokenStorage };
}

describe("App", () => {
  it("renders the login page when unauthenticated", async () => {
    server.use(
      http.post(`${BASE_URL}/api/v1/auth/refresh`, () => {
        return HttpResponse.json(
          { error: { code: "INVALID_TOKEN", message: "No session", details: {} } },
          { status: 401 }
        );
      })
    );

    const { apiClient, tokenStorage } = buildTestDeps();
    render(<App apiClient={apiClient} tokenStorage={tokenStorage} />);
    await waitFor(() => {
      expect(
        screen.getByText("Enter your credentials to continue")
      ).toBeInTheDocument();
    });
  });
});
