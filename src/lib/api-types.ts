// Types mapped 1:1 from elixir-api-core OpenAPI spec (priv/openapi/v1.yaml)

// --- Shared types ---

export type Role = "owner" | "admin" | "member";

export interface UserSummary {
  id: string;
  email: string;
  display_name: string;
}

export interface AccountSummary {
  id: string;
  name: string;
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
}

export interface AccountMembership {
  account_id: string;
  role: Role;
}

// --- Request types ---

export interface RegisterRequest {
  email: string;
  password: string;
  display_name?: string;
  account_name?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshRequest {
  refresh_token: string;
}

export interface LogoutRequest {
  refresh_token: string;
}

export interface SwitchAccountRequest {
  account_id: string;
}

// --- Response types ---

export interface RegisterResponse {
  user: UserSummary;
  account: AccountSummary;
  access_token: string;
  refresh_token: string;
}

export interface LoginResponse {
  user: UserSummary;
  access_token: string;
  refresh_token: string;
  active_account_id: string;
  accounts: AccountMembership[];
}

export type RefreshResponse = TokenPair;

export interface LogoutResponse {
  status: string;
}

export interface SwitchAccountResponse {
  access_token: string;
  account_id: string;
  role: Role;
}

export interface MeResponse {
  user: UserSummary;
  account_id: string;
  role: Role;
  membership_id: string;
}

export interface HealthResponse {
  status: string;
}

// --- Envelope types ---

export interface DataEnvelope<T> {
  data: T;
}

export interface ApiErrorDetail {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ErrorEnvelope {
  error: ApiErrorDetail;
}
