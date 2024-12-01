import { redis } from "../../lib/redis";
import { smsClient } from "../../lib/sms";
import { VerificationInfo } from "./types";
import {
  generateVerificationCode,
  getVerificationKey,
  createVerificationInfo,
} from "./util";

export async function sendVerification(phoneNumber: string): Promise<void> {
  const code = generateVerificationCode();
  const verificationInfo = createVerificationInfo(code);
  const key = getVerificationKey(phoneNumber);

  await redis.set(key, JSON.stringify(verificationInfo), { ex: 180 }); // 3분 후 만료

  await smsClient.send({
    to: [phoneNumber],
    content: `[Nomad] 인증번호는 [${code}] 입니다. 3분 이내에 입력해주세요.`,
  });
}

export async function verifyCode(
  phoneNumber: string,
  code: string
): Promise<boolean> {
  const key = getVerificationKey(phoneNumber);
  const storedData = await redis.get<string>(key);

  if (!storedData) {
    throw new Error("Verification code not found or expired");
  }

  const verificationInfo = JSON.parse(storedData) as VerificationInfo;

  if (Date.now() > verificationInfo.expiresAt) {
    await redis.del(key);
    throw new Error("Verification code expired");
  }

  if (verificationInfo.code !== code) {
    throw new Error("Invalid verification code");
  }

  await redis.del(key);
  return true;
}
