import { Router } from "express";
import {
  getMedicalRecordSchema,
  medicalRecordSchema,
  updateMedicalRecordSchema,
} from "./medicalRecord.schema.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { authorizeRole } from "../../middlewares/authorizeRole.middleware.js";
import { UserRole } from "@prisma/client";
import { medicalRecordController } from "./medicalRecord.controller.js";

const medicalRecordRouter = Router();

medicalRecordRouter.get(
  "/",
  authorizeRole(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  validate(getMedicalRecordSchema),
  medicalRecordController.findAll
);
medicalRecordRouter.get(
  "/:id",
  authorizeRole(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  medicalRecordController.findById
);
medicalRecordRouter.post(
  "/",
  authorizeRole(UserRole.ADMIN, UserRole.DOCTOR),
  validate(medicalRecordSchema),
  medicalRecordController.create
);
medicalRecordRouter.patch(
  "/:id",
  authorizeRole(UserRole.ADMIN, UserRole.DOCTOR),
  validate(updateMedicalRecordSchema),
  medicalRecordController.update
);

export default medicalRecordRouter;
