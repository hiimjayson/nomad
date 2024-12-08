import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";
import { BadRequestError } from "../errors/http.error";

export const validateBody =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await schema.safeParseAsync(req.body);

      if (!result.success) {
        const formattedError = formatZodError(result.error);
        throw new BadRequestError("유효성 검사 실패", formattedError);
      }

      req.body = result.data;
      next();
    } catch (error) {
      next(error);
    }
  };

function formatZodError(error: ZodError) {
  return error.errors.map((err) => ({
    path: err.path.join("."),
    message: err.message,
  }));
}
