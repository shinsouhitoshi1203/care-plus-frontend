import FullSizeButton from "@/components/buttons/FullSize";
import ControlledInput from "@/components/input/ControlledInput";
import { styles } from "@/components/input/style";
import LoadingDialog from "@/components/Loading/LoadingDialog";
import Error from "@/components/message/Error";
import { AccountAPI } from "@/features/account/api";
import { ForgotRequestSchema, OTP } from "@/features/account/schema";
import withWaitFallback from "@/hocs/withWaitFallback";
import secureStore from "@/stores/secureStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "expo-router";
import { Mail } from "lucide-react-native";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Alert, KeyboardAvoidingView, Platform, Pressable, Text, View } from "react-native";
const fieldLists = [
  {
    name: "email",
    leftIcon: Mail,
    placeholder: "Nhập email",
    type: "email-address",
  },
];

function ForgetPasswordPage() {
  const {
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ForgotRequestSchema),
  });
  const router = useRouter();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (forgotPasswordData: Omit<OTP, "otp">) => await AccountAPI.forgotPassword(forgotPasswordData),

    onError: (error) => {
      if (error instanceof AxiosError && error.response?.status === 404) {
        setError("root", { type: "manual", message: error.response?.data?.message });
      } else if (error instanceof AxiosError && error.code === "ERR_NETWORK") {
        setError("root", {
          type: "manual",
          message: "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.",
        });
      } else {
        console.log("Unexpected error during forgot password:", error.stack);
        setError("root", { type: "manual", message: "Đã có lỗi xảy ra. Vui lòng thử lại sau." });
      }
    },
    onSuccess: async (_, payload) => {
      const { email } = payload;
      await secureStore.set("otp.email", email);
      router.replace("/(auth)/verify-forgot-password");
    },
    onSettled: () => {},
  });

  const handleForgetPassword = useCallback(
    async (data: Omit<OTP, "otp">) => {
      try {
        let devMode = true;
        if (devMode) {
          Alert.alert("Thông báo", "Tính năng chưa triển khai xong");
        } else {
          await mutateAsync(data);
        }
      } catch (error) {
        // Error handling is already done in onError, so we can leave this empty or log the error if needed
        console.log("Unhandled error in handleForgetPassword:", error);
      }
    },
    [mutateAsync]
  );

  return (
    <>
      <LoadingDialog show={isPending} />
      <KeyboardAvoidingView
        className="flex-1 justify-top"
        behavior={Platform.select({ ios: "padding", default: undefined })}
        keyboardVerticalOffset={14}
      >
        <View style={{ alignItems: "center", marginBottom: 24 }}>
          <Text className="text-2xl font-bold">Quên mật khẩu</Text>
          <Text className="mt-4">Nhập email của bạn</Text>
        </View>
        <View style={{ paddingTop: 12 }}>
          <View style={{ gap: 12 }}>
            {errors.root && <Error.Block text={errors.root.message} />}

            {fieldLists.map((field) => (
              <ControlledInput key={field.name} control={control} {...field} />
            ))}
            <FullSizeButton disabled={isPending} title="Gửi yêu cầu" onPress={handleSubmit(handleForgetPassword)} />

            <View style={styles.bottomSection}>
              <Pressable onPress={() => router.navigate("/(auth)/login")}>
                <Text style={styles.bottomAction}>Quay lại đăng nhập</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

export default withWaitFallback(ForgetPasswordPage);
