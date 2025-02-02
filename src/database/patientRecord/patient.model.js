import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: true,
    },
    diagnoses: [
      {
        condition: { type: String, required: true }, // Example: 'Diabetes Type 2'
        diagnosedAt: { type: Date, default: Date.now }, // Date of diagnosis
        notes: { type: String }, // Additional details about the diagnosis
      },
    ],
    tests: [
      {
        testName: { type: String, required: true }, // Example: 'Blood Test'
        result: { type: String }, // Example: 'Normal' / 'Abnormal'
        conductedAt: { type: Date, default: Date.now }, // Date of test
      },
    ],
    medicines: [
      {
        name: { type: String, required: true }, // Example: 'Paracetamol'
        dosage: { type: String }, // Example: '500mg'
        frequency: { type: String }, // Example: 'Twice a day'
        prescribedAt: { type: Date, default: Date.now }, // Date when prescribed
      },
    ],
    treatment: [
      {
        procedure: { type: String, required: true }, // Example: 'Physiotherapy'
        startDate: { type: Date }, // Treatment start date
        endDate: { type: Date }, // Treatment end date
        notes: { type: String }, // Additional information
      },
    ],
    advice: [
      {
        note: { type: String, required: true },
        givenAt: { type: Date, default: Date.now },
      },
    ],
    visitDate: {
      type: Date,
      default: Date.now, // When the patient visited
    },
    nextAppointment: {
      type: Date, // Scheduled next appointment date
    },
    status: {
      type: String,
      enum: ["Active", "Recovered", "Under Treatment", "Discharged"],
      default: "Under Treatment",
    },
    doctor: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  { timestamps: true }
);

export const PatientModel = mongoose.model("Patient", patientSchema);
