import { createContext } from "react";
import type {
  LoginRequest,
  RegisterRequest,
  Role,
  UserSummary
} from "../lib/api-types";

export interface AuthContextValue {
  user: UserSummary | null;
  accountId: string | null;
  role: Role | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (req: LoginRequest) => Promise<void>;
  register: (req: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
