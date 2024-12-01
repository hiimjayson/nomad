import { VerificationInfo } from "../types/auth";

export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function getVerificationKey(phoneNumber: string): string {
  return `verification:${phoneNumber}`;
}

export function createVerificationInfo(code: string): VerificationInfo {
  return {
    code,
    expiresAt: Date.now() + 3 * 60 * 1000, // 3 minutes
  };
}
