const SESSION_KEY = "has_session";

export class TokenStorage {
  private accessToken: string | null = null;

  getAccessToken(): string | null {
    return this.accessToken;
  }

  setAccessToken(token: string): void {
    this.accessToken = token;
  }

  hasSession(): boolean {
    return localStorage.getItem(SESSION_KEY) === "1";
  }

  markSession(): void {
    localStorage.setItem(SESSION_KEY, "1");
  }

  clear(): void {
    this.accessToken = null;
    localStorage.removeItem(SESSION_KEY);
  }
}
