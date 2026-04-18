import secureStore from "@/stores/secureStore";

class TokenService {
  private accessTokenKey: string;
  private refreshTokenKey: string;
  private deviceTokenKey: string;
  private deviceFingerprintKey: string;
  private loginTypeKey: string;

  constructor() {
    this.accessTokenKey = "auth.accessToken";
    this.refreshTokenKey = "auth.refreshToken";
    this.deviceTokenKey = "quickLogin.deviceToken";
    this.deviceFingerprintKey = "quickLogin.fingerprint";
    this.loginTypeKey = "auth.loginType";
  }

  // === JWT Tokens (access + refresh) ===

  async getTokens() {
    return {
      accessToken: await secureStore.get(this.accessTokenKey),
      refreshToken: await secureStore.get(this.refreshTokenKey),
    };
  }

  async setTokens(tokens: { accessToken: string; refreshToken: string }) {
    await secureStore.set(this.accessTokenKey, tokens.accessToken);
    await secureStore.set(this.refreshTokenKey, tokens.refreshToken);
  }

  async clearTokens() {
    await secureStore.delete(this.accessTokenKey);
    await secureStore.delete(this.refreshTokenKey);
  }

  // === Quick Login Device Data ===

  async getDeviceToken(): Promise<string | null> {
    return await secureStore.get(this.deviceTokenKey);
  }

  async setDeviceToken(token: string): Promise<void> {
    await secureStore.set(this.deviceTokenKey, token);
  }

  async getDeviceFingerprint(): Promise<string | null> {
    return await secureStore.get(this.deviceFingerprintKey);
  }

  async setDeviceFingerprint(fp: string): Promise<void> {
    await secureStore.set(this.deviceFingerprintKey, fp);
  }

  // === Login Type ("full" | "quick_login") ===

  async getLoginType(): Promise<"full" | "quick_login" | null> {
    const type = await secureStore.get(this.loginTypeKey);
    return type as "full" | "quick_login" | null;
  }

  async setLoginType(type: "full" | "quick_login"): Promise<void> {
    await secureStore.set(this.loginTypeKey, type);
  }

  // === Clear All ===

  async clearAll(): Promise<void> {
    await this.clearTokens();
    await secureStore.delete(this.deviceTokenKey);
    await secureStore.delete(this.deviceFingerprintKey);
    await secureStore.delete(this.loginTypeKey);
  }

  async clearDeviceData(): Promise<void> {
    await secureStore.delete(this.deviceTokenKey);
    await secureStore.delete(this.deviceFingerprintKey);
    await secureStore.delete(this.loginTypeKey);
  }
}

export default new TokenService();
