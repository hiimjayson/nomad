import { Router } from "express";
import { sendVerification, verifyCode } from "../features/auth/auth.service";

const router = Router();

router.post("/send-verification", async (req, res, next) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ message: "전화번호가 필요합니다." });
    }

    await sendVerification(phoneNumber);
    res.status(200).json({ message: "인증번호가 발송되었습니다." });
  } catch (error) {
    next(error);
  }
});

router.post("/verify-code", async (req, res, next) => {
  try {
    const { phoneNumber, code } = req.body;

    if (!phoneNumber || !code) {
      return res
        .status(400)
        .json({ message: "전화번호와 인증번호가 필요합니다." });
    }

    await verifyCode(phoneNumber, code);
    res.status(200).json({ message: "인증이 완료되었습니다." });
  } catch (error) {
    next(error);
  }
});

export default router;
