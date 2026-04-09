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

export default apiClient;
