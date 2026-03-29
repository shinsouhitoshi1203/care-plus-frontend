import "@/global.css";
import tanstackClient from "@/stores/tanstack";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { Suspense } from "react";

export default function RootLayout() {
  return (
    <QueryClientProvider client={tanstackClient}>
      <Suspense fallback={<></>}>
        <Stack screenOptions={{ headerShown: false }} />
      </Suspense>
    </QueryClientProvider>
  );
}
