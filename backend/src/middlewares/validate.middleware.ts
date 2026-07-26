import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const validate =
  (schema: z.ZodType) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = (await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      })) as {
        body: unknown;
        query?: unknown;
        params?: unknown;
      };

      req.body = parsed.body;

      next();
    } catch (err) {
      next(err);
    }
  };
