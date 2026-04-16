import FullSize from "@/components/buttons/FullSize";
import { hardcodedID } from "@/features/record/schema";
import useSubPageTitle from "@/hooks/useSubPageTitle";
import { Stack, useRouter } from "expo-router";

export default function RecordListLayout() {
  useSubPageTitle("Xem các lần đo đã lưu");
  const router = useRouter();
  return (
    <>
      <FullSize
        title="Xem thành viên 2"
        onPress={() => {
          router.replace({
            pathname: "/protected/records/(list)",
            params: { id: hardcodedID.memberID },
          });
        }}
      />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </>
  );
}
