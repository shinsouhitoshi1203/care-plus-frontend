import { Platform, Text, View } from "react-native";

export function NotSupported() {
  return (
    <View
      style={{
        display: "flex",
        flex: 1,
        gap: 14,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text className="text-4xl font-bold">KHÔNG LÀ KHÔNG</Text>
      <Text>Care+ không chạy trên nền tảng này!</Text>
    </View>
  );
}

export default function PlatformCheckLayout({
  exclude = "web",
  children,
}: {
  exclude: "web" | "native";
  children: React.ReactNode;
}) {
  if (["windows", "macos", "linux"].includes(Platform.OS)) {
    return <NotSupported />;
  }

  if (exclude === "native" && ["ios", "android"].includes(Platform.OS)) {
    return <NotSupported />;
  }

  if (exclude === "web" && Platform.OS === "web") {
    return <NotSupported />;
  }

  return <>{children}</>;
}
