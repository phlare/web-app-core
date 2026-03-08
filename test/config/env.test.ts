import { describe, expect, it } from "vitest";
import { EnvSchema } from "../../src/config/env";

const validEnv = {
  VITE_API_BASE_URL: "http://localhost:4000"
};

describe("EnvSchema", () => {
  it("parses valid env", () => {
    const result = EnvSchema.parse(validEnv);
    expect(result.VITE_API_BASE_URL).toBe("http://localhost:4000");
  });

  it("rejects missing VITE_API_BASE_URL", () => {
    expect(() => EnvSchema.parse({})).toThrow();
  });

  it("rejects non-URL VITE_API_BASE_URL", () => {
    expect(() => EnvSchema.parse({ VITE_API_BASE_URL: "not-a-url" })).toThrow();
  });
});
