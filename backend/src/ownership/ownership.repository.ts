import prisma from "../lib/prisma.js";
import { OwnershipInfo, OwnershipResource } from "./ownership.types.js";

export const ownershipRepository = {
  async findOwner(
    resource: OwnershipResource,
    id: string
  ): Promise<OwnershipInfo | null> {
    switch (resource) {
      case OwnershipResource.APPOINTMENT: {
        const appointment = await prisma.appointment.findUnique({
          where: { id },
          select: {
            doctor: {
              select: {
                userId: true,
              },
            },
            patient: {
              select: {
                userId: true,
              },
            },
          },
        });

        if (!appointment) {
          return null;
        }

        return {
          doctorUserId: appointment.doctor.userId,
          patientUserId: appointment.patient.userId,
        };
      }

      case OwnershipResource.MEDICAL_RECORD: {
        const medicalRecord = await prisma.medicalRecord.findUnique({
          where: { id },
          select: {
            appointment: {
              select: {
                doctor: {
                  select: {
                    userId: true,
                  },
                },
                patient: {
                  select: {
                    userId: true,
                  },
                },
              },
            },
          },
        });

        if (!medicalRecord) {
          return null;
        }

        return {
          doctorUserId: medicalRecord.appointment.doctor.userId,
          patientUserId: medicalRecord.appointment.patient.userId,
        };
      }

      case OwnershipResource.PRESCRIPTION: {
        const prescription = await prisma.prescription.findUnique({
          where: { id },
          select: {
            medicalRecord: {
              select: {
                appointment: {
                  select: {
                    doctor: {
                      select: {
                        userId: true,
                      },
                    },
                    patient: {
                      select: {
                        userId: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });

        if (!prescription) {
          return null;
        }

        return {
          doctorUserId: prescription.medicalRecord.appointment.doctor.userId,
          patientUserId: prescription.medicalRecord.appointment.patient.userId,
        };
      }

      case OwnershipResource.INVOICE: {
        const invoice = await prisma.invoice.findUnique({
          where: { id },
          select: {
            appointment: {
              select: {
                doctor: {
                  select: {
                    userId: true,
                  },
                },
                patient: {
                  select: {
                    userId: true,
                  },
                },
              },
            },
          },
        });

        if (!invoice) {
          return null;
        }

        return {
          doctorUserId: invoice.appointment.doctor.userId,
          patientUserId: invoice.appointment.patient.userId,
        };
      }

      default:
        throw new Error(`Unsupported ownership resource: ${resource}`);
    }
  },
};
