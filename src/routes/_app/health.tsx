import { createFileRoute } from "@tanstack/react-router";
import { HealthPage } from "../../pages/HealthPage";

export const Route = createFileRoute("/_app/health")({
  component: HealthPage
});
