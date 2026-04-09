import * as z from "zod";

export interface LoginRequest {
  identifier: string;
  password: string;
}

export const LoginRequestSchema = z
  .object({
    identifier: z.string().min(1, "Vui lòng nhập email hoặc số điện thoại"),
    password: z.string().min(1, "Vui lòng nhập mật khẩu"),
  })
  .strict();
