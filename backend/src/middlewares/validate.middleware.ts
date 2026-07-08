import { NextFunction, Request, Response } from "express";
import z from "zod";

export const validate =
  (schema: z.ZodTypeAny) =>
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const parsed = await schema.parseAsync(req.body);
        req.body = parsed;
        next();
      } catch (error) {
        next(error);
      }
    };
