import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider
} from "@tanstack/react-router";
import { AuthContext } from "../../src/auth/AuthContext";
import type { AuthContextValue } from "../../src/auth/AuthContext";
import { LoginPage } from "../../src/pages/LoginPage";

const noOp = async () => {};

describe("LoginPage", () => {
  it("calls login and navigates on submit", async () => {
    const loginFn = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    const auth: AuthContextValue = {
      user: null,
      accountId: null,
      role: null,
      isAuthenticated: false,
      isLoading: false,
      login: loginFn,
      register: noOp,
      logout: noOp
    };

    const rootRoute = createRootRoute({ component: LoginPage });
    const indexRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: "/"
    });

    const router = createRouter({
      routeTree: rootRoute.addChildren([indexRoute]),
      history: createMemoryHistory({ initialEntries: ["/"] })
    });

    render(
      <AuthContext.Provider value={auth}>
        <RouterProvider router={router} />
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "secret123");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() => {
      expect(loginFn).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "secret123"
      });
    });
  });
});
