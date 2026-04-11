import * as z from "zod";

interface LoginRequestRaw {
  identifier: string;
  email: string;
  password: string;
}
export type LoginRequest = Omit<LoginRequestRaw, "email">;
export type ForgotPasswordRequest = Omit<LoginRequestRaw, "identifier"> & { otp: string };

export const LoginRequestSchema = z
  .object({
    identifier: z.string().min(1, "Vui lòng nhập email hoặc số điện thoại"),
    password: z.string().min(1, "Vui lòng nhập mật khẩu"),
  })
  .strict();
