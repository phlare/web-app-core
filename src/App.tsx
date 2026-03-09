import { useEffect, useMemo } from "react";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import type { ApiClient } from "./lib/api-client";
import type { TokenStorage } from "./lib/token-storage";
import { ApiClientContext } from "./lib/ApiClientContext";
import { AuthProvider } from "./auth/AuthProvider";
import { useAuth } from "./auth/useAuth";
import { routeTree } from "./routeTree.gen";

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createAppRouter>;
  }
}

const noOp = async () => {};

function createAppRouter() {
  return createRouter({
    routeTree,
    context: {
      auth: {
        user: null,
        accountId: null,
        role: null,
        isAuthenticated: false,
        isLoading: true,
        login: noOp,
        register: noOp,
        logout: noOp
      }
    },
    defaultPreload: "intent"
  });
}

interface AppProps {
  apiClient: ApiClient;
  tokenStorage: TokenStorage;
}

export function App({ apiClient, tokenStorage }: AppProps) {
  return (
    <ApiClientContext.Provider value={apiClient}>
      <AuthProvider apiClient={apiClient} tokenStorage={tokenStorage}>
        <InnerApp />
      </AuthProvider>
    </ApiClientContext.Provider>
  );
}

function InnerApp() {
  const auth = useAuth();
  const router = useMemo(() => createAppRouter(), []);

  useEffect(() => {
    void router.invalidate();
  }, [router, auth.isAuthenticated, auth.isLoading]);

  return <RouterProvider router={router} context={{ auth }} />;
}
