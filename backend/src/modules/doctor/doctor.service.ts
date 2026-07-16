import { UserRole } from "@prisma/client";
import {
  BAD_REQUEST,
  CONFLICT,
  NOT_FOUND,
} from "../../constants/statusCode.js";
import { ApiError } from "../../utils/ApiError.js";
import { doctorRepository } from "./doctor.repository.js";
import { toDoctorResponse } from "./doctor.response.js";
import {
  DoctorInput,
  GetDoctorInput,
  UpdateDoctorInput,
} from "./doctor.schema.js";

export const doctorService = {
  async createDoctor(data: DoctorInput) {
    const user = await doctorRepository.findUserById(data.userId);

    if (!user) {
      throw new ApiError(NOT_FOUND, "User not found");
    }

    if (user.role !== UserRole.DOCTOR) {
      throw new ApiError(
        BAD_REQUEST,
        "User must have DOCTOR role to create a doctor profile"
      );
    }

    const department = await doctorRepository.findDepartmentById(
      data.departmentId
    );

    if (!department) {
      throw new ApiError(NOT_FOUND, "Department not found");
    }

    const existingDoctor = await doctorRepository.findByUserId(data.userId);

    if (existingDoctor) {
      throw new ApiError(
        CONFLICT,
        "Doctor profile already exists for this user"
      );
    }

    const doctor = await doctorRepository.create(data);

    return toDoctorResponse(doctor);
  },

  async findById(id: string) {
    const doctor = await doctorRepository.findById(id);

    if (!doctor) {
      throw new ApiError(NOT_FOUND, "Doctor not found");
    }

    return toDoctorResponse(doctor);
  },

  async findAll(query: GetDoctorInput) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const skip = (page - 1) * limit;

    const [doctors, total] = await Promise.all([
      doctorRepository.findAll(skip, limit),
      doctorRepository.count(),
    ]);

    return {
      data: doctors.map(toDoctorResponse),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async updateDoctor(id: string, data: UpdateDoctorInput) {
    const existingDoctor = await doctorRepository.findById(id);

    if (!existingDoctor) {
      throw new ApiError(NOT_FOUND, "Doctor not found");
    }

    if (data.departmentId) {
      const department = await doctorRepository.findDepartmentById(
        data.departmentId
      );

      if (!department) {
        throw new ApiError(NOT_FOUND, "Department not found");
      }
    }

    if (data.userId) {
      const user = await doctorRepository.findUserById(data.userId);

      if (!user) {
        throw new ApiError(NOT_FOUND, "User not found");
      }

      if (user.role !== UserRole.DOCTOR) {
        throw new ApiError(BAD_REQUEST, "User must have DOCTOR role");
      }

      const doctorWithSameUser = await doctorRepository.findByUserId(
        data.userId
      );

      if (doctorWithSameUser && doctorWithSameUser.id !== id) {
        throw new ApiError(
          CONFLICT,
          "Doctor profile already exists for this user"
        );
      }
    }

    const updatedDoctor = await doctorRepository.update(id, data);

    return toDoctorResponse(updatedDoctor);
  },
};
