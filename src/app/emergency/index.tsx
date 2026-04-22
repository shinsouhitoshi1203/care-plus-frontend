"use client";

import { getPublicEmergencyInfo } from "@/features/emergency/api";
import {
  EmergencyInfoContent,
  ErrorState,
  LoadingState,
  MissingPublicIdState,
} from "@/features/emergency/components";
import { type EmergencyInfo } from "@/features/emergency/types";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { AlertCircle } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";

// Main Component - Fully Client-Side Rendered
export default function EmergencyPublicWebPage() {
  // Get public ID from URL using expo-router
  const params = useLocalSearchParams<{ id?: string | string[] }>();

  const publicId = useMemo(() => {
    const raw = params.id;
    return Array.isArray(raw) ? raw[0] : raw;
  }, [params.id]);

  const [isFetching, setIsFetching] = useState(false);

  // Fetch emergency info using React Query
  const {
    data,
    isLoading: isQueryLoading,
    isError,
    error,
    refetch,
  } = useQuery<EmergencyInfo, Error>({
    queryKey: ["emergency_public_info", publicId],
    queryFn: async () => {
      console.log("[QueryFn] Fetching emergency info for public ID:", publicId);
      if (!publicId) throw new Error("Missing public ID");
      return await getPublicEmergencyInfo(publicId);
    },
    enabled: !!publicId,
    retry: 3,
    staleTime: 5 * 60 * 1000,
  });

  // Trigger fetch when publicId changes
  useEffect(() => {
    if (publicId) {
      console.log("[useEffect] publicId changed, fetching:", publicId);
      setIsFetching(true);
      refetch().finally(() => {
        setIsFetching(false);
      });
    }
  }, [publicId, refetch]);

  // Log react query state changes
  useEffect(() => {
    console.log("[Query State]", {
      data,
      isQueryLoading,
      isError,
      error: error?.message || null,
    });
    console.log("error object:", error);
  }, [data, isQueryLoading, isError, error]);

  const isLoading = isQueryLoading || isFetching;

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
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Không tìm thấy thông tin người dùng
          </h2>
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
