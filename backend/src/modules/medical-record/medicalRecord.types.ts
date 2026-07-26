import { Prisma } from "@prisma/client";

export type MedicalRecordWithRelations = Prisma.MedicalRecordGetPayload<{
  include: {
    appointment: {
      include: {
        doctor: {
          include: {
            user: true;
            department: true;
          };
        };
        patient: {
          include: {
            user: true;
          };
        };
      };
    };
  };
}>;
