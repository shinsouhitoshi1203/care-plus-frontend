import apiClient from "@/config/axios";
import { type LoginRequest } from "../schema/Login";

const AuthAPI = {
  async login(request: LoginRequest) {
    try {
      const response = await apiClient.post("/auth/login", request);
      const { data } = response.data;
      return data;
    } catch (error) {
      throw error;
    }
  },

  async logout(deviceFingerprint?: string | null) {
    try {
      await apiClient.post("/auth/logout", {
        device_fingerprint: deviceFingerprint ?? undefined,
      });
    } catch (error) {
      throw error;
    }
  },

  async check() {
    const data = (await apiClient.get("/user/me")).data.data;
    return data;
  },

  async updateDeviceToken(deviceToken: string) {
    try {
      const response = await apiClient.post("/user/device-token", { deviceToken });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi cập nhật device token:", error);
      throw error;
    }
  },
};

export default AuthAPI;
