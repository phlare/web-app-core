interface AppProps {
  apiBaseUrl: string;
}

export function App({ apiBaseUrl }: AppProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">web-app-core</h1>
        <p className="mt-2 text-gray-600">API: {apiBaseUrl}</p>
      </div>
    </div>
  );
}
