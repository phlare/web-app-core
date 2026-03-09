import { createFileRoute, redirect } from "@tanstack/react-router";
import { HomePage } from "../pages/HomePage";

export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => {
    if (!context.auth.isLoading && !context.auth.isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
  component: HomePage
});
