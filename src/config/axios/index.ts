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
    // Authentication headers will be added dynamically in the request interceptor
    // Authorization: await makeTokenHeader(),
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

    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh-token")
    ) {
      originalRequest._retry = true;
      try {
        // Attempt to refresh tokens
        const tokenService = await getTokenService();
        if (!tokenService) {
          return Promise.reject(error);
        }

        const { refreshToken } = await tokenService.getTokens();
        const response = await axios.post(`${env.baseAPI}/auth/refresh-token`, { refreshToken });
        const { accessToken, refreshToken: newRefreshToken } = response.data.data;
        await tokenService.setTokens({ accessToken, refreshToken: newRefreshToken });
        // Update the original request with the new access token and retry it
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        const tokenService = await getTokenService();
        if (tokenService) {
          await tokenService.clearTokens();
        }
        // Optionally, you can redirect to the login page here
        // window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
