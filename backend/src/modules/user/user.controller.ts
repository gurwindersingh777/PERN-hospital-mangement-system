import { CREATED, OK } from "../../constants/statusCode.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { AsyncHandler } from "../../utils/AsyncHandler.js";
import { GetUsersQuery, UpdateUserInput } from "./user.schema.js";
import { userService } from "./user.service.js";

export const userController = {
  create: AsyncHandler(async (req, res) => {
    const user = await userService.createUser(req.body);

    return res
      .status(CREATED)
      .json(new ApiResponse(CREATED, user, "User created successfully"));
  }),

  findAll: AsyncHandler(async (req, res) => {
    const result = await userService.findAll(
      req.query as unknown as GetUsersQuery
    );
    return res
      .status(OK)
      .json(new ApiResponse(OK, result, "Users fetched successfully"));
  }),

  findById: AsyncHandler(async (req, res) => {
    const user = await userService.findById(req.params.id as string);
    return res
      .status(OK)
      .json(new ApiResponse(OK, user, "User fetched successfully"));
  }),

  update: AsyncHandler(async (req, res) => {
    const user = await userService.update(
      req.params.id as string,
      req.body as UpdateUserInput
    );
    return res
      .status(OK)
      .json(new ApiResponse(OK, user, "User updated successfully"));
  }),
};
