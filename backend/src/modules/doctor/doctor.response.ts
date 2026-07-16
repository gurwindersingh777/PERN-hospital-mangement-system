import { DoctorWithRelations } from "./doctor.types.js";

export const toDoctorResponse = (doctor: DoctorWithRelations) => ({
  id: doctor.id,
  specialty: doctor.specialty,
  qualification: doctor.qualification,
  experienceYears: doctor.experienceYears,
  workingHours: doctor.workingHours,
  phoneNumber: doctor.phoneNumber,

  user: {
    id: doctor.user.id,
    name: doctor.user.name,
    email: doctor.user.email,
  },

  department: {
    id: doctor.department.id,
    name: doctor.department.name,
  },
});
