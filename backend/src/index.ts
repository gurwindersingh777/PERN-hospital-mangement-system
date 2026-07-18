import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { logger } from "./config/logger.js";
import { env } from "./config/env.config.js";
import { httpLogger } from "./middlewares/httpLogger.js";
import { ErrorHandler } from "./middlewares/error.middleware.js";
import authRouter from "./modules/auth/auth.routes.js";
import userRouter from "./modules/user/user.route.js";
import { authenticate } from "./middlewares/authenticate.middleware.js";
import departmentRouter from "./modules/department/department.routes.js";
import doctorRouter from "./modules/doctor/doctor.routes.js";
import patientRouter from "./modules/patient/patient.routes.js";

const app = express();
const PORT = env.PORT;

app.use(httpLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(cookieParser());

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "OK" });
});

app.use("/api/auth", authRouter);
app.use("/api/users", authenticate, userRouter);
app.use("/api/departments", authenticate, departmentRouter);
app.use("/api/doctors", authenticate, doctorRouter);
app.use("/api/patients", authenticate, patientRouter);

app.use(ErrorHandler);

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
