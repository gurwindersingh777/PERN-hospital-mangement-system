
import { pinoHttp } from "pino-http";
import { logger } from "../config/logger.js";

export const httpLogger = pinoHttp({
  logger,

  serializers: {
    req(req) {
      return {
        method: req.method,
        url: req.url,
        ip: req.ip,
      };
    },

    res(res) { return { statusCode: res.statusCode } }
  }
});