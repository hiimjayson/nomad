import { Router } from "express";
import { sendVerification, verifyCode } from "./auth.service";
import { SendVerificationSchema, VerifyCodeSchema } from "./auth.schema";
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

export default router;
