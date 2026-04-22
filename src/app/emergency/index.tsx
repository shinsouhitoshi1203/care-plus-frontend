"use client";

import { EmergencyInfoContent, ErrorState, LoadingState, MissingPublicIdState } from "@/features/emergency/components";
import useEmergencyInfo from "@/features/emergency/hooks/useEmergencyInfo";
import { useLocalSearchParams } from "expo-router";
import { AlertCircle } from "lucide-react-native";
import { useMemo } from "react";

// Main Component - Fully Client-Side Rendered
export default function EmergencyPublicWebPage() {
  // Get public ID from URL using expo-router
  const params = useLocalSearchParams<{ id?: string | string[] }>();

  const publicId = useMemo(() => {
    const raw = params.id;
    return Array.isArray(raw) ? raw[0] : raw;
  }, [params.id]);

  // Fetch emergency info using React Query
  const { data, isLoading, isError, error, refetch } = useEmergencyInfo(publicId as string);

  // Show loading while fetching
  if (isLoading) {
    return <LoadingState />;
  }

  // Missing public ID - show user not found message
  if (!publicId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} color="#6B7280" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy thông tin người dùng</h2>
          <p className="text-gray-600">
            Không tìm thấy mã người dùng. Vui lòng kiểm tra lại đường dẫn hoặc liên hệ với người cung cấp mã QR.
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError && error) {
    return <ErrorState error={error} onRetry={() => void refetch()} />;
  }

  // Success state
  if (data) {
    return <EmergencyInfoContent data={data} />;
  }

  // Fallback (shouldn't reach here)
  return <MissingPublicIdState />;
}
