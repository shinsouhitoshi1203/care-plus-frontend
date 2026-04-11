import Message from "@/components/message";
import Error from "@/components/message/Error";
import { AccountAPI } from "@/features/account/api";
import secureStore from "@/stores/secureStore";
import useZustandStore from "@/stores/zustand";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { OtpInput } from "react-native-otp-entry";

function OTPVerification() {
  const [error, setError] = useState<null | string>(null);
  const [message, setMessage] = useState<null | string>(null);

  const setLoading = useZustandStore((state) => state.setLoading);
  const router = useRouter();

  const { mutate } = useMutation({
    mutationFn: async (otp: string) => {
      const email = await secureStore.get("otp.email");
      if (!email) throw new AxiosError("Không tìm thấy email để xác thực", "OTP_VERIFICATION_ERROR");

      await AccountAPI.verifyOTP({ email, otp });
    },
    onMutate: () => {
      setError(null);
      setLoading(true);
      setMessage(null);
    },
    onSuccess: async () => {
      await secureStore.delete("otp.email");
      router.replace("/(auth)/finish");
    },
    onError: (error) => {
      console.log("OTP verification failed!");
      if (error instanceof AxiosError && error.code === "OTP_VERIFICATION_ERROR") {
        setError(error.message);
      } else if (error instanceof AxiosError && error.response?.status === 400) {
        setError(error.response?.data?.message);
      } else {
        setError("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
      }
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const { mutate: resendOTP } = useMutation({
    mutationFn: async () => {
      const email = await secureStore.get("otp.email");
      if (!email) throw new AxiosError("Không tìm thấy email để xác thực.");
      await AccountAPI.resendOTP({ email });
    },
    onMutate: () => {
      setError(null);
      setMessage(null);
      setLoading(true);
    },
    onSuccess: async () => {
      setMessage("Đã gửi lại mã OTP thành công.");
    },
    // mutationKey: ["user"],
    onError: (error) => {
      console.log("OTP verification failed!");
      if (error instanceof AxiosError && error.code === "OTP_VERIFICATION_ERROR") {
        setError(error.message);
      } else if (error instanceof AxiosError && [400, 404].includes(error.response?.status ?? 0)) {
        setError(error.response?.data?.message);
      } else {
        setError("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
      }
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const sendOTPHandler = useCallback(
    (otp: string) => {
      mutate(otp);
    },
    [mutate]
  );

  const resendOTPHandler = useCallback(() => {
    resendOTP();
  }, [resendOTP]);

  // useEffect(() => {
  //   console.log("> ", error);
  // }, [error]);

  return (
    <>
      <View style={{ paddingLeft: 20, paddingRight: 20 }}>
        <Text className="text-3xl font-bold text-center py-4">Nhập mã OTP</Text>
        <Text className="text-xl font-normal text-center py-4">
          Đã gửi OTP đến địa chỉ email mà bạn đã nhập. Vui lòng kiểm tra hộp thư đến của bạn.
        </Text>

        {error !== null ? <Error.Block text={error} /> : null}
        {message !== null ? <Message.Block text={message} show={true} /> : null}

        <View className="py-10">
          <OtpInput numberOfDigits={6} onFilled={sendOTPHandler} autoFocus />
        </View>

        <View>
          <Pressable hitSlop={8} onPress={resendOTPHandler}>
            <Text className="text-center text-blue-500">Gửi lại mã OTP</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}
export default OTPVerification;
