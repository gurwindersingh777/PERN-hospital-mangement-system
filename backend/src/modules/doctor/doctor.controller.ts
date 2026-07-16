import { CREATED, OK } from "../../constants/statusCode.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { AsyncHandler } from "../../utils/AsyncHandler.js";
import { GetDoctorInput } from "./doctor.schema.js";
import { doctorService } from "./doctor.service.js";

export const doctorController = {
  create: AsyncHandler(async (req, res) => {
    const doctor = await doctorService.createDoctor(req.body);

    return res
      .status(CREATED)
      .json(
        new ApiResponse(CREATED, doctor, "Doctor profile created successfully")
      );
  }),

  findAll: AsyncHandler(async (req, res) => {
    const result = await doctorService.findAll(
      req.query as unknown as GetDoctorInput
    );
    return res
      .status(OK)
      .json(
        new ApiResponse(OK, result, "Doctors profile fetched successfully")
      );
  }),

  findById: AsyncHandler(async (req, res) => {
    const doctor = await doctorService.findById(req.params.id as string);
    return res
      .status(OK)
      .json(new ApiResponse(OK, doctor, "Doctor profile fetched successfully"));
  }),

  update: AsyncHandler(async (req, res) => {
    const doctor = await doctorService.updateDoctor(
      req.params.id as string,
      req.body
    );
    return res
      .status(OK)
      .json(new ApiResponse(OK, doctor, "Doctor profile updated successfully"));
  }),
};
