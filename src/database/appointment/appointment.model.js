import mongoose from "mongoose";

const { Schema } = mongoose;

const appointmentSchema = new Schema(
  {
    patient: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctor: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    timeSlot: { type: String, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'canceled'], default: 'pending' },
   
    notes: {
      type: String,
      maxlength: 500, // Optional additional details
    },
  },
  { timestamps: true }
);

export const AppointmentModel = mongoose.model(
  "Appointment",
  appointmentSchema
);
