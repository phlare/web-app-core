import type {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  SwitchAccountRequest,
  SwitchAccountResponse,
  MeResponse,
  HealthResponse,
  TokenPair,
  DataEnvelope,
  ErrorEnvelope
} from "./api-types";
import { ApiError } from "./api-error";
import type { TokenStorage } from "./token-storage";
import type { Logger } from "./logger";

interface RequestOptions {
  skipAuth?: boolean;
  isRetry?: boolean;
}

export class ApiClient {
  private refreshPromise: Promise<TokenPair> | null = null;

  constructor(
    private readonly baseUrl: string,
    private readonly tokenStorage: TokenStorage,
    private readonly logger: Logger
  ) {}

  async register(body: RegisterRequest): Promise<RegisterResponse> {
    const data = await this.request<RegisterResponse>(
      "POST",
      "/api/v1/auth/register",
      body,
      { skipAuth: true }
    );
    this.tokenStorage.setAccessToken(data.access_token);
    this.tokenStorage.setRefreshToken(data.refresh_token);
    return data;
  }

  async login(body: LoginRequest): Promise<LoginResponse> {
    const data = await this.request<LoginResponse>(
      "POST",
      "/api/v1/auth/login",
      body,
      { skipAuth: true }
    );
    this.tokenStorage.setAccessToken(data.access_token);
    this.tokenStorage.setRefreshToken(data.refresh_token);
    return data;
  }

  async refresh(): Promise<TokenPair> {
    const refreshToken = this.tokenStorage.getRefreshToken();
    if (!refreshToken) {
      throw new ApiError("NO_REFRESH_TOKEN", "No refresh token available", 401);
    }
    const data = await this.request<TokenPair>(
      "POST",
      "/api/v1/auth/refresh",
      { refresh_token: refreshToken },
      { skipAuth: true }
    );
    this.tokenStorage.setAccessToken(data.access_token);
    this.tokenStorage.setRefreshToken(data.refresh_token);
    return data;
  }

  async logout(): Promise<void> {
    const refreshToken = this.tokenStorage.getRefreshToken();
    if (refreshToken) {
      await this.request<{ status: string }>("POST", "/api/v1/auth/logout", {
        refresh_token: refreshToken
      });
    }
    this.tokenStorage.clear();
  }

  async switchAccount(
    body: SwitchAccountRequest
  ): Promise<SwitchAccountResponse> {
    return this.request<SwitchAccountResponse>(
      "POST",
      "/api/v1/auth/switch_account",
      body
    );
  }

  async getMe(): Promise<MeResponse> {
    return this.request<MeResponse>("GET", "/api/v1/me");
  }

  async getHealth(): Promise<HealthResponse> {
    return this.request<HealthResponse>("GET", "/healthz", undefined, {
      skipAuth: true
    });
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    options: RequestOptions = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json"
    };

    if (!options.skipAuth) {
      const token = this.tokenStorage.getAccessToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    this.logger.debug("API request", { method, path });

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null
    });

    if (response.ok) {
      const envelope = (await response.json()) as DataEnvelope<T>;
      this.logger.debug("API response", {
        method,
        path,
        status: response.status
      });
      return envelope.data;
    }

    if (response.status === 401 && !options.skipAuth && !options.isRetry) {
      this.logger.info("401 received, attempting token refresh", { path });
      try {
        await this.refreshWithMutex();
        return this.request<T>(method, path, body, {
          ...options,
          isRetry: true
        });
      } catch {
        this.tokenStorage.clear();
        throw new ApiError("UNAUTHORIZED", "Session expired", 401);
      }
    }

    const errorBody = (await response.json()) as ErrorEnvelope;
    const detail = errorBody.error;
    throw new ApiError(
      detail.code,
      detail.message,
      response.status,
      detail.details
    );
  }

  private async refreshWithMutex(): Promise<TokenPair> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }
    this.refreshPromise = this.refresh();
    try {
      return await this.refreshPromise;
    } finally {
      this.refreshPromise = null;
    }
  }
}
