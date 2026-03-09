import { describe, expect, it, beforeEach } from "vitest";
import { TokenStorage } from "../../src/lib/token-storage";

describe("TokenStorage", () => {
  let storage: TokenStorage;

  beforeEach(() => {
    storage = new TokenStorage();
    localStorage.clear();
  });

  it("stores and retrieves access token in memory", () => {
    expect(storage.getAccessToken()).toBeNull();
    storage.setAccessToken("abc");
    expect(storage.getAccessToken()).toBe("abc");
  });

  it("stores and retrieves refresh token in localStorage", () => {
    expect(storage.getRefreshToken()).toBeNull();
    storage.setRefreshToken("xyz");
    expect(storage.getRefreshToken()).toBe("xyz");
    expect(localStorage.getItem("refresh_token")).toBe("xyz");
  });

  it("clear removes both tokens", () => {
    storage.setAccessToken("abc");
    storage.setRefreshToken("xyz");
    storage.clear();
    expect(storage.getAccessToken()).toBeNull();
    expect(storage.getRefreshToken()).toBeNull();
  });
});
