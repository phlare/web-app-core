import { http, HttpResponse } from "msw";
import type {
  RegisterResponse,
  LoginResponse,
  TokenPair,
  MeResponse,
  SwitchAccountResponse,
  HealthResponse,
  DataEnvelope
} from "../../src/lib/api-types";

const BASE_URL = "http://localhost:4000";

const mockUser = {
  id: "u-001",
  email: "test@example.com",
  display_name: "Test User"
};

const mockAccount = {
  id: "a-001",
  name: "Test Account"
};

export const handlers = [
  http.post(`${BASE_URL}/api/v1/auth/register`, () => {
    const body: DataEnvelope<RegisterResponse> = {
      data: {
        user: mockUser,
        account: mockAccount,
        access_token: "access-new",
        refresh_token: "refresh-new"
      }
    };
    return HttpResponse.json(body, { status: 201 });
  }),

  http.post(`${BASE_URL}/api/v1/auth/login`, () => {
    const body: DataEnvelope<LoginResponse> = {
      data: {
        user: mockUser,
        access_token: "access-login",
        refresh_token: "refresh-login",
        active_account_id: mockAccount.id,
        accounts: [{ account_id: mockAccount.id, role: "owner" }]
      }
    };
    return HttpResponse.json(body);
  }),

  http.post(`${BASE_URL}/api/v1/auth/refresh`, () => {
    const body: DataEnvelope<TokenPair> = {
      data: {
        access_token: "access-refreshed",
        refresh_token: "refresh-refreshed"
      }
    };
    return HttpResponse.json(body);
  }),

  http.post(`${BASE_URL}/api/v1/auth/logout`, () => {
    return HttpResponse.json({ data: { status: "ok" } });
  }),

  http.post(`${BASE_URL}/api/v1/auth/switch_account`, () => {
    const body: DataEnvelope<SwitchAccountResponse> = {
      data: {
        access_token: "access-switched",
        account_id: "a-002",
        role: "admin"
      }
    };
    return HttpResponse.json(body);
  }),

  http.get(`${BASE_URL}/api/v1/me`, () => {
    const body: DataEnvelope<MeResponse> = {
      data: {
        user: mockUser,
        account_id: mockAccount.id,
        role: "owner",
        membership_id: "m-001"
      }
    };
    return HttpResponse.json(body);
  }),

  http.get(`${BASE_URL}/healthz`, () => {
    const body: DataEnvelope<HealthResponse> = {
      data: { status: "ok" }
    };
    return HttpResponse.json(body);
  })
];
