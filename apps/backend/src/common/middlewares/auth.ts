import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../errors/http.error";

export const validateBearerToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    throw new BadRequestError("Bearer 토큰이 필요합니다.");
  }

  req.token = authHeader.split(" ")[1];
  next();
};
