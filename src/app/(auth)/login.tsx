import { Button, Input } from "@rneui/themed";
import { Eye, EyeOff, Lock, Mail } from "lucide-react-native";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from "react-native";

function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    Alert.alert("Thông báo", "Tính năng đăng nhập đang được phát triển");
  };

  return (
    <KeyboardAvoidingView
      style={styles.page}
      behavior={Platform.select({ ios: "padding", default: undefined })}
      keyboardVerticalOffset={14}
    >
      <View style={styles.formContainer}>
        <Input
          numberOfLines={1}
          label="Email hoặc Số điện thoại"
          placeholder="Nhập email hoặc số điện thoại"
          value={identifier}
          onChangeText={setIdentifier}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          labelStyle={styles.label}
          containerStyle={styles.inputWrapper}
          inputContainerStyle={styles.inputContainer}
          inputStyle={styles.inputText}
          leftIcon={<Mail size={20} color="#98A6BA" strokeWidth={2.2} />}
          leftIconContainerStyle={styles.leftIconContainer}
          placeholderTextColor="#98A6BA"
          renderErrorMessage={false}
        />

        <Input
          numberOfLines={1}
          label="Mật khẩu"
          placeholder="Nhập mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoCorrect={false}
          labelStyle={styles.label}
          containerStyle={styles.inputWrapper}
          inputContainerStyle={styles.inputContainer}
          inputStyle={styles.inputText}
          leftIcon={<Lock size={20} color="#98A6BA" strokeWidth={2.2} />}
          leftIconContainerStyle={styles.leftIconContainer}
          rightIcon={
            <Pressable onPress={() => setShowPassword((currentShowPassword) => !currentShowPassword)} hitSlop={8}>
              {showPassword ? (
                <EyeOff size={20} color="#98A6BA" strokeWidth={2.2} />
              ) : (
                <Eye size={20} color="#98A6BA" strokeWidth={2.2} />
              )}
            </Pressable>
          }
          rightIconContainerStyle={styles.rightIconContainer}
          placeholderTextColor="#98A6BA"
          renderErrorMessage={false}
        />

        <Pressable
          onPress={() => Alert.alert("Thông báo", "Tính năng quên mật khẩu đang được phát triển")}
          style={styles.forgotPasswordButton}
        >
          <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
        </Pressable>

        <Button
          title="Đăng nhập"
          onPress={handleLogin}
          buttonStyle={styles.loginButton}
          titleStyle={styles.loginButtonTitle}
          iconRight
          iconContainerStyle={styles.loginIcon}
        />

        <View style={styles.registerSection}>
          <Text style={styles.registerHint}>Chưa có tài khoản?</Text>
          <Pressable onPress={() => Alert.alert("Thông báo", "Tính năng đăng ký đang được phát triển")}>
            <Text style={styles.registerAction}>Đăng ký ngay</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
  },
  formContainer: {
    paddingTop: 12,
  },
  label: {
    color: "#303E53",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  inputWrapper: {
    paddingHorizontal: 0,
    marginBottom: 6,
  },
  inputContainer: {
    minHeight: 56,
    borderBottomWidth: 0,
    borderWidth: 1,
    borderColor: "#E0E8F3",
    borderRadius: 14,
    backgroundColor: "#EEF3F8",
    paddingHorizontal: 14,
  },
  inputText: {
    color: "#2E3B4F",
    fontSize: 18,
    fontWeight: "500",
    overflow: "hidden",
  },
  leftIconContainer: {
    marginRight: 8,
  },
  rightIconContainer: {
    marginLeft: 8,
  },
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

export default LoginPage;
