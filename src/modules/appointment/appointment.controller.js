import {
  BOOK_APPOINTMENT,
  GET_APPOINTMENT,
  UPDATE_APPOINTMENT,
  BOOK_DOCTOR_AVAILABILITY,
  DELETE_APPOINTMENT,
  CONFIRM_APPOINTMENT,
} from "../../configs/constants.config.js";
import { AppointmentModel } from "../../database/appointment/appointment.model.js";
import DoctorAvailability from "../../database/appointment/doctorAvailability.model.js";
import { checkPermissions } from "../authentication/authentication.helper.js";
import { bookNewAppointment } from "./appointment.helper.js";

export const createDoctorAvailability = async (req, res, next) => {
  try {
    const {
      body: { date, availableSlots },
      params: { doctorId },
    } = req;

    const hasPermission = await checkPermissions(
      req.user.role,
      BOOK_DOCTOR_AVAILABILITY,
      "write"
    );
    if (!hasPermission) {
      return res.send({
        code: "401",
        message: "Access denied: insufficient permissions",
      });
    }

    // Validate request data
    if (!date || !availableSlots || !Array.isArray(availableSlots)) {
      return res.status(400).json({
        message:
          "Invalid request data. Provide a date and an array of available slots.",
      });
    }

    // Check if availability already exists for the doctor on the given date
    let availability = await DoctorAvailability.findOne({
      doctor: doctorId,
      date,
    });

    if (availability) {
      // Update existing availability
      availability.availableSlots = availableSlots;
    } else {
      // Create new availability entry
      availability = new DoctorAvailability({
        doctor: doctorId,
        date,
        availableSlots,
      });
    }

    await availability.save();

    res.status(200).json({
      message: "Doctor availability updated successfully",
      availability,
    });
  } catch (error) {
    return next(error);
  }
};

export const bookAppointment = async (req, res, next) => {
  try {
    const {
      body: { doctor, appointmentDate, notes, patient, timeSlot },
    } = req;

    const hasPermission = await checkPermissions(
      req.user.role,
      BOOK_APPOINTMENT,
      "write"
    );
    if (!hasPermission) {
      return res.send({
        code: "401",
        message: "Access denied: insufficient permissions",
      });
    }

    const appointmentConfirmation = await bookNewAppointment(
      doctor,
      appointmentDate,
      timeSlot
    );
    return res
      .status(appointmentConfirmation.code)
      .json({ message: appointmentConfirmation.message });
  } catch (error) {
    return next(error);
  }
};

export const fetchAppointments = async (req, res, next) => {
  try {
    const {
      query: { skip, limit },
    } = req;
    const hasPermission = await checkPermissions(
      req.user.role,
      GET_APPOINTMENT,
      "read"
    );
    if (!hasPermission) {
      return res.send({
        code: "401",
        message: "Access denied: insufficient permissions",
      });
    }
    const query = {};
    if (req.user.role === "doctor") {
      query.doctor = req.user.id;
    }
    if (req.user.role === "patient") {
      query.patient = req.user.id;
    }
    const appointment = await AppointmentModel.find(query)
      .skip(skip)
      .limit(limit);
    if (appointment.length === 0) {
      return res.send({
        code: "202",
        success: true,
        messsage: "Appointment not found",
        data: {},
      });
    }
    return res.send({
      code: "200",
      success: true,
      messsage: "Appointment fetched",
      data: appointment,
    });
  } catch (error) {
    return next(error);
  }
};

export const confirmAppointment = async (req, res, next) => {
  try {
    const {
      params: { appointmentId },
      body: { status },
    } = req;

    const hasPermission = await checkPermissions(
      req.user.role,
      CONFIRM_APPOINTMENT,
      "write"
    );
    if (!hasPermission) {
      return res.send({
        code: "401",
        message: "Access denied: insufficient permissions",
      });
    }

    const query = { _id: appointmentId };

    if (req.user.role === "doctor") {
      query.doctor = req?.user?.id;
    }

    const appointment = await AppointmentModel.findOne(query);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    if (
      appointment.status === "canceled" ||
      appointment.status === "confirmed"
    ) {
      return res.status(400).json({
        message: `This appointment is already ${appointment?.status}.`,
      });
    }

    if (status === "canceled") {
      // Make the time slot available again
      const availability = await DoctorAvailability.findOne({
        doctor: appointment.doctor,
        date: appointment.appointmentDate.toISOString().split("T")[0],
      });
      const slot = availability.availableSlots.find(
        (slot) => slot.time === appointment.timeSlot
      );
      if (slot) {
        slot.isAvailable = true;
        await availability.save();
      }
    }

    appointment.status = status;
    await appointment.save();

    res.status(200).json({ message: `Appointment ${status} successfully.` });
  } catch (error) {
    return next(error);
  }
};

export const updateAppointment = async (req, res, next) => {
  try {
    const {
      body: { appointmentDate, timeSlot, notes },
      params: { appointmentId },
    } = req;
    if (!appointmentDate || !timeSlot || !notes) {
      return res.send({
        code: "201",
        success: true,
        message: "Payload is required",
      });
    }
    const hasPermission = await checkPermissions(
      req.user.role,
      UPDATE_APPOINTMENT,
      "write"
    );
    if (!hasPermission) {
      return res.send({
        code: "401",
        message: "Access denied: insufficient permissions",
      });
    }
    const query = { _id: appointmentId };
    if (req.user.role === "doctor") query.doctor = req.user.id;
    if (req.user.role === "patient") query.patient = req.user.id;
    const isExisted = await AppointmentModel.findOne(query).lean();
    if (!isExisted) {
      return res.send({
        code: "202",
        success: true,
        message: "Appointment does not exist",
        data: {},
      });
    }
    if (isExisted.status === "canceled" || isExisted.status === "confirmed") {
      return res
        .status(202)
        .json({ message: `You cannot edit ${isExisted.status} appointment` });
    }

    const appointmentConfirmation = await bookNewAppointment(
      isExisted.doctor,
      appointmentDate,
      isExisted.timeSlot,
      timeSlot,
      notes,
      isExisted.patient,
    );

    return res.send({
      code: appointmentConfirmation.code,
      success: true,
      message: appointmentConfirmation.message,
      data: {},
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteAppointment = async (req, res, next) => {
  try {
    const {
      params: { appointmentId },
    } = req;
    const hasPermission = await checkPermissions(
      req.user.role,
      DELETE_APPOINTMENT,
      "delete"
    );
    if (!hasPermission) {
      return res.send({
        code: "401",
        message: "Access denied: insufficient permissions",
      });
    }
    const query = { _id: appointmentId };
    if (req.user.role === "patient") query.patient = req.user.id;
    const appointmentDeleted = await AppointmentModel.findOneAndDelete(query);
    if (!appointmentDeleted) {
      return res.send({
        code: "202",
        success: true,
        message: "Patient Record not found",
        data: {},
      });
    }
    if (appointmentDeleted.status !== "canceled") {
      const availability = await DoctorAvailability.findOne({
        doctor: appointmentDeleted?.doctor,
        date: new Date(appointmentDeleted?.appointmentDate)
          .toISOString()
          .split("T")[0],
        "availableSlots.time": appointmentDeleted?.timeSlot,
      });
      const slot = availability.availableSlots.find(
        (slot) =>
          slot.time === appointmentDeleted?.timeSlot && !slot.isAvailable
      );
      slot.isAvailable = true;
      await availability.save();
    }
    return res.send({
      code: "200",
      success: true,
      message: "Patient Record Deleted",
      data: {},
    });
  } catch (error) {
    return next(error);
  }
};
