import tanstackClient from "@/stores/tanstack";
import { QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "./_auth";

export default function RootLayout() {
  return (
    <QueryClientProvider client={tanstackClient}>
      <AuthProvider />
    </QueryClientProvider>
  );
}
