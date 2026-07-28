import { PrescriptionWithRelations } from "./prescription.types.js";

export const toPrescriptionResponse = (
  prescription: PrescriptionWithRelations
) => ({
  id: prescription.id,
  medicineName: prescription.medicineName,
  dosage: prescription.dosage,
  duration: prescription.duration,
  instructions: prescription.instructions,

  medicalRecord: {
    id: prescription.medicalRecord.id,
    diagnosis: prescription.medicalRecord.diagnosis,
  },
});
