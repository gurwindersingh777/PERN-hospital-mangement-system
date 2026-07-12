import { Router } from "express";
import { authorizeRole } from "../../middlewares/authorizeRole.middleware.js";
import { UserRole } from "@prisma/client";
import { userController } from "./user.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  createUserSchema,
  updateUserSchema,
  userParamsSchema,
} from "./user.schema.js";

const userRouter = Router();

userRouter.post("/",authorizeRole(UserRole.ADMIN),validate(createUserSchema),userController.create);
userRouter.get("/:id",authorizeRole(UserRole.ADMIN),validate(userParamsSchema),userController.findById);
userRouter.get("/", authorizeRole(UserRole.ADMIN), userController.findAll);
userRouter.patch("/:id",authorizeRole(UserRole.ADMIN),validate(updateUserSchema),userController.update);

export default userRouter;
