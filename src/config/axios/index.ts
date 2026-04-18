import env from "@/config/env";
import TokenService from "@/features/auth/token";
import axios from "axios";

async function makeTokenHeader() {
  const { accessToken } = await TokenService.getTokens();
  return accessToken ? `Bearer ${accessToken}` : "";
}

const apiClient = axios.create({
  baseURL: env.baseAPI,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const tokenHeader = await makeTokenHeader();
    if (tokenHeader) {
      config.headers = {
        ...config.headers,
        Authorization: tokenHeader,
      } as any;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh-token") &&
      !originalRequest.url?.includes("/auth/quick-login/")
    ) {
      originalRequest._retry = true;
      try {
        const loginType = await TokenService.getLoginType();

        if (loginType === "quick_login") {
          // === Quick Login: thử refresh bằng quick-login endpoint ===
          try {
            const { refreshToken } = await TokenService.getTokens();
            if (refreshToken) {
              const response = await axios.post(`${env.baseAPI}/auth/quick-login/refresh`, { refreshToken });
              const { accessToken, refreshToken: newRefreshToken } = response.data.data;
              await TokenService.setTokens({ accessToken, refreshToken: newRefreshToken });
              originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
              return apiClient(originalRequest);
            }
          } catch {
            // Quick-login refresh failed → thử dùng device_token login lại
            console.log("Quick login refresh failed, trying device_token re-login...");
          }

          // Fallback: dùng device_token để login lại hoàn toàn
          try {
            const deviceToken = await TokenService.getDeviceToken();
            const fingerprint = await TokenService.getDeviceFingerprint();
            if (deviceToken && fingerprint) {
              const response = await axios.post(`${env.baseAPI}/auth/quick-login/device`, {
                device_token: deviceToken,
                device_fingerprint: fingerprint,
              });
              const { accessToken, refreshToken: newRefreshToken } = response.data.data.tokens;
              await TokenService.setTokens({ accessToken, refreshToken: newRefreshToken });
              originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
              return apiClient(originalRequest);
            }
          } catch {
            // Device đã bị revoke → clear tất cả
            console.log("Device token re-login failed, clearing all data...");
            await TokenService.clearAll();
          }
        } else {
          // === Normal: refresh bằng endpoint thông thường (luồng hiện tại) ===
          const { refreshToken } = await TokenService.getTokens();
          const response = await axios.post(`${env.baseAPI}/auth/refresh-token`, { refreshToken });
          const { accessToken, refreshToken: newRefreshToken } = response.data.data;
          await TokenService.setTokens({ accessToken, refreshToken: newRefreshToken });
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        await TokenService.clearTokens();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
