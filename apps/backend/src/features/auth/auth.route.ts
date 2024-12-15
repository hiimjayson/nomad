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
      const { type, uid } = await UserService.checkUserType(
        req.body.phoneNumber.replace(/[^\d]/g, "")
      );

      if (type === "tester") {
        const user = await UserService.getByUid(uid);

        const tokens = jwt.generateTokens({ uid });
        res.status(200).json({
          code: "TESTER_LOGGED_IN",
          message: "테스터 로그인이 완료되었습니다.",
          result: { user, tokens },
        });
      } else {
        await AuthService.sendVerification(req.body.phoneNumber);
        res.status(200).json({
          code: "VERIFICATION_SENT",
          message: "인증번호가 발송되었습니다.",
        });
      }
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

      const { isNew, user } = await UserService.findOrCreate(phoneNumber);
      const tokens = jwt.generateTokens({ uid: user.uid });

      res.status(200).json({
        message: "로그인이 완료되었습니다.",
        result: { user, tokens, isNew },
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/check-type",
  validateZodPipe(CheckUserSchema),
  async (req, res, next) => {
    try {
      const userType = await UserService.checkUserType(req.body.phoneNumber);

      res.status(200).json({
        userType,
        message: "userType checked",
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

    res.json({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      uid: payload.uid,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
