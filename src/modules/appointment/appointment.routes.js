import { Router } from "express";

import { createDoctorAvailability, bookAppointment, fetchAppointments, updateAppointment, deleteAppointment, confirmAppointment } from "./appointment.controller.js";

import { authenticateUser } from "../authentication/authentication.middleware.js";

const router = Router();

router.route("/").post(authenticateUser, bookAppointment);

router.route('/doctor-availability/:doctorId').post(authenticateUser, createDoctorAvailability);

router.route('/confirm-appointment/:appointmentId').patch(authenticateUser, confirmAppointment);

router.route("/get-apppointments").get(authenticateUser, fetchAppointments);

router.route("/:appointmentId").put(authenticateUser, updateAppointment);

router.route("/:appointmentId").delete(authenticateUser, deleteAppointment);


export default router;
