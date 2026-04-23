import LoadingWithZustand from "@/components/Loading";
import { TanstackProvider } from "@/stores/tanstack";
import AuthProvider from "./_auth";

export default function RootLayout() {
  return (
    <TanstackProvider fallback={<LoadingWithZustand />}>
      <LoadingWithZustand />
      <AuthProvider />
    </TanstackProvider>
  );
}
