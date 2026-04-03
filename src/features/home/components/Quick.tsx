import QR from "@/components/QR";
import { View } from "react-native";
import WelcomeComponent from "./Welcome";
import BigHelpButton from "./buttons/BigHelp";

function QuickComponent() {
  return (
    <View className="flex gap-4 px-8 py-4 rounded-tl-xl rounded-tr-xl bg-blue-100 ">
      <View className={`w-full flex-row justify-between gap-2 items-center `}>
        <WelcomeComponent />
        <QR size={64} />
      </View>
      <BigHelpButton />
    </View>
  );
}
export default QuickComponent;
