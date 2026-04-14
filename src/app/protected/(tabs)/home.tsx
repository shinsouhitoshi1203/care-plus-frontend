import QuickComponent from "@/features/home/components/Quick";
import OverviewHealthRecordChart from "@/features/record/component/chart/Overview";
import { Pressable, ScrollView, Text, View } from "react-native";

import FullSize from "@/components/buttons/FullSize";
import { useRouter } from "expo-router";
import { Pill, PlusCircle } from "lucide-react-native";

type QuickActionProps = {
  id: string;
  title: string;
  icon: any;
  containerClassName: string;
  iconContainerClassName: string;
  iconColor: string;
  titleClassName: string;

  [key: string]: any;
};

const quickActions: QuickActionProps[] = [
  {
    id: "enter-record",
    title: "NHẬP CHỈ SỐ",
    icon: PlusCircle,
    containerClassName: "bg-[#2C5EDB]",
    iconContainerClassName: "bg-white",
    iconColor: "#2C5EDB",
    titleClassName: "text-white",
  },
  {
    id: "medicine-schedule",
    title: "LỊCH UỐNG THUỐC",
    icon: Pill,
    containerClassName: "border border-slate-200 bg-white",
    iconContainerClassName: "bg-[#F2E8FF]",
    iconColor: "#8B5CF6",
    titleClassName: "text-slate-700",
  },
];

function QuickActionButton({
  icon: Icon,
  title,
  containerClassName,
  iconContainerClassName,
  iconColor,
  titleClassName,
}: QuickActionProps) {
  const router = useRouter();
  return (
    <Pressable
      accessibilityRole="button"
      className={`flex-1 min-h-[108px] items-center justify-center rounded-[24px] px-4 py-4 ${containerClassName}`}
      onPress={() => {
        if (title === "NHẬP CHỈ SỐ") {
          router.navigate("/protected/records");
        } else if (title === "LỊCH UỐNG THUỐC") {
          router.navigate("/protected/records/add");
        }
      }}
      style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.98 : 1 }] }]}
    >
      <View className={`h-12 w-12 items-center justify-center rounded-full ${iconContainerClassName}`}>
        <Icon color={iconColor} size={22} strokeWidth={2.4} />
      </View>

      <Text
        className={`mt-4 text-center text-[14px] font-extrabold leading-5 tracking-[0.12em] ${titleClassName}`}
        numberOfLines={2}
      >
        {title}
      </Text>
    </Pressable>
  );
}

export default function HomePage() {
  const router = useRouter();
  return (
    <ScrollView>
      <QuickComponent />
      {/* <ChartSample /> */}
      <View className="flex-1 flex" style={{ paddingHorizontal: 24 }}>
        <View className="rounded-[28px] my-6">
          <View className="flex-row gap-3">
            {/* {quickActions.map(({ id, ...action }) => (
              <QuickActionButton key={id} {...action} />
            ))} */}
          </View>
          <FullSize onPress={() => router.navigate("/protected/records/add")} title="Thêm lịch uống"></FullSize>
          <FullSize onPress={() => router.navigate("/protected/records")} title="Chỉ số sức khỏe"></FullSize>
        </View>
        <OverviewHealthRecordChart />
      </View>
    </ScrollView>
  );
}
