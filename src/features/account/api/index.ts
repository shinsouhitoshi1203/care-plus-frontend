import apiClient from "@/config/axios";
import { type OTP, type RegisterRequest } from "../schema";

export const AccountAPI = {
  async register(registerData: RegisterRequest) {
    try {
      const response = apiClient.post("/auth/register", registerData);
      return response;
    } catch (error) {
      console.error("Error during registration:", error);
      throw error;
    }
  },
  async verifyOTP(payload: OTP) {
    try {
      const response = apiClient.post("/auth/verify-email", payload);
      return response;
    } catch (error) {
      console.error("Error during OTP verification:", error);
      throw error;
    }
  },
  async resendOTP(payload: Omit<OTP, "otp">) {
    try {
      const response = apiClient.post("/auth/resend-verify", payload);
      return response;
    } catch (error) {
      console.error("Error during OTP resend:", error);
      throw error;
    }
  },
};
