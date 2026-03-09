import { describe, expect, it } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderWithRouter } from "../helpers";
import { AppShell } from "../../src/components/AppShell";

describe("AppShell", () => {
  const authenticatedAuth = {
    user: { id: "u-001", email: "test@example.com", display_name: "Test" },
    accountId: "a-001",
    role: "owner" as const,
    isAuthenticated: true
  };

  it("renders sidebar navigation and content", async () => {
    renderWithRouter(<AppShell>Page content</AppShell>, {
      auth: authenticatedAuth
    });

    await waitFor(() => {
      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("Health")).toBeInTheDocument();
      expect(screen.getByText("Page content")).toBeInTheDocument();
    });
  });

  it("shows user info in sidebar footer", async () => {
    renderWithRouter(<AppShell>Content</AppShell>, {
      auth: authenticatedAuth
    });

    await waitFor(() => {
      expect(screen.getByText("Test")).toBeInTheDocument();
    });
  });
});
