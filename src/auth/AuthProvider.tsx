import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { ApiClient } from "../lib/api-client";
import type { TokenStorage } from "../lib/token-storage";
import type {
  LoginRequest,
  RegisterRequest,
  Role,
  UserSummary
} from "../lib/api-types";
import { AuthContext } from "./AuthContext";

interface AuthProviderProps {
  apiClient: ApiClient;
  tokenStorage: TokenStorage;
  children: ReactNode;
}

export function AuthProvider({
  apiClient,
  tokenStorage,
  children
}: AuthProviderProps) {
  const [user, setUser] = useState<UserSummary | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      const refreshToken = tokenStorage.getRefreshToken();
      if (!refreshToken) {
        setIsLoading(false);
        return;
      }

      try {
        await apiClient.refresh();
        const me = await apiClient.getMe();
        setUser(me.user);
        setAccountId(me.account_id);
        setRole(me.role);
      } catch {
        tokenStorage.clear();
      } finally {
        setIsLoading(false);
      }
    };

    void bootstrap();
  }, [apiClient, tokenStorage]);

  const login = useCallback(
    async (req: LoginRequest) => {
      const res = await apiClient.login(req);
      setUser(res.user);
      setAccountId(res.active_account_id);
      const membership = res.accounts.find(
        (a) => a.account_id === res.active_account_id
      );
      setRole(membership?.role ?? null);
    },
    [apiClient]
  );

  const register = useCallback(
    async (req: RegisterRequest) => {
      const res = await apiClient.register(req);
      setUser(res.user);
      setAccountId(res.account.id);
      setRole("owner");
    },
    [apiClient]
  );

  const logout = useCallback(async () => {
    await apiClient.logout();
    setUser(null);
    setAccountId(null);
    setRole(null);
  }, [apiClient]);

  const value = useMemo(
    () => ({
      user,
      accountId,
      role,
      isAuthenticated: user !== null,
      isLoading,
      login,
      register,
      logout
    }),
    [user, accountId, role, isLoading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
