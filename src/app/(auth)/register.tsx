import FullSizeButton from "@/components/buttons/FullSize";
import ControlledInput from "@/components/input/ControlledInput";
import { styles } from "@/components/input/style";
import LoadingDialog from "@/components/Loading/LoadingDialog";
import Error from "@/components/message/Error";
import { AccountAPI } from "@/features/account/api";
import { RegisterRequest, RegisterRequestSchema } from "@/features/account/schema";
import secureStore from "@/stores/secureStore";
import { convertObjectKeys } from "@/utils/string";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "expo-router";
import { Lock, Mail, Phone } from "lucide-react-native";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";
const fieldLists = [
  {
    name: "fullName",
    placeholder: "Nhập họ tên",
    label: "Họ và tên",
    required: true,
  },
  {
    name: "phone",
    leftIcon: Phone,
    placeholder: "Nhập số điện thoại",
    label: "Số điện thoại",
    type: "phone-pad",
    required: true,
  },
  {
    name: "email",
    leftIcon: Mail,
    placeholder: "Nhập email",
    label: "Địa chỉ email",
    required: true,
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
    required: true,
  },
];
function RegisterPage() {
  const {
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(RegisterRequestSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      password: "",
    },
  });
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: async (registerData: RegisterRequest) => {
      await secureStore.set("otp.email", registerData.email);
      return await AccountAPI.register(registerData);
    },
    onError: (error) => {
      // console.log("Registration error:", error);
      if (error instanceof AxiosError && error.status === 401) {
        setError("root", { type: "manual", message: "Sai tên đăng nhập hoặc mật khẩu" });
      } else if (error instanceof AxiosError && error.code === "ERR_NETWORK") {
        setError("root", {
          type: "manual",
          message: "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.",
        });
      } else if (error instanceof AxiosError) {
        setError("root", {
          type: "manual",
          message: error.response?.data?.message,
        });
      } else {
        console.log("Unexpected error during login:", error.stack);
        setError("root", { type: "manual", message: "Đã có lỗi xảy ra. Vui lòng thử lại sau." });
      }
    },
    mutationKey: ["user"],
    onSuccess: async (data) => {
      router.replace("/(auth)/otp");
    },
  });
  const handleRegister = useCallback(
    (formData: Record<string, unknown>) => {
      const convertedData = convertObjectKeys(formData, "camelToSnake");
      mutate(convertedData as RegisterRequest);
    },
    [mutate]
  );
  return (
    <>
      <LoadingDialog show={isPending} />
      <View style={{ paddingLeft: 20, paddingRight: 20 }}>
        <Text className="text-3xl font-bold text-center py-4">Đăng ký tài khoản</Text>
        {errors.root && <Error.Block text={errors.root.message} />}
      </View>
      <KeyboardAvoidingView
        className="justify-top"
        behavior={Platform.select({ ios: "padding", default: undefined })}
        keyboardVerticalOffset={24}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
          <View style={{ paddingTop: 12 }}>
            <View style={{ gap: 12 }}>
              {fieldLists.map((field) => (
                <ControlledInput key={field.name} control={control} {...field} />
              ))}
            </View>
            <FullSizeButton disabled={isPending} title="Đăng ký" onPress={handleSubmit(handleRegister)} />

            <View style={styles.bottomSection}>
              <Text style={styles.bottomHint}>Đã có tài khoản?</Text>
              <Pressable onPress={() => router.navigate("/(auth)/login")}>
                <Text style={styles.bottomAction}>Đăng nhập ngay</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
export default RegisterPage;
