import env from "@/config/env";
import axios from "axios";
import { Platform } from "react-native";
const isWeb = Platform.OS === "web";

async function getTokenService() {
  if (isWeb) {
    return null;
  }

  const { default: tokenService } = await import("@/features/auth/token");
  return tokenService;
}

async function makeTokenHeader() {
  if (isWeb) {
    return "";
  }

  const tokenService = await getTokenService();
  if (!tokenService) {
    return "";
  }

  const { accessToken } = await tokenService.getTokens();
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
    if (isWeb) {
      return config;
    }

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
    if (isWeb) {
      return Promise.reject(error);
    }
    const tokenService = await getTokenService();
    if (!tokenService) {
      return Promise.reject(error);
    }
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
        const loginType = await tokenService.getLoginType();

        if (loginType === "quick_login") {
          // === Quick Login: thử refresh bằng quick-login endpoint ===
          try {
            const { refreshToken } = await tokenService.getTokens();
            if (refreshToken) {
              const response = await axios.post(`${env.baseAPI}/auth/quick-login/refresh`, { refreshToken });
              const { accessToken, refreshToken: newRefreshToken } = response.data.data;
              await tokenService.setTokens({ accessToken, refreshToken: newRefreshToken });
              originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
              return apiClient(originalRequest);
            }
          } catch {
            // Quick-login refresh failed → thử dùng device_token login lại
            console.log("Quick login refresh failed, trying device_token re-login...");
          }

          // Fallback: dùng device_token để login lại hoàn toàn
          try {
            const deviceToken = await tokenService.getDeviceToken();
            const fingerprint = await tokenService.getDeviceFingerprint();
            if (deviceToken && fingerprint) {
              const response = await axios.post(`${env.baseAPI}/auth/quick-login/device`, {
                device_token: deviceToken,
                device_fingerprint: fingerprint,
              });
              const { accessToken, refreshToken: newRefreshToken } = response.data.data.tokens;
              await tokenService.setTokens({ accessToken, refreshToken: newRefreshToken });
              originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
              return apiClient(originalRequest);
            }
          } catch {
            // Device đã bị revoke → clear tất cả
            console.log("Device token re-login failed, clearing all data...");
            await tokenService.clearAll();
          }
        } else {
          // === Normal: refresh bằng endpoint thông thường (luồng hiện tại) ===
          const { refreshToken } = await tokenService.getTokens();
          const response = await axios.post(`${env.baseAPI}/auth/refresh-token`, { refreshToken });
          const { accessToken, refreshToken: newRefreshToken } = response.data.data;
          await tokenService.setTokens({ accessToken, refreshToken: newRefreshToken });
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        await tokenService.clearTokens();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
