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
  authorizeRole(UserRole.ADMIN),
  validate(getMedicalRecordSchema),
  medicalRecordController.findAll
);
medicalRecordRouter.get(
  "/:id",
  authorizeRole(UserRole.ADMIN),
  medicalRecordController.findById
);
medicalRecordRouter.post(
  "/",
  authorizeRole(UserRole.ADMIN),
  validate(medicalRecordSchema),
  medicalRecordController.create
);
medicalRecordRouter.patch(
  "/:id",
  authorizeRole(UserRole.ADMIN),
  validate(updateMedicalRecordSchema),
  medicalRecordController.update
);

export default medicalRecordRouter;
