import {
  AppointmentStatus,
  InvoiceStatus,
  Prisma,
  UserRole,
} from "@prisma/client";
import { invoiceRepository } from "./invoice.repository.js";
import {
  GetInvoiceInput,
  InvoiceInput,
  UpdateInvoiceInput,
} from "./invoice.schema.js";
import { ApiError } from "../../utils/ApiError.js";
import {
  BAD_REQUEST,
  CONFLICT,
  NOT_FOUND,
} from "../../constants/statusCode.js";
import { toInvoiceResponse } from "./invoice.response.js";
import { AuthUser } from "../../types/auth.js";

const allowedTransitions: Record<InvoiceStatus, InvoiceStatus[]> = {
  UNPAID: ["PAID", "VOID"],
  PAID: [],
  VOID: [],
};

function isValidStatusTransition(
  current: InvoiceStatus,
  next: InvoiceStatus
): boolean {
  return allowedTransitions[current].includes(next);
}

export const invoiceService = {
  async create(data: InvoiceInput) {
    const appointment = await invoiceRepository.findAppointmentById(
      data.appointmentId
    );

    if (!appointment) {
      throw new ApiError(NOT_FOUND, "Appointment not found");
    }

    const existingInvoice = await invoiceRepository.findByAppointmentId(
      appointment.id
    );

    if (existingInvoice) {
      throw new ApiError(
        CONFLICT,
        "Invoice already exist for this appointment"
      );
    }

    if (appointment.status !== AppointmentStatus.COMPLETED) {
      throw new ApiError(
        BAD_REQUEST,
        "Invoice can only be created for completed appointments"
      );
    }

    const invoice = await invoiceRepository.create(data);

    return toInvoiceResponse(invoice);
  },

  async findById(id: string) {
    const invoice = await invoiceRepository.findById(id);

    if (!invoice) {
      throw new ApiError(NOT_FOUND, "Invoice not found");
    }

    return toInvoiceResponse(invoice);
  },

  async findAll(query: GetInvoiceInput, user: AuthUser) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const skip = (page - 1) * limit;

    let where: Prisma.InvoiceWhereInput = {};

    switch (user.role) {
      case UserRole.ADMIN:
      case UserRole.RECEPTIONIST:
        break;

      case UserRole.PATIENT:
        where = {
          appointment: {
            patient: {
              userId: user.userId,
            },
          },
        };
        break;
    }

    const [invoices, total] = await Promise.all([
      invoiceRepository.findAll(skip, limit, where),
      invoiceRepository.count(where),
    ]);

    return {
      data: invoices.map(toInvoiceResponse),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async update(id: string, data: UpdateInvoiceInput) {
    const existingInvoice = await invoiceRepository.findById(id);

    if (!existingInvoice) {
      throw new ApiError(NOT_FOUND, "Invoice not found");
    }

    if (
      data.status &&
      !isValidStatusTransition(existingInvoice.status, data.status)
    ) {
      throw new ApiError(BAD_REQUEST, "Invalid invoice status transition");
    }

    if (data.paidAt && data.status !== InvoiceStatus.PAID) {
      throw new ApiError(
        BAD_REQUEST,
        "paidAt can only be set when invoice is PAID"
      );
    }

    if (data.status === InvoiceStatus.PAID && !data.paidAt) {
      data.paidAt = new Date();
    }

    const updatedInvoice = await invoiceRepository.update(id, data);

    return toInvoiceResponse(updatedInvoice);
  },
};
