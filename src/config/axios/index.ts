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
    // Authentication headers will be added dynamically in the request interceptor
    // Authorization: await makeTokenHeader(),
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
      !originalRequest.url?.includes("/auth/refresh-token")
    ) {
      originalRequest._retry = true;
      try {
        // Attempt to refresh tokens
        const { refreshToken } = await TokenService.getTokens();
        const response = await axios.post(`${env.baseAPI}/auth/refresh-token`, { refreshToken });
        const { accessToken, refreshToken: newRefreshToken } = response.data.data;
        await TokenService.setTokens({ accessToken, refreshToken: newRefreshToken });
        // Update the original request with the new access token and retry it
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        await TokenService.clearTokens();
        // Optionally, you can redirect to the login page here
        // window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
