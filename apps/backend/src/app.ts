import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRouter from "./routes/auth";

const app = express();

// 미들웨어
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// 라우터
app.use("/api/auth", authRouter);

// 기본 에러 핸들러
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ message: "서버 에러가 발생했습니다." });
  }
);

export default app;
