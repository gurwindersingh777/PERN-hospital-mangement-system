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
import { authorizeOwnership } from "../../middlewares/authorizeOwnership.middleware.js";
import { OwnershipResource } from "../../ownership/ownership.types.js";

const appointmentRouter = Router();

appointmentRouter.post(
  "/",
  authorizeRole(UserRole.ADMIN, UserRole.RECEPTIONIST),
  validate(appointmentSchema),
  appointmentController.create
);

appointmentRouter.get(
  "/",
  authorizeRole(
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.RECEPTIONIST,
    UserRole.PATIENT
  ),
  validate(getAppointmentsSchema),
  appointmentController.findAll
);

appointmentRouter.get(
  "/:id",
  authorizeRole(
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.RECEPTIONIST,
    UserRole.PATIENT
  ),
  authorizeOwnership({
    resource: OwnershipResource.APPOINTMENT,
    getResourceId: (req) => req.params.id as string,
  }),
  appointmentController.findById
);

appointmentRouter.patch(
  "/:id",
  authorizeRole(
    UserRole.ADMIN,
    UserRole.RECEPTIONIST,
    UserRole.DOCTOR,
    UserRole.PATIENT
  ),
  authorizeOwnership({
    resource: OwnershipResource.APPOINTMENT,
    getResourceId: (req) => req.params.id as string,
  }),
  validate(updateAppointmentSchema),
  appointmentController.update
);

export default appointmentRouter;
