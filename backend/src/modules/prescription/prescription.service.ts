import { Prisma, UserRole } from "@prisma/client";
import { NOT_FOUND } from "../../constants/statusCode.js";
import { AuthUser } from "../../types/auth.js";
import { ApiError } from "../../utils/ApiError.js";
import { prescriptionsRepository } from "./prescription.repository.js";
import { toPrescriptionResponse } from "./prescription.response.js";
import {
  GetPrescriptionInput,
  PrescriptionInput,
  UpdatePrescriptionInput,
} from "./prescription.schema.js";

export const prescriptionService = {
  async create(data: PrescriptionInput) {
    const medicalRecord = await prescriptionsRepository.findMedicalRecordById(
      data.medicalRecordId
    );

    if (!medicalRecord) {
      throw new ApiError(NOT_FOUND, "Medical Record not found");
    }

    const prescription = await prescriptionsRepository.create(data);

    return toPrescriptionResponse(prescription);
  },

  async findById(id: string) {
    const prescription = await prescriptionsRepository.findById(id);

    if (!prescription) {
      throw new ApiError(NOT_FOUND, "Prescription not found");
    }

    return toPrescriptionResponse(prescription);
  },

  async findAll(query: GetPrescriptionInput, user: AuthUser) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const skip = (page - 1) * limit;

    let where: Prisma.PrescriptionWhereInput = {};

    switch (user.role) {
      case UserRole.ADMIN:
        break;

      case UserRole.DOCTOR:
        where = {
          medicalRecord: {
            appointment: {
              doctor: {
                userId: user.userId,
              },
            },
          },
        };
        break;

      case UserRole.PATIENT:
        where = {
          medicalRecord: {
            appointment: {
              patient: {
                userId: user.userId,
              },
            },
          },
        };
        break;
    }

    const [prescriptions, total] = await Promise.all([
      prescriptionsRepository.findAll(skip, limit, where),
      prescriptionsRepository.count(where),
    ]);

    return {
      data: prescriptions.map(toPrescriptionResponse),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async update(id: string, data: UpdatePrescriptionInput) {
    const existingPrescription = await prescriptionsRepository.findById(id);

    if (!existingPrescription) {
      throw new ApiError(NOT_FOUND, "Prescription not found");
    }

    const updatedRecord = await prescriptionsRepository.update(id, data);

    return toPrescriptionResponse(updatedRecord);
  },
};
