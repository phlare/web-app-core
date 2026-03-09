import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import {
  createMemoryHistory,
  createRootRouteWithContext,
  createRoute,
  createRouter,
  Outlet,
  redirect,
  RouterProvider
} from "@tanstack/react-router";
import { AuthContext } from "../../src/auth/AuthContext";
import type { AuthContextValue } from "../../src/auth/AuthContext";

const noOp = async () => {};

function buildAuth(
  overrides: Partial<AuthContextValue> = {}
): AuthContextValue {
  return {
    user: null,
    accountId: null,
    role: null,
    isAuthenticated: false,
    isLoading: false,
    login: noOp,
    register: noOp,
    logout: noOp,
    ...overrides
  };
}

function buildTestRouter(auth: AuthContextValue, initialPath: string) {
  const rootRoute = createRootRouteWithContext<{ auth: AuthContextValue }>()({
    component: Outlet
  });

  const homeRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    beforeLoad: ({ context }) => {
      if (!context.auth.isLoading && !context.auth.isAuthenticated) {
        throw redirect({ to: "/login" });
      }
    },
    component: () => <div>home</div>
  });

  const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/login",
    beforeLoad: ({ context }) => {
      if (!context.auth.isLoading && context.auth.isAuthenticated) {
        throw redirect({ to: "/" });
      }
    },
    component: () => <div>login</div>
  });

  return createRouter({
    routeTree: rootRoute.addChildren([homeRoute, loginRoute]),
    context: { auth },
    history: createMemoryHistory({ initialEntries: [initialPath] })
  });
}

describe("Route guards", () => {
  it("redirects unauthenticated user from / to /login", async () => {
    const auth = buildAuth();
    const router = buildTestRouter(auth, "/");

    render(
      <AuthContext.Provider value={auth}>
        <RouterProvider router={router} />
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("login")).toBeInTheDocument();
    });
  });

  it("redirects authenticated user from /login to /", async () => {
    const auth = buildAuth({
      user: { id: "u-001", email: "test@example.com", display_name: "Test" },
      accountId: "a-001",
      role: "owner",
      isAuthenticated: true
    });
    const router = buildTestRouter(auth, "/login");

    render(
      <AuthContext.Provider value={auth}>
        <RouterProvider router={router} />
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("home")).toBeInTheDocument();
    });
  });
});
