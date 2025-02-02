import { AppointmentModel } from "../../database/appointment/appointment.model.js";
import DoctorAvailability from "../../database/appointment/doctorAvailability.model.js";

export const bookNewAppointment = async (
  doctor,
  appointmentDate,
  oldTimeSlot,
  newTimeSlot,
  notes,
  patient,
) => {
  try {
    const availability = await DoctorAvailability.findOne({
      doctor,
      date: new Date(appointmentDate).toISOString().split("T")[0], // Check the specific date
      "availableSlots.time": newTimeSlot,
    });
    if (!availability) {
      return { code: 202, message: "No available slots at this time." };
    }

    const newSlot = availability.availableSlots.find(
      (slot) => slot.time === newTimeSlot && slot.isAvailable
    );
    if (!newSlot) {
      return {
        code: 202,
        message: "The selected time slot is no longer available.",
      };
    }

    const oldSlot = availability.availableSlots.find(
        (slot) => slot.time === oldTimeSlot && !slot.isAvailable
    );

    if(oldSlot) oldSlot.isAvailable = true;
    newSlot.isAvailable = false;
    await availability.save();

    await AppointmentModel.updateOne(
        { doctor, patient },
        {
          appointmentDate: new Date(`${appointmentDate}T${newTimeSlot}`),
          timeSlot: newTimeSlot,
          notes,
        }
    );

    return { code: 200, message: "New Appointment has booked" };
  } catch (error) {
    return error;
  }
};
