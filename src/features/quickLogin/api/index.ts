import apiClient from "@/config/axios";
import TokenService from "@/features/auth/token";
import { Platform } from "react-native";

export interface QuickLoginMember {
  id: string;
  display_name: string | null;
  family_id: string;
  family_role: string;
  avatar_url: string | null;
  permissions: string[];
}

export interface QuickLoginResult {
  member: QuickLoginMember;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

/**
 * Tạo UUID đơn giản không cần thư viện bên ngoài
 */
function generateUUID(): string {
  const chars = "0123456789abcdef";
  let uuid = "";
  for (let i = 0; i < 32; i++) {
    uuid += chars[Math.floor(Math.random() * 16)];
    if (i === 7 || i === 11 || i === 15 || i === 19) uuid += "-";
  }
  return uuid;
}

const QuickLoginAPI = {
  /**
   * Đăng nhập nhanh bằng device token (thiết bị người thân gọi tự động)
   */
  async loginByDevice(deviceToken: string, fingerprint: string): Promise<QuickLoginResult> {
    const response = await apiClient.post("/auth/quick-login/device", {
      device_token: deviceToken,
      device_fingerprint: fingerprint,
    });
    return response.data?.data;
  },

  /**
   * Refresh token cho quick-login session
   */
  async refreshToken(refreshToken: string) {
    const response = await apiClient.post("/auth/quick-login/refresh", {
      refreshToken,
    });
    return response.data?.data;
  },

  /**
   * Tạo hoặc lấy fingerprint duy nhất cho thiết bị này
   * Lưu vào SecureStore để dùng lại
   */
  async getOrCreateFingerprint(): Promise<string> {
    // Kiểm tra fingerprint đã lưu
    const existing = await TokenService.getDeviceFingerprint();
    if (existing) return existing;

    // Tạo fingerprint mới
    const fp = `${Platform.OS}_${generateUUID()}`;
    await TokenService.setDeviceFingerprint(fp);
    return fp;
  },

  /**
   * Lấy tên thiết bị để hiển thị
   */
  getDeviceName(): string {
    return `Care+ (${Platform.OS})`;
  },
};

export default QuickLoginAPI;
