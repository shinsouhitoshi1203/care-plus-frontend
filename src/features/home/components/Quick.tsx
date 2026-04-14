import QR from "@/components/QR";
import { AccountAPI } from "@/features/account/api";
import { useQuery } from "@tanstack/react-query";
import { createContext } from "react";
import { View } from "react-native";
import WelcomeComponent from "./Welcome";
import BigHelpButton from "./buttons/BigHelp";
export const QuickComponentContext = createContext("");
function QuickComponent() {
  const { data } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      return await AccountAPI.getAccount();
    },
    select: (user) => {
      const URL_BASE = "https://care-plus-backend-production.up.railway.app";
      const qr_code_url = `${URL_BASE}/user/${user.id}/qr-code`;
      return {
        fullName: user.full_name,
        qr_code_url: qr_code_url,
      };
    },
  });
  return (
    <QuickComponentContext.Provider value={data}>
      <View className="flex gap-4 px-8 py-4 rounded-tl-xl rounded-tr-xl bg-blue-100 ">
        <View className={`w-full flex-row justify-between gap-2 items-center `}>
          <WelcomeComponent />
          <QR size={64} url={data?.qr_code_url} />
        </View>
        <BigHelpButton />
      </View>
    </QuickComponentContext.Provider>
  );
}
export default QuickComponent;
