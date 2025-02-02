import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: { type: Date, required: true },
  availableSlots: [
    {
      time: { type: String, required: true },
      isAvailable: { type: Boolean, default: true },
    },
  ],
});

const DoctorAvailability = mongoose.model(
  "DoctorAvailability",
  availabilitySchema
);

export default DoctorAvailability;
