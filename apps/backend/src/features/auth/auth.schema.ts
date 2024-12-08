import { z } from "zod";

export const SendVerificationSchema = z.object({
  phoneNumber: z.string(),
});

export const VerifyCodeSchema = z.object({
  phoneNumber: z.string(),
  code: z.string(),
});

export type SendVerificationRequest = z.infer<typeof SendVerificationSchema>;
export type VerifyCodeRequest = z.infer<typeof VerifyCodeSchema>;
