import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { AuthContextValue } from "../auth/useAuth";
import { useAuth } from "../auth/useAuth";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { ToastProvider } from "../components/Toast";
import { SplashScreen } from "../pages/SplashScreen";

interface RouterContext {
  auth: AuthContextValue;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout
});

function RootLayout() {
  const { isLoading } = useAuth();

  return (
    <ErrorBoundary>
      <ToastProvider>{isLoading ? <SplashScreen /> : <Outlet />}</ToastProvider>
    </ErrorBoundary>
  );
}
