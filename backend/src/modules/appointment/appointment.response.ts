import { AppointmentWithRelations } from "./appointment.types.js";

export const toAppointmentResponse = (appointment: AppointmentWithRelations) => ({
  id: appointment.id,
  slotStart: appointment.slotStart,
  reason: appointment.reason,
  status: appointment.status,

  doctor: {
    id: appointment.doctor.id,
    specialty: appointment.doctor.specialty,
    qualification: appointment.doctor.qualification,
    experienceYears: appointment.doctor.experienceYears,
    workingHours: appointment.doctor.workingHours,

    department: {
      id: appointment.doctor.department.id,
      name: appointment.doctor.department.name,
    },

    user: {
      id: appointment.doctor.user.id,
      name: appointment.doctor.user.name,
      email: appointment.doctor.user.email,
    },
  },

  patient: {
    id: appointment.patient.id,
    bloodGroup: appointment.patient.bloodGroup,
    gender: appointment.patient.gender,

    user: {
      id: appointment.patient.user.id,
      name: appointment.patient.user.name,
      email: appointment.patient.user.email,
    },
  },
});