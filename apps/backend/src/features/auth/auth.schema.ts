import { z } from "zod";
import { UserSchema } from "../user/user.schema";

// UserSchema에서 phoneNumber 필드만 선택
const PhoneNumberSchema = UserSchema.pick({
  phoneNumber: true,
});

export const SendVerificationSchema = PhoneNumberSchema;

export const VerifyCodeSchema = PhoneNumberSchema.extend({
  code: z.string(),
});

export const CheckUserSchema = PhoneNumberSchema;

export type SendVerificationRequest = z.infer<typeof SendVerificationSchema>;
export type VerifyCodeRequest = z.infer<typeof VerifyCodeSchema>;
export type CheckUserRequest = z.infer<typeof CheckUserSchema>;
