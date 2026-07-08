import { Router } from "express";
import { authController } from "./auth.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { loginSchema, registerSchema } from "./auth.schema.js";

const authRouter = Router();

authRouter.post("/register", validate(registerSchema), authController.registerUser);
authRouter.post("/login", validate(loginSchema), authController.loginUser);

export default authRouter;