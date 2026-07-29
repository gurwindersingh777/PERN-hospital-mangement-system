import { InvoiceWithRelations } from "./invoice.types.js";

export const toInvoiceResponse = (invoice: InvoiceWithRelations) => ({
  id: invoice.id,
  amount: invoice.amount,
  status: invoice.status,
  paymentMethod: invoice.paymentMethod,
  paidAt: invoice.paidAt,

  appointment: {
    id: invoice.appointment.id,
    slotStart: invoice.appointment.slotStart,
    status: invoice.appointment.status,
  },

  doctor: {
    user: {
      name: invoice.appointment.doctor.user.name,
    },
  },

  patient: {
    user: {
      name: invoice.appointment.patient.user.name,
    },
  },
});
