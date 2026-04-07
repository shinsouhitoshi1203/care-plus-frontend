import img from "@/assets/images";
import LinkButton from "@/features/welcome/components/LinkButton";
import LoginButton from "@/features/welcome/components/LoginButton";
import NewButton from "@/features/welcome/components/NewButton";
import { ResponsiveProvider } from "@/features/welcome/contexts/Responsive";
import { Image, Text, View } from "react-native";

function WelcomePage() {
  return (
    <ResponsiveProvider>
      <View className="flex-1 bg-white px-4 py-4">
        <View className="flex-1 items-center justify-center">
          <View className="mb-7 items-center justify-center" style={{ borderRadius: 18 }}>
            <Image source={img.welcome} resizeMode="contain" style={{ width: 200, height: 200, borderRadius: 18 }} />
          </View>

          <Text className="mb-4 text-center font-bold text-[#1F2937]" style={{ fontSize: 36 }}>
            Chào mừng đến với Care+
          </Text>
          <Text className="text-center text-[#6B7280]" style={{ maxWidth: 340, fontSize: 18 }}>
            Giải pháp chăm sóc sức khỏe toàn diện và thông minh cho bạn và gia đình.
          </Text>
        </View>

        <View className="mb-2 w-full">
          <LinkButton />
          <LoginButton />
          <NewButton />
        </View>
      </View>
    </ResponsiveProvider>
  );
}

export default WelcomePage;
