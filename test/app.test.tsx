import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { App } from "../src/App";
import { ApiClient } from "../src/lib/api-client";
import { TokenStorage } from "../src/lib/token-storage";
import { Logger } from "../src/lib/logger";

function buildTestDeps(): { apiClient: ApiClient; tokenStorage: TokenStorage } {
  const tokenStorage = new TokenStorage();
  const apiClient = new ApiClient(
    "http://localhost:4000",
    tokenStorage,
    new Logger("silent")
  );
  return { apiClient, tokenStorage };
}

describe("App", () => {
  it("renders the login page when unauthenticated", async () => {
    const { apiClient, tokenStorage } = buildTestDeps();
    render(<App apiClient={apiClient} tokenStorage={tokenStorage} />);
    await waitFor(() => {
      expect(
        screen.getByText("Enter your credentials to continue")
      ).toBeInTheDocument();
    });
  });
});
