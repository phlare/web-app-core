import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppShell } from "../components/AppShell";

export const Route = createFileRoute("/_app")({
  beforeLoad: ({ context }) => {
    if (!context.auth.isLoading && !context.auth.isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
  component: AppLayout
});

function AppLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
