import { Button } from "@rneui/themed";
import { useRouter } from "expo-router";
import { ArrowRight, CheckCircle2, Home, Sparkles } from "lucide-react-native";
import type { ComponentType } from "react";
import { ScrollView, Text, View } from "react-native";

type NextStep = {
  icon: ComponentType<{ color: string; size: number }>;
  title: string;
  description: string;
};

const nextSteps: NextStep[] = [
  {
    icon: Sparkles,
    title: "Hoàn thiện hồ sơ cá nhân",
    description: "Bổ sung thông tin cơ bản để hệ thống gợi ý các tính năng phù hợp hơn.",
  },
  {
    icon: Home,
    title: "Kết nối với gia đình",
    description: "Mời thêm người thân để chia sẻ và theo dõi chăm sóc thuận tiện hơn.",
  },
];

function FinishPage() {
  const router = useRouter();
  const beginHandler = () => {
    if (router.canDismiss()) router.dismissAll();
    router.replace("/protected/home");
  };
  return (
    <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex-1 px-2 pb-4 pt-4">
        <View className="absolute -left-12 bottom-16 h-36 w-36 rounded-full bg-emerald-100/70" />

        <View className="flex-1 justify-between">
          <View className="items-center pt-4">
            <View className="mb-5 h-24 w-24 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 size={56} color="#10B981" />
            </View>

            <View className="mb-5 rounded-full bg-[#EAF1FF] px-4 py-1.5">
              <Text className="text-xs font-bold uppercase tracking-[0.18em] text-[#2C5EDB]">Hoàn tất xác thực</Text>
            </View>

            <Text className="max-w-[320px] text-center text-4xl font-extrabold leading-tight text-slate-900">
              Tài khoản đã sẵn sàng
            </Text>
            <Text className="mt-4 max-w-[330px] text-center text-base leading-7 text-slate-600">
              Bạn vừa hoàn tất bước kích hoạt. Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi.
            </Text>
          </View>

          <View className="mt-8 rounded-[28px] border border-blue-100 bg-white/90 p-5 shadow-sm">
            <View className="mb-4 flex-row items-center gap-3">
              <View className="h-11 w-11 items-center justify-center rounded-2xl bg-blue-50">
                <Sparkles size={20} color="#2C5EDB" />
              </View>

              <View className="flex-1">
                <Text className="mt-1 text-sm text-slate-500">Hãy hoàn tất vài thao tác dưới đây để bắt đầu</Text>
              </View>
            </View>

            <View className="gap-3">
              {nextSteps.map((step) => {
                const StepIcon = step.icon;

                return (
                  <View key={step.title} className="flex-row items-start gap-3 rounded-2xl bg-slate-50 p-4">
                    <View className="mt-0.5 h-10 w-10 items-center justify-center rounded-2xl bg-white">
                      <StepIcon size={18} color="#2C5EDB" />
                    </View>

                    <View className="flex-1">
                      <Text className="text-base font-bold text-slate-900">{step.title}</Text>
                      <Text className="mt-1 text-sm leading-5 text-slate-500">{step.description}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          <View className="mt-6 w-full gap-3">
            <View className="w-full">
              <Button
                title="Bắt đầu"
                onPress={beginHandler}
                icon={<ArrowRight color="#fff" size={36} />}
                iconRight
                radius={16}
                buttonStyle={{ minHeight: 56, borderRadius: 16, backgroundColor: "#2C5EDB", gap: 12 }}
                titleStyle={{ color: "#FFFFFF", fontSize: 18, fontWeight: "700" }}
              />
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

export default FinishPage;
