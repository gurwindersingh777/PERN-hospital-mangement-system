import { AppointmentStatus, Prisma } from "@prisma/client";
import {
  BAD_REQUEST,
  CONFLICT,
  NOT_FOUND,
} from "../../constants/statusCode.js";
import { ApiError } from "../../utils/ApiError.js";
import { appointmentRepository } from "./appointment.repository.js";
import { toAppointmentResponse } from "./appointment.response.js";
import {
  AppointmentInput,
  GetAppointmentsInput,
  UpdateAppointmentInput,
} from "./appointment.schema.js";
import {
  getSlotEnd,
  isValidSlotTime,
  isWithinWorkingHours,
} from "./appointment.utils.js";

const allowedTransitions: Record<AppointmentStatus, AppointmentStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};

function isValidStatusTransition(
  current: AppointmentStatus,
  next: AppointmentStatus
): boolean {
  return allowedTransitions[current].includes(next);
}

export const appointmentService = {
  async create(data: AppointmentInput) {
    console.log({
      iso: data.slotStart.toISOString(),
      hours: data.slotStart.getHours(),
      minutes: data.slotStart.getMinutes(),
      utcHours: data.slotStart.getUTCHours(),
      utcMinutes: data.slotStart.getUTCMinutes(),
    });
    const doctor = await appointmentRepository.findDoctorById(data.doctorId);

    if (!doctor) {
      throw new ApiError(NOT_FOUND, "Doctor does not exist");
    }

    const patient = await appointmentRepository.findPatientById(data.patientId);

    if (!patient) {
      throw new ApiError(NOT_FOUND, "Patient does not exist");
    }

    if (data.slotStart.getTime() <= Date.now()) {
      throw new ApiError(BAD_REQUEST, "Invalid Slot timing");
    }

    if (!isValidSlotTime(data.slotStart)) {
      throw new ApiError(
        BAD_REQUEST,
        "Appointments can only start at :00 or :30."
      );
    }

    const slotEnd = getSlotEnd(data.slotStart);

    if (
      !isWithinWorkingHours(
        data.slotStart,
        slotEnd,
        doctor.workStartTime,
        doctor.workEndTime
      )
    ) {
      throw new ApiError(
        BAD_REQUEST,
        `Doctor is available only between ${doctor.workStartTime} and ${doctor.workEndTime}.`
      );
    }

    const conflict =
      await appointmentRepository.findDoctorConflictingAppointment(
        data.doctorId,
        data.slotStart,
        slotEnd
      );

    if (conflict) {
      throw new ApiError(
        CONFLICT,
        "Doctor already has an appointment during this time."
      );
    }

    const appointment = await appointmentRepository.create({
      ...data,
      slotEnd,
    });

    return toAppointmentResponse(appointment);
  },

  async findById(id: string) {
    const appointment = await appointmentRepository.findById(id);

    if (!appointment) {
      throw new ApiError(NOT_FOUND, "Appointment not found");
    }

    return toAppointmentResponse(appointment);
  },

  async findAll(query: GetAppointmentsInput) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const [appointments, total] = await Promise.all([
      appointmentRepository.findAll(skip, limit),
      appointmentRepository.count(),
    ]);

    return {
      data: appointments.map(toAppointmentResponse),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async update(id: string, data: UpdateAppointmentInput) {
    const existing = await appointmentRepository.findById(id);

    if (!existing) {
      throw new ApiError(NOT_FOUND, "Appointment not found");
    }

    if (data.status && !isValidStatusTransition(existing.status, data.status)) {
      throw new ApiError(BAD_REQUEST, "Invalid appointment status transition");
    }

    const updateData: Prisma.AppointmentUpdateInput = { ...data };

    if (data.slotStart) {
      if (data.slotStart.getTime() <= Date.now()) {
        throw new ApiError(
          BAD_REQUEST,
          "Appointment must be scheduled in the future."
        );
      }

      if (!isValidSlotTime(data.slotStart)) {
        throw new ApiError(
          BAD_REQUEST,
          "Appointments can only start at :00 or :30."
        );
      }

      const slotEnd = getSlotEnd(data.slotStart);

      const doctor = await appointmentRepository.findDoctorById(
        existing.doctorId
      );

      if (!doctor) {
        throw new ApiError(NOT_FOUND, "Doctor does not exist");
      }

      if (
        !isWithinWorkingHours(
          data.slotStart,
          slotEnd,
          doctor.workStartTime,
          doctor.workEndTime
        )
      ) {
        throw new ApiError(
          BAD_REQUEST,
          `Doctor is available only between ${doctor.workStartTime} and ${doctor.workEndTime}.`
        );
      }

      const conflict =
        await appointmentRepository.findDoctorConflictingAppointment(
          existing.doctorId,
          data.slotStart,
          slotEnd,
          existing.id
        );

      if (conflict) {
        throw new ApiError(
          CONFLICT,
          "Doctor already has another appointment during this time."
        );
      }

      updateData.slotStart = data.slotStart;
      updateData.slotEnd = slotEnd;
    }

    const appointment = await appointmentRepository.update(id, updateData);

    return toAppointmentResponse(appointment);
  },
};
