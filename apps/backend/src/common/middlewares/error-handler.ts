import { Request, Response, NextFunction } from "express";
import { HttpError } from "../errors/http.error";
import { ZodError } from "zod";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(error);

  if (error instanceof HttpError) {
    return res.status(error.statusCode).json({
      message: error.message,
      data: error.data,
    });
  }

  if (error instanceof ZodError) {
    return res.status(400).json({
      message: "유효성 검사 실패",
      data: error.errors,
    });
  }

  res.status(500).json({ message: "서버 에러가 발생했습니다." });
};
