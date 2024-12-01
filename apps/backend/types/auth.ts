export interface SendVerificationRequest {
  phoneNumber: string;
}

export interface VerifyCodeRequest {
  phoneNumber: string;
  code: string;
}

export interface VerificationInfo {
  code: string;
  expiresAt: number;
}
