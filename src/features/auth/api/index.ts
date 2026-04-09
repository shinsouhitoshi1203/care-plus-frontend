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

  async logout() {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      throw error;
    }
  },
};

export default AuthAPI;
