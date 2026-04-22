import env from "@/config/env";
import axios from "axios";
import { type EmergencyInfo } from "../types";

const publicApiClient = axios.create({
  baseURL: env.baseAPI,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getPublicEmergencyInfo(publicId: string): Promise<EmergencyInfo> {
  console.log("[API] getPublicEmergencyInfo called with public ID:", publicId);
  try {
    const response = await publicApiClient.get(`/users/quick/${publicId}`);
    console.log("[API] getPublicEmergencyInfo response:", response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("Public ID đã hết hạn hoặc không tồn tại");
      }
      throw new Error(error.response?.data?.message || "Không thể tải thông tin khẩn cấp");
    }
    throw error;
  }
}

export default { getPublicEmergencyInfo };
