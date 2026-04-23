import { fetch, useNetInfo } from "@react-native-community/netinfo";
import { useCallback } from "react";

/**
 * Bắt trạng thái kết nối internet của thiết bị. Nếu `trap` được đặt thành `true`, hook sẽ tự động trả về trạng thái kết nối hiện tại ngay cả khi có sự thay đổi, giúp tránh việc component bị re-render liên tục khi trạng thái kết nối thay đổi.
 * @param
 * @returns Trạng thái kết nối internet của thiết bị (true nếu có kết nối, false nếu không có kết nối).
 * @example
 * const isConnected = useInternet();
 * if (isConnected) {
 *   // Thực hiện hành động khi có kết nối internet
 * } else {
 *   // Hiển thị thông báo hoặc thực hiện hành động khi không có kết nối internet
 * }
 */
export default function useInternet({ trap = false }) {
  const { isInternetReachable } = useNetInfo();
  const checkConnectOnce = useCallback(async () => {
    return (await fetch()).isInternetReachable;
  }, []);
  if (trap) {
    return isInternetReachable;
  } else {
    return checkConnectOnce();
  }
}
