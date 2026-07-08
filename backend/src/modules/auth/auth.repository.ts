import { Prisma, User } from "@prisma/client";
import prisma from "../../lib/prisma.js";

export const authRepository = {

  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email }
    })
  },

  async findUserById(id: string) {
    return prisma.user.findUnique({
      where: { id }
    })
  },

  async createUser(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data })
  }

}