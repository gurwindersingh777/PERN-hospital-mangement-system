import {
  ALLOWED_SLOT_MINUTES,
  APPOINTMENT_DURATION_MINUTES,
} from "./appointment.constants.js";

export function getSlotEnd(slotStart: Date): Date {
  return new Date(
    slotStart.getTime() + APPOINTMENT_DURATION_MINUTES * 60 * 1000
  );
}

export function isValidSlotTime(slotStart: Date): boolean {
  return (
    ALLOWED_SLOT_MINUTES.includes(slotStart.getMinutes()) &&
    slotStart.getSeconds() === 0 &&
    slotStart.getMilliseconds() === 0
  );
}

function getMinutes(time: string): number {
  const [hour, minute] = time.split(":").map(Number);

  return hour * 60 + minute;
}

export function isWithinWorkingHours(
  slotStart: Date,
  slotEnd: Date,
  workStartTime: string,
  workEndTime: string
): boolean {
  const appointmentStart = slotStart.getHours() * 60 + slotStart.getMinutes();

  const appointmentEnd = slotEnd.getHours() * 60 + slotEnd.getMinutes();

  const doctorStart = getMinutes(workStartTime);
  const doctorEnd = getMinutes(workEndTime);

  return appointmentStart >= doctorStart && appointmentEnd <= doctorEnd;
}
