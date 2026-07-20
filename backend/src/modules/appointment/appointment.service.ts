import { AppointmentStatus } from "@prisma/client";
import { BAD_REQUEST, CONFLICT, NOT_FOUND } from "../../constants/statusCode.js";
import { ApiError } from "../../utils/ApiError.js";
import { appointmentRepository } from "./appointment.repository.js";
import { toAppointmentResponse } from "./appointment.response.js";
import { AppointmentInput, GetAppointmentsInput, UpdateAppointmentInput } from "./appointment.schema.js";

const allowedTransitions: Record<AppointmentStatus, AppointmentStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};

function isValidStatusTransition(current: AppointmentStatus, next: AppointmentStatus): boolean {
  return allowedTransitions[current].includes(next);
}

export const appointmentService = {

  async create(data: AppointmentInput) {
    const doctor = await appointmentRepository.findDoctorById(data.doctorId);

    if (!doctor) {
      throw new ApiError(NOT_FOUND, "Doctor does not exist")
    }

    const patient = await appointmentRepository.findPatientById(data.patientId);

    if (!patient) {
      throw new ApiError(NOT_FOUND, "Patient does not exist")
    }

    if (data.slotStart.getTime() <= Date.now()) {
      throw new ApiError(BAD_REQUEST, "Invalid Slot timing")
    }

    const alreadyBooked = await appointmentRepository.findByDoctorAndSlot(data.doctorId, data.slotStart);

    if (alreadyBooked) {
      throw new ApiError(CONFLICT, "There is an already existing appointment in this time slot. Please choose another time slot.")
    }

    const appointment = await appointmentRepository.create(data);

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
      appointmentRepository.count()
    ])

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

    if (data.slotStart) {
      if (data.slotStart.getTime() <= Date.now()) {
        throw new ApiError(BAD_REQUEST, "Invalid Slot timing")
      }

      const alreadyBooked = await appointmentRepository.findByDoctorAndSlot(existing.doctorId, data.slotStart);

      if (alreadyBooked && alreadyBooked.id !== existing.id) {
        throw new ApiError(CONFLICT, "Doctor already has an appointment at this time")
      }
    }


    if (data.status && !isValidStatusTransition(existing.status, data.status)) {
      throw new ApiError(BAD_REQUEST, "Invalid appointment status transition");
    }

    const appointment = await appointmentRepository.update(id, data);

    return toAppointmentResponse(appointment);
  },
}