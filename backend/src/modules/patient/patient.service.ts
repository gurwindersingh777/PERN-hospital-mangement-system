import { UserRole } from "@prisma/client";
import { BAD_REQUEST, CONFLICT, NOT_FOUND } from "../../constants/statusCode.js";
import { ApiError } from "../../utils/ApiError.js";
import { patientRepository } from "./patient.repository.js";
import { GetPatientsInput, PatientInput, UpdatePatientInput } from "./patient.schema.js";
import { toPatientResponse } from "./patient.response.js";

export const patientService = {
  async create(data: PatientInput) {
    const user = await patientRepository.findUserById(data.userId);

    if (!user) {
      throw new ApiError(NOT_FOUND, "User not found");
    }

    if (user.role !== UserRole.PATIENT) {
      throw new ApiError(
        BAD_REQUEST,
        "User must have Patient role to create a patient profile"
      );
    }

    const existingPatient = await patientRepository.findByUserId(data.userId);

    if (existingPatient) {
      throw new ApiError(
        CONFLICT,
        "Patient profile already exists for this user"
      );
    }

    const patient = await patientRepository.create(data);

    return toPatientResponse(patient);
  },

  async findById(id: string) {
    const patient = await patientRepository.findById(id);

    if (!patient) {
      throw new ApiError(NOT_FOUND, "patient not found");
    }

    return toPatientResponse(patient);
  },

  async findAll(query: GetPatientsInput) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const skip = (page - 1) * limit;

    const [patient, total] = await Promise.all([
      patientRepository.findAll(skip, limit),
      patientRepository.count(),
    ]);

    return {
      data: patient.map(toPatientResponse),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async update(id: string, data: UpdatePatientInput) {
    const existingPatient = await patientRepository.findById(id);

    if (!existingPatient) {
      throw new ApiError(NOT_FOUND, "Patient not found");
    }

    if (data.userId) {
      const user = await patientRepository.findUserById(data.userId);

      if (!user) {
        throw new ApiError(NOT_FOUND, "User not found");
      }

      if (user.role !== UserRole.PATIENT) {
        throw new ApiError(BAD_REQUEST, "User must have PATIENT role");
      }

      const patientWithSameUser = await patientRepository.findByUserId(
        data.userId
      );

      if (patientWithSameUser && patientWithSameUser.id !== id) {
        throw new ApiError(
          CONFLICT,
          "Patient profile already exists for this user"
        );
      }
    }

    const updatedPatient = await patientRepository.update(id, data);

    return toPatientResponse(updatedPatient);
  },
};
