import { randomUUID } from "crypto";
import { pinoHttp } from "pino-http";
import { logger } from "../config/logger.js";

export const httpLogger = pinoHttp({
  logger,

  genReqId: () => randomUUID(),

  customSuccessMessage(req, res) {
    return `${req.method} ${req.url} completed`;
  },

  customErrorMessage(req) {
    return `${req.method} ${req.url} failed`;
  },

  serializers: {
    req(req) {
      return {
        id: req.id,
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      };
    },

    res(res) {
      return {
        statusCode: res.statusCode,
      };
    },
  },

  customProps(req) {
    return {
      requestId: req.id,
    };
  },
});