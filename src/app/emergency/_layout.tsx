"use client";

import PlatformCheckLayout from "@/layouts/PlatformCheck";
import { Stack } from "expo-router";
import { Platform, StyleSheet, Text, View } from "react-native";

export default function WebEmergencyLayout() {
  const isWeb = Platform.OS === "web";

  // Only allow web access
  if (!isWeb) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Vui lòng xem trên trình duyệt web</Text>
      </View>
    );
  }

  return (
    <PlatformCheckLayout exclude="native">
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#F9FAFB" },
        }}
      />
    </PlatformCheckLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 20,
  },
  text: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
});
