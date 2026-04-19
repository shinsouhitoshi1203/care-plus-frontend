import * as Haptics from "expo-haptics";
import * as Location from "expo-location";

export default async function getCoordination() {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

  // Lấy vị trí
  let { status } = await Location.requestForegroundPermissionsAsync();
  let coords = undefined;

  if (status === "granted") {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    coords = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } else {
    console.warn("Quyền vị trí bị từ chối, gửi SOS không có tọa độ.");
  }
  return coords;
}
