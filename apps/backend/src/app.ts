import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRouter from "./features/auth/auth.route";
import { errorHandler } from "./common/middlewares/error-handler";

const app = express();

// 미들웨어
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// 라우터
app.use("/api/auth", authRouter);

// 에러 핸들러
app.use(errorHandler);

export default app;
