import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";

export const validate =
  (schema: ZodType) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = (await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      })) as Record<string, unknown>;

      if (parsed.body) req.body = parsed.body;
      if (parsed.query) req.query = parsed.query as Request["query"];
      if (parsed.params) req.params = parsed.params as Request["params"];

      next();
    } catch (error) {
      next(error);
    }
  };
