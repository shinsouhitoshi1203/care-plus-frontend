import FullSizeButton from "@/components/buttons/FullSize";
import ControlledInput from "@/components/input/ControlledInput";
import LoadingDialog from "@/components/Loading/LoadingDialog";
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
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from "react-native";
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
    onError: (error) => {
      if (error instanceof AxiosError && error.status === 401) {
        setError("root", { type: "manual", message: "Sai tên đăng nhập hoặc mật khẩu" });
      } else if (error instanceof AxiosError && error.code === "ERR_NETWORK") {
        setError("root", {
          type: "manual",
          message: "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.",
        });
      } else {
        setError("root", { type: "manual", message: "Đã có lỗi xảy ra. Vui lòng thử lại sau." });
      }
    },
    mutationKey: ["auth"],
    onSuccess: (data) => {
      const { tokens, user } = data;
      TokenService.setTokens(tokens);
      secureStore.set("userInfo", JSON.stringify(user));
      queryClient.invalidateQueries(["user", "auth"] as any);
      // queryClient.setQueryData(["user"], user);
      // queryClient.setQueryData(["auth"], { isAuthenticated: true });
    },
  });

  const handleLogin = useCallback(
    async (loginData: LoginRequest) => {
      try {
        await mutateAsync(loginData);
        router.push("/protected/home");
      } catch (error) {
        // Error handling is already done in onError, so we can leave this empty or log the error if needed
        console.log("Unhandled error in handleLogin:", error);
      }
    },
    [mutateAsync, router]
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
            style={styles.forgotPasswordButton}
          >
            <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
          </Pressable>

          <FullSizeButton disabled={isPending} title="Đăng nhập" onPress={handleSubmit(handleLogin)} />

          <View style={styles.registerSection}>
            <Text style={styles.registerHint}>Chưa có tài khoản?</Text>
            <Pressable onPress={() => Alert.alert("Thông báo", "Tính năng đăng ký đang được phát triển")}>
              <Text style={styles.registerAction}>Đăng ký ngay</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  forgotPasswordButton: {
    alignSelf: "flex-end",
    marginTop: 2,
    marginBottom: 22,
  },
  forgotPasswordText: {
    color: "#2C5EDB",
    fontSize: 21,
    fontWeight: "700",
  },
  loginButton: {
    minHeight: 58,
    borderRadius: 13,
    backgroundColor: "#2C5EDB",
  },
  loginButtonTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  loginIcon: {
    marginLeft: 10,
  },
  registerSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 28,
    gap: 6,
  },
  registerHint: {
    color: "#74839A",
    fontSize: 16,
    fontWeight: "500",
  },
  registerAction: {
    color: "#2C5EDB",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default withWaitFallback(LoginPage);
