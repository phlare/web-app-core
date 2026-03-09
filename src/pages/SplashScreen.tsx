export function SplashScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div
          className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900"
          role="status"
          aria-label="Loading"
        />
        <p className="mt-4 text-sm text-gray-500">Loading…</p>
      </div>
    </div>
  );
}
