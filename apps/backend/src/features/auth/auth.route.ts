import { Router } from "express";
import * as AuthService from "./auth.service";
import * as UserService from "../user/user.service";
import {
  SendVerificationSchema,
  VerifyCodeSchema,
  CheckUserSchema,
} from "./auth.schema";
import { validateZodPipe } from "../../common/middlewares/zod-pipe";
import { validateBearerToken } from "../../common/middlewares/auth";
import { jwt } from "../../providers/jwt";

const router = Router();

router.post(
  "/send-verification",
  validateZodPipe(SendVerificationSchema),
  async (req, res, next) => {
    try {
      await AuthService.sendVerification(req.body.phoneNumber);
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
      await AuthService.verifyCode(phoneNumber, code);

      const user = await UserService.findOrCreate(phoneNumber);
      const tokens = jwt.generateTokens({ uid: user.uid });

      res.status(200).json({
        message: user.isNew
          ? "회원가입이 완료되었습니다."
          : "로그인이 완료되었습니다.",
        result: {
          user,
          tokens,
        },
      });
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
      const exists = await UserService.checkExists(req.body.phoneNumber);
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

router.post("/refresh", validateBearerToken, async (req, res, next) => {
  try {
    const payload = jwt.verifyRefreshToken(req.token!);
    const tokens = jwt.generateTokens({ uid: payload.uid });

    res.status(200).json({
      message: "토큰이 갱신되었습니다.",
      ...tokens,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
