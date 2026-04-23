"use client";

import { AlertCircle, RefreshCw, ShieldAlert } from "lucide-react-native";

interface ErrorStateProps {
  error: Error;
  onRetry: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const isExpired = error.message.includes("hết hạn") || error.message.includes("không tồn tại");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldAlert size={32} color="#F59E0B" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {isExpired ? "Liên kết không hợp lệ" : "Không thể tải dữ liệu"}
        </h2>
        <p className="text-gray-600 mb-6">{error.message}</p>
        {!isExpired && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <RefreshCw size={18} />
            Thử lại
          </button>
        )}
      </div>
    </div>
  );
}

export function MissingPublicIdState() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={32} color="#6B7280" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Không tìm thấy thông tin
        </h2>
        <p className="text-gray-600">
          Không tìm thấy mã người dùng. Vui lòng kiểm tra lại đường dẫn hoặc liên hệ với người cung cấp mã QR.
        </p>
      </div>
    </div>
  );
}
