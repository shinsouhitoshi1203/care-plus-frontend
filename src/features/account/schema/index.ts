import * as z from "zod";
export interface OTP {
  email: string;
  otp: string;
}
export const UserSchema = z.object({
  email: z.email("Email không hợp lệ"),
  phone: z.string("Nhập số điện thoại").regex(/^\d{10,11}$/, "Số điện thoại không hợp lệ"),
  password: z.string("Phải đặt mật khẩu").min(1, "Phải đặt mật khẩu"),
  fullName: z.string("Họ và tên không được để trống").min(1, "Họ và tên không được để trống"),
});

export const RegisterRequestSchema = UserSchema.strict();
export const ForgotRequestSchema = UserSchema.pick({ email: true }).strict();
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export type ForgotRequest = z.infer<typeof ForgotRequestSchema>;
