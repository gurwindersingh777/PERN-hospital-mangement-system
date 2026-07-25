import { DoctorWithRelations } from "./doctor.types.js";

export const toDoctorResponse = (doctor: DoctorWithRelations) => ({
  id: doctor.id,
  specialty: doctor.specialty,
  qualification: doctor.qualification,
  experienceYears: doctor.experienceYears,
  workStartTime: doctor.workStartTime,
  workEndTime: doctor.workEndTime,
  phoneNumber: doctor.phoneNumber,

  user: {
    id: doctor.user.id,
    name: doctor.user.name,
    email: doctor.user.email,
    role: doctor.user.role
  },

  department: {
    id: doctor.department.id,
    name: doctor.department.name,
  },
});
