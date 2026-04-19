import apiClient from "@/config/axios";
import { FamilyItem, FamilyMemberItem, JoinStatus } from "../types";
import { DeviceItem } from "@/features/quickLogin/types";

const FamilyAPI = {
  async getFamilies(): Promise<FamilyItem[]> {
    const response = await apiClient.get("/family");
    return response.data?.data?.families ?? [];
  },

  async createFamily(payload: { name: string; address?: string }) {
    const response = await apiClient.post("/family", payload);
    return response.data?.data?.family;
  },

  async joinByInviteCode(payload: { inviteCode: string }) {
    const response = await apiClient.post("/family/join", payload);
    return response.data?.data;
  },

  async generateInvite(familyId: string): Promise<{ inviteCode: string; expiresIn: number }> {
    const response = await apiClient.post(`/family/${familyId}/generate-invite`);
    return response.data?.data;
  },

  async getMembers(familyId: string): Promise<FamilyMemberItem[]> {
    const response = await apiClient.get(`/family/${familyId}/members`);
    return response.data?.data?.members ?? [];
  },

  async getPendingMembers(familyId: string): Promise<FamilyMemberItem[]> {
    const response = await apiClient.get(`/family/${familyId}/pending-members`);
    return response.data?.data?.members ?? [];
  },

  async reviewJoinRequest(payload: { familyId: string; memberId: string; status: JoinStatus }) {
    const { familyId, memberId, status } = payload;
    const response = await apiClient.patch(`/family/${familyId}/members/${memberId}/status`, { status });
    return response.data?.data;
  },

  // =============== Quick Login Device Management (OWNER) ===============

  async setupDevice(
    familyId: string,
    memberId: string,
    data: { device_fingerprint: string; device_name?: string },
  ): Promise<{ device_token: string; member: { id: string; display_name: string; avatar_url: string | null; family_id: string } }> {
    const response = await apiClient.post(`/family/${familyId}/members/${memberId}/setup-device`, data);
    return response.data?.data;
  },

  async revokeDevice(familyId: string, memberId: string): Promise<void> {
    await apiClient.delete(`/family/${familyId}/members/${memberId}/revoke-device`);
  },

  async getDevices(familyId: string): Promise<DeviceItem[]> {
    const response = await apiClient.get(`/family/${familyId}/devices`);
    return response.data?.data?.devices ?? [];
  },

  async createGuestMember(
    familyId: string,
    payload: { displayName: string; relation?: string }
  ): Promise<any> {
    const response = await apiClient.post(`/family/${familyId}/members/guest`, payload);
    return response.data?.data;
  },

  async sendSOS(payload: { latitude?: number; longitude?: number }) {
    try {
      const response = await apiClient.post("/family/sos", payload);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi gửi tín hiệu SOS:", error);
      throw error;
    }
  },
};

export default FamilyAPI;
