import { Prisma } from "@prisma/client";
import { CONFLICT, NOT_FOUND } from "../../constants/statusCode.js";
import { ApiError } from "../../utils/ApiError.js";
import { hashPassword } from "../auth/auth.helper.js";
import { userRepository } from "./user.repository.js";
import { toUserResponse } from "./user.response.js";
import {
  CreateUserInput,
  GetUsersQuery,
  UpdateUserInput,
} from "./user.schema.js";

export const userService = {
  async createUser(data: CreateUserInput) {
    const existingUser = await userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new ApiError(CONFLICT, "Email already exists");
    }

    const hashedPassword = await hashPassword(data.password);
    const user = await userRepository.create({
      ...data,
      password: hashedPassword,
    });

    return toUserResponse(user);
  },

  async findAll(query: GetUsersQuery) {
    const page = query.page;
    const limit = query.limit;
    const skip = (page - 1) * limit;
    const where: Prisma.UserWhereInput = {};
    if (query.role) {
      where.isActive = query.isActive;
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: "insensitive" } },
        { email: { contains: query.search, mode: "insensitive" } },
      ];
    }

    const [users, total] = await Promise.all([
      userRepository.findMany(where, skip, limit),
      userRepository.count(where),
    ]);

    return {
      users: users.map(toUserResponse),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async findById(id: string) {
    const user = await userRepository.findById(id);

    if (!user) {
      throw new ApiError(NOT_FOUND, "User not found");
    }

    return toUserResponse(user);
  },

  async update(id: string, data: UpdateUserInput) {
    const existing = await userRepository.findById(id);

    if (!existing) {
      throw new ApiError(NOT_FOUND, "User not found");
    }

    const updated = await userRepository.update(id, data);

    return toUserResponse(updated);
  },
};
