import { redis } from "../../providers/redis";
import { smsClient } from "../../providers/sms";
import { VerificationInfo } from "./types";
import { BadRequestError } from "../../common/errors/http.error";
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

export async function verifyCode(phoneNumber: string, code: string) {
  const key = getVerificationKey(phoneNumber);
  const storedData = await redis.get<string>(key);

  if (!storedData) {
    throw new BadRequestError("인증번호를 찾을 수 없거나 만료되었습니다.");
  }

  const verificationInfo = JSON.parse(storedData) as VerificationInfo;

  if (Date.now() > verificationInfo.expiresAt) {
    await redis.del(key);
    throw new BadRequestError("인증번호가 만료되었습니다.");
  }

  if (verificationInfo.code !== code) {
    throw new BadRequestError("잘못된 인증번호입니다.");
  }

  await redis.del(key);
}
