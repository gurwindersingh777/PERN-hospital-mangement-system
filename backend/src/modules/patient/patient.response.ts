import { PatientWithRelations } from "./patient.types.js";

export const toPatientResponse = (patient: PatientWithRelations) => ({
  id: patient.id,
  dateOfBirth: patient.dateOfBirth,
  address: patient.address,
  bloodGroup: patient.bloodGroup,
  contactNumber: patient.contactNumber,
  emergencyContact: patient.emergencyContact,
  gender: patient.gender,

  user: {
    id: patient.user.id,
    name: patient.user.name,
    email: patient.user.email,
    role : patient.user.role
  },
})


