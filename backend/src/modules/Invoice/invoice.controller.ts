import { CREATED, OK } from "../../constants/statusCode.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { AsyncHandler } from "../../utils/AsyncHandler.js";
import { GetInvoiceInput } from "./invoice.schema.js";
import { invoiceService } from "./invoice.service.js";

export const invoiceController = {
  create: AsyncHandler(async (req, res) => {
    const invoice = await invoiceService.create(req.body);

    return res
      .status(CREATED)
      .json(new ApiResponse(CREATED, invoice, "Invoice created successfully"));
  }),

  findAll: AsyncHandler(async (req, res) => {
    const invoices = await invoiceService.findAll(
      req.query as unknown as GetInvoiceInput
    );
    return res
      .status(OK)
      .json(new ApiResponse(OK, invoices, "Invoice fetched successfully"));
  }),

  findById: AsyncHandler(async (req, res) => {
    const invoice = await invoiceService.findById(req.params.id as string);
    return res
      .status(OK)
      .json(new ApiResponse(OK, invoice, "Invoice fetched successfully"));
  }),

  update: AsyncHandler(async (req, res) => {
    const invoice = await invoiceService.update(
      req.params.id as string,
      req.body
    );
    return res
      .status(OK)
      .json(new ApiResponse(OK, invoice, "Invoice updated successfully"));
  }),
};
