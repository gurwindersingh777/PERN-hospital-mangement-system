import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware.js";
import { getPatientsSchema, patientSchema, updatePatientSchema } from "./patient.schema.js";
import { patientController } from "./patient.controller.js";
import { authorizeRole } from "../../middlewares/authorizeRole.middleware.js";
import { UserRole } from "@prisma/client";

const patientRouter = Router();

patientRouter.get("/", validate(getPatientsSchema), patientController.findAll);
patientRouter.get("/:id", patientController.findById);
patientRouter.post(
  "/",
  authorizeRole(UserRole.ADMIN),
  validate(patientSchema),
  patientController.create
);
patientRouter.patch(
  "/:id",
  authorizeRole(UserRole.ADMIN),
  validate(updatePatientSchema),
  patientController.update
);

export default patientRouter;
