import { describe, expect, it, beforeEach } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "../mocks/server";
import { ApiClient } from "../../src/lib/api-client";
import { ApiError } from "../../src/lib/api-error";
import { TokenStorage } from "../../src/lib/token-storage";
import { Logger } from "../../src/lib/logger";

const BASE_URL = "http://localhost:4000";

describe("ApiClient", () => {
  let client: ApiClient;
  let tokenStorage: TokenStorage;

  beforeEach(() => {
    tokenStorage = new TokenStorage();
    localStorage.clear();
    client = new ApiClient(BASE_URL, tokenStorage, new Logger("silent"));
  });

  it("unwraps data envelope on success", async () => {
    const health = await client.getHealth();
    expect(health.status).toBe("ok");
  });

  it("throws ApiError on error response", async () => {
    server.use(
      http.post(`${BASE_URL}/api/v1/auth/login`, () => {
        return HttpResponse.json(
          {
            error: {
              code: "INVALID_CREDENTIALS",
              message: "Bad email or password",
              details: {}
            }
          },
          { status: 401 }
        );
      })
    );

    await expect(
      client.login({ email: "bad@test.com", password: "wrong" })
    ).rejects.toThrow(ApiError);

    try {
      await client.login({ email: "bad@test.com", password: "wrong" });
    } catch (e) {
      const err = e as ApiError;
      expect(err.code).toBe("INVALID_CREDENTIALS");
      expect(err.statusCode).toBe(401);
    }
  });

  it("attaches bearer token to authenticated requests", async () => {
    let capturedAuth: string | null = null;
    server.use(
      http.get(`${BASE_URL}/api/v1/me`, ({ request }) => {
        capturedAuth = request.headers.get("Authorization");
        return HttpResponse.json({
          data: {
            user: {
              id: "u-001",
              email: "test@example.com",
              display_name: "Test"
            },
            account_id: "a-001",
            role: "owner",
            membership_id: "m-001"
          }
        });
      })
    );

    tokenStorage.setAccessToken("my-token");
    await client.getMe();
    expect(capturedAuth).toBe("Bearer my-token");
  });

  it("refreshes token and retries on 401", async () => {
    tokenStorage.setAccessToken("expired-token");
    tokenStorage.setRefreshToken("valid-refresh");

    let callCount = 0;
    server.use(
      http.get(`${BASE_URL}/api/v1/me`, () => {
        callCount++;
        if (callCount === 1) {
          return HttpResponse.json(
            {
              error: {
                code: "UNAUTHORIZED",
                message: "Token expired",
                details: {}
              }
            },
            { status: 401 }
          );
        }
        return HttpResponse.json({
          data: {
            user: {
              id: "u-001",
              email: "test@example.com",
              display_name: "Test"
            },
            account_id: "a-001",
            role: "owner",
            membership_id: "m-001"
          }
        });
      })
    );

    const result = await client.getMe();
    expect(result.user.email).toBe("test@example.com");
    expect(callCount).toBe(2);
    expect(tokenStorage.getAccessToken()).toBe("access-refreshed");
  });

  it("deduplicates concurrent refresh calls", async () => {
    tokenStorage.setAccessToken("expired");
    tokenStorage.setRefreshToken("valid-refresh");

    let refreshCount = 0;
    server.use(
      http.post(`${BASE_URL}/api/v1/auth/refresh`, () => {
        refreshCount++;
        return HttpResponse.json({
          data: {
            access_token: "access-refreshed",
            refresh_token: "refresh-refreshed"
          }
        });
      }),
      http.get(`${BASE_URL}/api/v1/me`, ({ request }) => {
        const auth = request.headers.get("Authorization");
        if (auth === "Bearer expired") {
          return HttpResponse.json(
            {
              error: {
                code: "UNAUTHORIZED",
                message: "Expired",
                details: {}
              }
            },
            { status: 401 }
          );
        }
        return HttpResponse.json({
          data: {
            user: {
              id: "u-001",
              email: "test@example.com",
              display_name: "Test"
            },
            account_id: "a-001",
            role: "owner",
            membership_id: "m-001"
          }
        });
      })
    );

    const [r1, r2] = await Promise.all([client.getMe(), client.getMe()]);
    expect(r1.user.email).toBe("test@example.com");
    expect(r2.user.email).toBe("test@example.com");
    expect(refreshCount).toBe(1);
  });
});
