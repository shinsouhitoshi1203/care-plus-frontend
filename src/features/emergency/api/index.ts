import env from "@/config/env";
import axios, { isAxiosError } from "axios";
import { type EmergencyInfo } from "../types";

type EmergencyInfoApiError = Error & {
  status?: number;
};

function createEmergencyInfoApiError(message: string, status?: number): EmergencyInfoApiError {
  const error = new Error(message) as EmergencyInfoApiError;
  error.status = status;
  return error;
}

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
    if (isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 404) {
        throw createEmergencyInfoApiError("Public ID đã hết hạn hoặc không tồn tại", status);
      }

      throw createEmergencyInfoApiError(error.response?.data?.message || "Không thể tải thông tin khẩn cấp", status);
    }

    throw error;
  }
}

export default { getPublicEmergencyInfo };
