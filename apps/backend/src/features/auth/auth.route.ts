import { Router } from "express";
import { sendVerification, verifyCode, checkUserExists } from "./auth.service";
import {
  SendVerificationSchema,
  VerifyCodeSchema,
  CheckUserSchema,
} from "./auth.schema";
import { validateZodPipe } from "../../common/middlewares/zod-pipe";

const router = Router();

router.post(
  "/send-verification",
  validateZodPipe(SendVerificationSchema),
  async (req, res, next) => {
    try {
      await sendVerification(req.body.phoneNumber);
      res.status(200).json({ message: "인증번호가 발송되었습니다." });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/verify-code",
  validateZodPipe(VerifyCodeSchema),
  async (req, res, next) => {
    try {
      const { phoneNumber, code } = req.body;
      await verifyCode(phoneNumber, code);
      res.status(200).json({ message: "인증이 완료되었습니다." });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/check",
  validateZodPipe(CheckUserSchema),
  async (req, res, next) => {
    try {
      const exists = await checkUserExists(req.body.phoneNumber);
      res.status(200).json({
        exists,
        message: exists
          ? "이미 가입된 사용자입니다."
          : "가입 가능한 번호입니다.",
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
