import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { App } from "../src/App";
import { ApiClient } from "../src/lib/api-client";
import { TokenStorage } from "../src/lib/token-storage";
import { Logger } from "../src/lib/logger";

function buildTestClient(): ApiClient {
  return new ApiClient(
    "http://localhost:4000",
    new TokenStorage(),
    new Logger("silent")
  );
}

describe("App", () => {
  it("renders the heading and API URL", () => {
    render(
      <App apiBaseUrl="http://localhost:4000" apiClient={buildTestClient()} />
    );
    expect(screen.getByText("web-app-core")).toBeInTheDocument();
    expect(screen.getByText(/localhost:4000/)).toBeInTheDocument();
  });
});
