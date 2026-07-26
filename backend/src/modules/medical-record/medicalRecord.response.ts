import { MedicalRecordWithRelations } from "./medicalRecord.types.js";

export const toMedicalRecordResponse = (
  medicalRecord: MedicalRecordWithRelations
) => ({
  id: medicalRecord.id,
  diagnosis: medicalRecord.diagnosis,
  notes: medicalRecord.notes,

  appointment: {
    id: medicalRecord.appointment.id,
    slotStart: medicalRecord.appointment.slotStart,
    status: medicalRecord.appointment.status,
  },

  doctor: {
    id: medicalRecord.appointment.doctor.id,
    specialty: medicalRecord.appointment.doctor.specialty,
    qualification: medicalRecord.appointment.doctor.qualification,
    experienceYears: medicalRecord.appointment.doctor.experienceYears,
    workStartTime: medicalRecord.appointment.doctor.workStartTime,
    workEndTime: medicalRecord.appointment.doctor.workEndTime,

    department: {
      id: medicalRecord.appointment.doctor.department.id,
      name: medicalRecord.appointment.doctor.department.name,
    },

    user: {
      id: medicalRecord.appointment.doctor.user.id,
      name: medicalRecord.appointment.doctor.user.name,
      email: medicalRecord.appointment.doctor.user.email,
    },
  },

  patient: {
    id: medicalRecord.appointment.patient.id,
    bloodGroup: medicalRecord.appointment.patient.bloodGroup,
    gender: medicalRecord.appointment.patient.gender,

    user: {
      id: medicalRecord.appointment.patient.user.id,
      name: medicalRecord.appointment.patient.user.name,
      email: medicalRecord.appointment.patient.user.email,
    },
  },
});
