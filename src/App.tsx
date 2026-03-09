import type { ApiClient } from "./lib/api-client";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ToastProvider } from "./components/Toast";

interface AppProps {
  apiBaseUrl: string;
  apiClient: ApiClient;
}

export function App({ apiBaseUrl }: AppProps) {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">web-app-core</h1>
            <p className="mt-2 text-gray-600">API: {apiBaseUrl}</p>
          </div>
        </div>
      </ToastProvider>
    </ErrorBoundary>
  );
}
