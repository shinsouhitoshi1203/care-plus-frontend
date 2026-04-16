import Message from "@/components/message";
import Error from "@/components/message/Error";
import { AccountAPI } from "@/features/account/api";
import TokenService from "@/features/auth/token";
import secureStore from "@/stores/secureStore";
import useZustandStore from "@/stores/zustand";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { OtpInput } from "react-native-otp-entry";

function OTPVerification() {
  const [error, setError] = useState<null | string>(null);
  const [message, setMessage] = useState<null | string>(null);

  const setLoading = useZustandStore((state) => state.setLoading);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: async (otp: string) => {
      const email = await secureStore.get("otp.email");
      if (!email) throw new AxiosError("Không tìm thấy email để xác thực", "OTP_VERIFICATION_ERROR");
      const {
        data: { data },
      } = await AccountAPI.verifyOTP({ email, otp });
      return data;
    },
    mutationKey: ["user"],
    onMutate: () => {
      setError(null);
      setLoading(true);
      setMessage(null);
    },
    onSuccess: async (jsonData) => {
      // console.log("OTP verification successful!", data);
      const {
        data: { user, tokens },
      } = jsonData;
      // queryClient.setQueryData(["user"], user);
      await TokenService.setTokens(tokens);
      await secureStore.delete("otp.email");
      if (router.canDismiss()) router.dismissAll();
      router.replace("/(auth)/finish");
    },
    onError: (error) => {
      console.log("OTP verification failed!");
      if (error instanceof AxiosError && error.code === "OTP_VERIFICATION_ERROR") {
        setError(error.message);
      } else if (error instanceof AxiosError && error.status === 400) {
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
    async (otp: string) => {
      try {
        await mutateAsync(otp);
      } catch (error) {}
    },
    [mutateAsync]
  );

  const resendOTPHandler = useCallback(() => {
    resendOTP();
  }, [resendOTP]);

  const { showNeedVerifyInOTPScreen, email } = useLocalSearchParams();
  return (
    <>
      <View style={{ paddingLeft: 20, paddingRight: 20 }}>
        <Text className="text-3xl font-bold text-center py-4">Nhập mã OTP</Text>
        <Text className="text-xl font-normal text-center py-4">
          {showNeedVerifyInOTPScreen && "Tài khoản của bạn chưa được xác thực. "}
          Hệ thống đã gửi OTP đến địa chỉ email <Text className="font-bold">{email}</Text>
        </Text>

        {error !== null ? <Error.Block text={error} /> : null}
        {message !== null ? <Message.Block text={message} show={true} /> : null}

        <View className="py-10">
          <OtpInput numberOfDigits={6} onFilled={sendOTPHandler} autoFocus />
        </View>

        <View>
          <Text className="text-lg  text-gray-500 text-center mb-4">
            Hãy kiểm tra hộp thư đến của bạn (bao gồm mục spam), hoặc:
          </Text>
          <Pressable hitSlop={8} onPress={resendOTPHandler}>
            <Text className="text-center text-blue-500 text-lg font-bold">Gửi lại mã OTP</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}
export default OTPVerification;
