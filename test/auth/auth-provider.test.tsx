import { describe, expect, it, beforeEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { server } from "../mocks/server";
import { AuthProvider } from "../../src/auth/AuthProvider";
import { useAuth } from "../../src/auth/useAuth";
import { ApiClient } from "../../src/lib/api-client";
import { TokenStorage } from "../../src/lib/token-storage";
import { Logger } from "../../src/lib/logger";

const BASE_URL = "http://localhost:4000";

function buildDeps(): { apiClient: ApiClient; tokenStorage: TokenStorage } {
  const tokenStorage = new TokenStorage();
  const apiClient = new ApiClient(BASE_URL, tokenStorage, new Logger("silent"));
  return { apiClient, tokenStorage };
}

function AuthStatus() {
  const { user, isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div>loading</div>;
  if (isAuthenticated) return <div>authenticated:{user?.email}</div>;
  return <div>unauthenticated</div>;
}

function LoginButton() {
  const { login } = useAuth();
  return (
    <button
      onClick={() =>
        void login({ email: "test@example.com", password: "pass" })
      }
    >
      login
    </button>
  );
}

function LogoutButton() {
  const { logout } = useAuth();
  return <button onClick={() => void logout()}>logout</button>;
}

describe("AuthProvider", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("bootstraps session from refresh token", async () => {
    const { apiClient, tokenStorage } = buildDeps();
    tokenStorage.setRefreshToken("valid-refresh");

    render(
      <AuthProvider apiClient={apiClient} tokenStorage={tokenStorage}>
        <AuthStatus />
      </AuthProvider>
    );

    expect(screen.getByText("loading")).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText(/authenticated:test@example.com/)
      ).toBeInTheDocument();
    });
  });

  it("handles failed bootstrap by clearing tokens", async () => {
    const { apiClient, tokenStorage } = buildDeps();
    tokenStorage.setRefreshToken("bad-refresh");

    server.use(
      http.post(`${BASE_URL}/api/v1/auth/refresh`, () => {
        return HttpResponse.json(
          {
            error: { code: "INVALID_TOKEN", message: "Bad token", details: {} }
          },
          { status: 401 }
        );
      })
    );

    render(
      <AuthProvider apiClient={apiClient} tokenStorage={tokenStorage}>
        <AuthStatus />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("unauthenticated")).toBeInTheDocument();
    });
    expect(tokenStorage.getRefreshToken()).toBeNull();
  });

  it("sets user state after login", async () => {
    const { apiClient, tokenStorage } = buildDeps();

    render(
      <AuthProvider apiClient={apiClient} tokenStorage={tokenStorage}>
        <AuthStatus />
        <LoginButton />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("unauthenticated")).toBeInTheDocument();
    });

    await act(async () => {
      screen.getByText("login").click();
    });

    await waitFor(() => {
      expect(
        screen.getByText(/authenticated:test@example.com/)
      ).toBeInTheDocument();
    });
  });

  it("clears user state after logout", async () => {
    const { apiClient, tokenStorage } = buildDeps();
    tokenStorage.setRefreshToken("valid-refresh");

    render(
      <AuthProvider apiClient={apiClient} tokenStorage={tokenStorage}>
        <AuthStatus />
        <LogoutButton />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/authenticated/)).toBeInTheDocument();
    });

    await act(async () => {
      screen.getByText("logout").click();
    });

    await waitFor(() => {
      expect(screen.getByText("unauthenticated")).toBeInTheDocument();
    });
  });
});
