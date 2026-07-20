import { Prisma } from "@prisma/client";

export type AppointmentWithRelations = Prisma.AppointmentGetPayload<{
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
}>;