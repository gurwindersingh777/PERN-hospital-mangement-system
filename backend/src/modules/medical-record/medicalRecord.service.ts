import { AppointmentStatus, Prisma, UserRole } from "@prisma/client";
import {
  BAD_REQUEST,
  CONFLICT,
  NOT_FOUND,
} from "../../constants/statusCode.js";
import { ApiError } from "../../utils/ApiError.js";
import { medicalRecordRepository } from "./medicalRecord.repository.js";
import { toMedicalRecordResponse } from "./medicalRecord.response.js";
import {
  GetMedicalRecordInput,
  MedicalRecordInput,
  UpdateMedicalRecordInput,
} from "./medicalRecord.schema.js";
import { AuthUser } from "../../types/auth.js";

export const medicalRecordService = {
  async create(data: MedicalRecordInput) {
    const appointment = await medicalRecordRepository.findAppointmentById(
      data.appointmentId
    );

    if (!appointment) {
      throw new ApiError(NOT_FOUND, "Appointment not found");
    }

    const existingRecord = await medicalRecordRepository.findByAppointmentId(
      appointment.id
    );

    if (existingRecord) {
      throw new ApiError(
        CONFLICT,
        "Medical Record already exist for this appointment"
      );
    }

    if (appointment.status !== AppointmentStatus.COMPLETED) {
      throw new ApiError(
        BAD_REQUEST,
        "Medical records can only be created for completed appointments"
      );
    }

    const record = await medicalRecordRepository.create(data);

    return toMedicalRecordResponse(record);
  },

  async findById(id: string) {
    const record = await medicalRecordRepository.findById(id);

    if (!record) {
      throw new ApiError(NOT_FOUND, "Medical Record not found");
    }

    return toMedicalRecordResponse(record);
  },

  async findAll(query: GetMedicalRecordInput, user: AuthUser) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const skip = (page - 1) * limit;

    let where: Prisma.MedicalRecordWhereInput = {};

    switch (user.role) {
      case UserRole.ADMIN:
        break;

      case UserRole.DOCTOR:
        where = {
          appointment: {
            doctor: {
              userId: user.userId,
            },
          },
        };
        break;

      case UserRole.PATIENT:
        where = {
          appointment: {
            patient: {
              userId: user.userId,
            },
          },
        };
        break;
    }

    const [records, total] = await Promise.all([
      medicalRecordRepository.findAll(skip, limit, where),
      medicalRecordRepository.count(where),
    ]);

    return {
      data: records.map(toMedicalRecordResponse),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async update(id: string, data: UpdateMedicalRecordInput) {
    const existingRecord = await medicalRecordRepository.findById(id);

    if (!existingRecord) {
      throw new ApiError(NOT_FOUND, "Record not found");
    }

    const updatedRecord = await medicalRecordRepository.update(id, data);

    return toMedicalRecordResponse(updatedRecord);
  },
};
