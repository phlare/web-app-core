type LogLevel = "debug" | "info" | "warn" | "error" | "silent";

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  silent: 4
};

export class Logger {
  private readonly threshold: number;

  constructor(level: LogLevel = "info") {
    this.threshold = LEVEL_ORDER[level];
  }

  debug(message: string, context?: Record<string, unknown>): void {
    if (this.threshold <= LEVEL_ORDER.debug) {
      console.debug(message, context);
    }
  }

  info(message: string, context?: Record<string, unknown>): void {
    if (this.threshold <= LEVEL_ORDER.info) {
      console.info(message, context);
    }
  }

  warn(message: string, context?: Record<string, unknown>): void {
    if (this.threshold <= LEVEL_ORDER.warn) {
      console.warn(message, context);
    }
  }

  error(message: string, context?: Record<string, unknown>): void {
    if (this.threshold <= LEVEL_ORDER.error) {
      console.error(message, context);
    }
  }
}
