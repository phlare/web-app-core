import type { ReactNode } from "react";
import { render } from "@testing-library/react";
import {
  createMemoryHistory,
  createRootRouteWithContext,
  createRoute,
  createRouter,
  RouterProvider
} from "@tanstack/react-router";
import { AuthContext } from "../src/auth/AuthContext";
import type { AuthContextValue } from "../src/auth/AuthContext";
import { ApiClientContext } from "../src/lib/ApiClientContext";
import type { ApiClient } from "../src/lib/api-client";

const noOp = async () => {};

const defaultAuth: AuthContextValue = {
  user: null,
  accountId: null,
  role: null,
  isAuthenticated: false,
  isLoading: false,
  login: noOp,
  register: noOp,
  logout: noOp
};

export function renderWithProviders(ui: ReactNode) {
  return render(ui);
}

interface RenderWithRouterOptions {
  auth?: Partial<AuthContextValue>;
  initialPath?: string;
  apiClient?: ApiClient;
}

export function renderWithRouter(
  ui: ReactNode,
  options: RenderWithRouterOptions = {}
) {
  const auth: AuthContextValue = { ...defaultAuth, ...options.auth };

  const rootRoute = createRootRouteWithContext<{ auth: AuthContextValue }>()({
    component: () => ui
  });

  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/"
  });

  const router = createRouter({
    routeTree: rootRoute.addChildren([indexRoute]),
    context: { auth },
    history: createMemoryHistory({
      initialEntries: [options.initialPath ?? "/"]
    })
  });

  const mockApiClient = options.apiClient ?? ({} as ApiClient);

  return render(
    <ApiClientContext.Provider value={mockApiClient}>
      <AuthContext.Provider value={auth}>
        <RouterProvider router={router} />
      </AuthContext.Provider>
    </ApiClientContext.Provider>
  );
}
