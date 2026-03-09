import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { AuthContextValue } from "../auth/useAuth";
import { useAuth } from "../auth/useAuth";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { Toaster } from "../components/ui/sonner";
import { SplashScreen } from "../pages/SplashScreen";
import { NotFoundPage } from "../pages/NotFoundPage";

interface RouterContext {
  auth: AuthContextValue;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
  notFoundComponent: NotFoundPage
});

function RootLayout() {
  const { isLoading } = useAuth();

  return (
    <ErrorBoundary>
      {isLoading ? <SplashScreen /> : <Outlet />}
      <Toaster />
    </ErrorBoundary>
  );
}
