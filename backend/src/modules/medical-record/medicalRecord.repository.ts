import { Prisma } from "@prisma/client";
import prisma from "../../lib/prisma.js";

const medicalRecordInclude = {
  appointment: {
    include: {
      doctor: {
        include: {
          user: true,
          department: true,
        },
      },
      patient: {
        include: {
          user: true,
        },
      },
    },
  },
} satisfies Prisma.MedicalRecordInclude;

export const medicalRecordRepository = {
  create(data: Prisma.MedicalRecordUncheckedCreateInput) {
    return prisma.medicalRecord.create({
      data,
      include: medicalRecordInclude,
    });
  },

  findById(id: string) {
    return prisma.medicalRecord.findUnique({
      where: { id },
      include: medicalRecordInclude,
    });
  },

  findAll(skip: number, take: number, where?: Prisma.MedicalRecordWhereInput) {
    return prisma.medicalRecord.findMany({
      skip,
      take,
      where,
      orderBy: { createdAt: "desc" },
      include: medicalRecordInclude,
    });
  },

  update(id: string, data: Prisma.MedicalRecordUpdateInput) {
    return prisma.medicalRecord.update({
      where: { id },
      data,
      include: medicalRecordInclude,
    });
  },

  count(where?: Prisma.MedicalRecordWhereInput) {
    return prisma.medicalRecord.count({ where });
  },

  findAppointmentById(id: string) {
    return prisma.appointment.findUnique({ where: { id } });
  },

  findByAppointmentId(id: string) {
    return prisma.medicalRecord.findUnique({ where: { appointmentId: id } });
  },
};
