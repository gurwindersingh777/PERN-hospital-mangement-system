import { CREATED, OK } from "../../constants/statusCode.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { AsyncHandler } from "../../utils/AsyncHandler.js";
import { GetPatientsInput } from "./patient.schema.js";
import { patientService } from "./patient.service.js";

export const patientController = {
  create: AsyncHandler(async (req, res) => {
    const patient = await patientService.create(req.body);

    return res
      .status(CREATED)
      .json(
        new ApiResponse(CREATED, patient, "Patient profile created successfully")
      );
  }),

  findAll: AsyncHandler(async (req, res) => {
    const result = await patientService.findAll(
      req.query as unknown as GetPatientsInput
    );
    return res
      .status(OK)
      .json(
        new ApiResponse(OK, result, "Patients profile fetched successfully")
      );
  }),

  findById: AsyncHandler(async (req, res) => {
    const patient = await patientService.findById(req.params.id as string);
    return res
      .status(OK)
      .json(new ApiResponse(OK, patient, "Patient profile fetched successfully"));
  }),

  update: AsyncHandler(async (req, res) => {
    const patient = await patientService.update(
      req.params.id as string,
      req.body
    );
    return res
      .status(OK)
      .json(new ApiResponse(OK, patient, "Patient profile updated successfully"));
  }),
};
