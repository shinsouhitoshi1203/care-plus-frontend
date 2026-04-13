import apiClient from "@/config/axios";
import { type OTP, type RegisterRequest } from "../schema";

export const AccountAPI = {
  async register(registerData: RegisterRequest) {
    try {
      const response = await apiClient.post("/auth/register", registerData);
      return response;
    } catch (error) {
      console.error("Error during registration:", error);
      throw error;
    }
  },
  async verifyOTP(payload: OTP) {
    try {
      const response = await apiClient.post("/auth/verify-email", payload);
      return response;
    } catch (error) {
      console.error("Error during OTP verification:", error);
      throw error;
    }
  },
  async resendOTP(payload: Omit<OTP, "otp">) {
    try {
      const response = await apiClient.post("/auth/resend-verify", payload);
      return response;
    } catch (error) {
      console.error("Error during OTP resend:", error);
      throw error;
    }
  },

  async resendOTPByLogin(identifier: string) {
    try {
      const { data } = await apiClient.post("/auth/resend-verify-by-login", { identifier });
      return data.email;
    } catch (error) {
      console.error("Error during OTP resend by login:", error);
      throw error;
    }
  },

  // Account CRUD
  async getAccount() {
    try {
      const data = (await apiClient.get("/user/me")).data.data;
      return data;
    } catch (error) {
      console.error("Error fetching account:", error);
      throw error;
    }
  },
};
