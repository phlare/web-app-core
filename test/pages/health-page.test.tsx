import { describe, expect, it } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { server } from "../mocks/server";
import { renderWithRouter } from "../helpers";
import { HealthPage } from "../../src/pages/HealthPage";
import { ApiClient } from "../../src/lib/api-client";
import { TokenStorage } from "../../src/lib/token-storage";
import { Logger } from "../../src/lib/logger";

function buildApiClient() {
  return new ApiClient(
    "http://localhost:4000",
    new TokenStorage(),
    new Logger("silent")
  );
}

describe("HealthPage", () => {
  it("shows healthy status when API responds", async () => {
    const apiClient = buildApiClient();

    renderWithRouter(<HealthPage />, {
      auth: { isAuthenticated: true },
      apiClient
    });

    await waitFor(() => {
      expect(screen.getByText(/Healthy/)).toBeInTheDocument();
    });
  });

  it("shows unhealthy status when API fails", async () => {
    server.use(
      http.get("http://localhost:4000/healthz", () => {
        return HttpResponse.error();
      })
    );

    const apiClient = buildApiClient();

    renderWithRouter(<HealthPage />, {
      auth: { isAuthenticated: true },
      apiClient
    });

    await waitFor(() => {
      expect(screen.getByText(/Could not reach/)).toBeInTheDocument();
    });
  });
});
