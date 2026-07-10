import { Prisma } from "@prisma/client";
import prisma from "../../lib/prisma.js";

export const userRepository = {
  create(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data });
  },

  findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  findMany(where: Prisma.UserWhereInput, skip: number, take: number) {
    return prisma.user.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
    });
  },

  update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({ where: { id }, data });
  },

  count(where: Prisma.UserWhereInput) {
    return prisma.user.count({ where });
  },
};
