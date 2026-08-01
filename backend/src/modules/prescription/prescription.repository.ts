import { Prisma } from "@prisma/client";
import prisma from "../../lib/prisma.js";

export const prescriptionsRepository = {
  create(data: Prisma.PrescriptionUncheckedCreateInput) {
    return prisma.prescription.create({
      data,
      include: {
        medicalRecord: true,
      },
    });
  },

  findById(id: string) {
    return prisma.prescription.findUnique({
      where: { id },
      include: {
        medicalRecord: true,
      },
    });
  },

  findAll(skip: number, take: number, where?: Prisma.PrescriptionWhereInput) {
    return prisma.prescription.findMany({
      skip,
      take,
      where,
      orderBy: { createdAt: "desc" },
      include: {
        medicalRecord: true,
      },
    });
  },

  update(id: string, data: Prisma.PrescriptionUpdateInput) {
    return prisma.prescription.update({
      where: { id },
      data,
      include: {
        medicalRecord: true,
      },
    });
  },

  count(where?: Prisma.PrescriptionWhereInput) {
    return prisma.prescription.count({ where });
  },

  findMedicalRecordById(id: string) {
    return prisma.medicalRecord.findUnique({ where: { id } });
  },
};
