import { describe, expect, it, vi } from "vitest";
import { Logger } from "../../src/lib/logger";

describe("Logger", () => {
  it("respects log level threshold", () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});
    const debugSpy = vi.spyOn(console, "debug").mockImplementation(() => {});

    const logger = new Logger("info");
    logger.info("visible");
    logger.debug("hidden");

    expect(spy).toHaveBeenCalledWith("visible", undefined);
    expect(debugSpy).not.toHaveBeenCalled();

    spy.mockRestore();
    debugSpy.mockRestore();
  });
});
