import { useAuth } from "../auth/useAuth";

export function HomePage() {
  const { user, accountId, role, logout } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, {user?.display_name ?? user?.email}
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Account: {accountId} &middot; Role: {role}
        </p>
        <button
          type="button"
          onClick={() => void logout()}
          className="mt-4 rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
