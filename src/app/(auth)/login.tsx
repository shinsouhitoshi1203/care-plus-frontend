import FullSizeButton from "@/components/buttons/FullSize";
import ControlledInput from "@/components/input/ControlledInput";
import { styles } from "@/components/input/style";
import LoadingDialog from "@/components/Loading/LoadingDialog";
import { AccountAPI } from "@/features/account/api";
import AuthAPI from "@/features/auth/api";
import { type LoginRequest, LoginRequestSchema } from "@/features/auth/schema/Login";
import TokenService from "@/features/auth/token";
import withWaitFallback from "@/hocs/withWaitFallback";
import secureStore from "@/stores/secureStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "expo-router";
import { Lock, Mail } from "lucide-react-native";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Alert, KeyboardAvoidingView, Platform, Pressable, Text, View } from "react-native";
const fieldLists = [
  {
    name: "identifier",
    leftIcon: Mail,
    placeholder: "Nhập email hoặc SĐT",
    label: "Email / số điện thoại",
    type: "email-address",
  },
  {
    name: "password",
    leftIcon: Lock,
    placeholder: "Nhập mật khẩu",
    label: "Mật khẩu",
    toggleDataVisible: true,
    autoComplete: "password",
    textContentType: "password",
  },
];

function LoginPage() {
  const {
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginRequestSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (loginData: LoginRequest) => await AuthAPI.login(loginData),
    onError: async (error, loginData) => {
      if (error instanceof AxiosError && error.response?.status === 401) {
        setError("root", { type: "manual", message: "Sai tên đăng nhập hoặc mật khẩu" });
      } else if (error instanceof AxiosError && error.response?.status === 403) {
        // Get email address and resend OTP
        const { identifier } = loginData;
        try {
          const email = await AccountAPI.resendOTPByLogin(identifier);
          await secureStore.set("otp.email", email);
          router.replace({
            pathname: "/(auth)/otp",
            params: {
              showNeedVerifyInOTPScreen: 1,
              email: email,
            },
          });
        } catch (error) {
          console.log(error);
          setError("root", { type: "manual", message: "Tài khoản đã xác thực hoặc không tồn tại." });
        }
      } else if (error instanceof AxiosError && error.response?.status === 500) {
        setError("root", {
          type: "manual",
          message: "Đã có lỗi xảy ra trên máy chủ. Vui lòng thử lại sau.",
        });
      } else if (error instanceof AxiosError && error.code === "ERR_NETWORK") {
        setError("root", {
          type: "manual",
          message: "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.",
        });
      } else {
        console.log("Unexpected error during login:", error.stack);
        setError("root", { type: "manual", message: "Đã có lỗi xảy ra. Vui lòng thử lại sau." });
      }
    },
    mutationKey: ["user"],
    onSuccess: async (data) => {
      const { tokens } = data;
      await TokenService.setTokens(tokens);

      if (router.canDismiss()) router.dismissAll();
      router.replace("/protected/(tabs)/home");
    },
    onSettled: () => {},
  });

  const handleLogin = useCallback(
    async (loginData: LoginRequest) => {
      try {
        await mutateAsync(loginData);
      } catch (error) {
        // Error handling is already done in onError, so we can leave this empty or log the error if needed
        console.log("Unhandled error in handleLogin:", error);
      }
    },
    [mutateAsync]
  );

  return (
    <>
      <LoadingDialog show={isPending} />
      <KeyboardAvoidingView
        className="flex-1 justify-center"
        behavior={Platform.select({ ios: "padding", default: undefined })}
        keyboardVerticalOffset={14}
      >
        <View style={{ paddingTop: 12 }}>
          <View style={{ gap: 12 }}>
            {fieldLists.map((field) => (
              <ControlledInput key={field.name} control={control} {...field} />
            ))}
            {errors.root && <Text style={{ color: "red", fontSize: 14 }}>{errors.root?.message}</Text>}
          </View>

          <Pressable
            onPress={() => Alert.alert("Thông báo", "Tính năng quên mật khẩu đang được phát triển")}
            style={styles.linkContainerRight}
          >
            <Text style={styles.link}>Quên mật khẩu?</Text>
          </Pressable>

          <FullSizeButton disabled={isPending} title="Đăng nhập" onPress={handleSubmit(handleLogin)} />

          <View style={styles.bottomSection}>
            <Text style={styles.bottomHint}>Chưa có tài khoản?</Text>
            <Pressable onPress={() => router.navigate("/(auth)/register")}>
              <Text style={styles.bottomAction}>Đăng ký ngay</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

export default withWaitFallback(LoginPage);
