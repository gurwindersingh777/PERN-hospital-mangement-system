import { Prisma } from "@prisma/client";
import prisma from "../../lib/prisma.js";

const appointmentInclude = {
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
} satisfies Prisma.AppointmentInclude;

export const appointmentRepository = {
  create(data: Prisma.AppointmentUncheckedCreateInput) {
    return prisma.appointment.create({
      data,
      include: appointmentInclude,
    });
  },

  findById(id: string) {
    return prisma.appointment.findUnique({
      where: { id },
      include: appointmentInclude,
    });
  },

  findAll(skip: number, take: number) {
    return prisma.appointment.findMany({
      skip,
      take,
      orderBy: {
        slotStart: "desc",
      },
      include: appointmentInclude,
    });
  },

  update(id: string, data: Prisma.AppointmentUpdateInput) {
    return prisma.appointment.update({
      where: { id },
      data,
      include: appointmentInclude,
    });
  },

  findDoctorById(id: string) {
    return prisma.doctor.findUnique({
      where: { id },
    });
  },

  findPatientById(id: string) {
    return prisma.patient.findUnique({
      where: { id },
    });
  },

  findByDoctorAndSlot(doctorId: string, slotStart: Date) {
    return prisma.appointment.findUnique({
      where: {
        doctorId_slotStart: {
          doctorId,
          slotStart,
        },
      },
    });
  },

  count() {
    return prisma.appointment.count();
  },
};