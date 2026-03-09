import { describe, expect, it } from "vitest";
import { ApiError } from "../../src/lib/api-error";

describe("ApiError", () => {
  it("constructs with all fields", () => {
    const error = new ApiError("NOT_FOUND", "Route not found", 404, {
      path: "/missing"
    });
    expect(error.code).toBe("NOT_FOUND");
    expect(error.message).toBe("Route not found");
    expect(error.statusCode).toBe(404);
    expect(error.details).toEqual({ path: "/missing" });
  });

  it("is an instance of Error with name ApiError", () => {
    const error = new ApiError("FAIL", "Something broke", 500);
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe("ApiError");
  });
});
