import { Router } from "express";
import { UserRole } from "@prisma/client";
import { validate } from "../../middlewares/validate.middleware.js";
import { authorizeRole } from "../../middlewares/authorizeRole.middleware.js";
import {
  appointmentSchema,
  updateAppointmentSchema,
  getAppointmentsSchema,
} from "./appointment.schema.js";
import { appointmentController } from "./appointment.controller.js";

const appointmentRouter = Router();

appointmentRouter.post(
  "/",
  authorizeRole(UserRole.ADMIN),
  validate(appointmentSchema),
  appointmentController.create
);

appointmentRouter.get(
  "/",
  authorizeRole(UserRole.ADMIN),
  validate(getAppointmentsSchema),
  appointmentController.findAll
);

appointmentRouter.get(
  "/:id",
  authorizeRole(UserRole.ADMIN),
  appointmentController.findById
);

appointmentRouter.patch(
  "/:id",
  authorizeRole(UserRole.ADMIN),
  validate(updateAppointmentSchema),
  appointmentController.update
);

export default appointmentRouter;