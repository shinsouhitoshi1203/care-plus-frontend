import secureStore from "@/stores/secureStore";

class TokenService {
  private accessTokenKey: string;
  private refreshTokenKey: string;
  constructor() {
    this.accessTokenKey = "auth.accessToken";
    this.refreshTokenKey = "auth.refreshToken";
  }
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
}

export default new TokenService();
