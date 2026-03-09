import { useCallback, useEffect, useState } from "react";
import { useApiClient } from "../lib/useApiClient";
import type { HealthResponse } from "../lib/api-types";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "../components/ui/card";
import { Activity, CheckCircle, XCircle, RefreshCw } from "lucide-react";

type Status = "idle" | "loading" | "healthy" | "unhealthy";

export function HealthPage() {
  const apiClient = useApiClient();
  const [status, setStatus] = useState<Status>("idle");
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const data = await apiClient.getHealth();
      setHealth(data);
      setStatus("healthy");
    } catch {
      setStatus("unhealthy");
      setError("Could not reach the API server");
    }
  }, [apiClient]);

  useEffect(() => {
    void checkHealth();
  }, [checkHealth]);

  return (
    <div className="mx-auto max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            API Health
          </CardTitle>
          <CardDescription>
            Connectivity status for the backend API
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            {status === "loading" && (
              <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
            )}
            {status === "healthy" && (
              <CheckCircle className="h-5 w-5 text-green-600" />
            )}
            {status === "unhealthy" && (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            {status === "idle" && (
              <Activity className="h-5 w-5 text-muted-foreground" />
            )}
            <span className="text-sm font-medium">
              {status === "loading" && "Checking..."}
              {status === "healthy" && `Healthy — ${health?.status ?? "ok"}`}
              {status === "unhealthy" && (error ?? "Unhealthy")}
              {status === "idle" && "Not checked"}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => void checkHealth()}
            disabled={status === "loading"}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
