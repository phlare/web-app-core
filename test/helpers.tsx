import type { ReactNode } from "react";
import { render } from "@testing-library/react";
import {
  createMemoryHistory,
  createRootRouteWithContext,
  createRoute,
  createRouter,
  RouterProvider
} from "@tanstack/react-router";
import { ToastProvider } from "../src/components/Toast";
import { AuthContext } from "../src/auth/AuthContext";
import type { AuthContextValue } from "../src/auth/AuthContext";

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
  return render(<ToastProvider>{ui}</ToastProvider>);
}

interface RenderWithRouterOptions {
  auth?: Partial<AuthContextValue>;
  initialPath?: string;
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

  return render(
    <AuthContext.Provider value={auth}>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </AuthContext.Provider>
  );
}
