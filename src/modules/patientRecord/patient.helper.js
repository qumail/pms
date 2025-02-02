import { PatientModel } from "../../database/patientRecord/patient.model";

export const patientRecordUpdate = async (body, id) => {
    try {

        // Prepare an object to store dynamic updates
        const updates = {};

        // Handle medicines array update (using $push)
        if (body.medicines && Array.isArray(body.medicines)) {
            updates.medicines = { $push: { $each: body.medicines } };
        }

        // Handle diagnoses array update (using $push)
        if (body.diagnoses && Array.isArray(body.diagnoses)) {
            updates.diagnoses = { $push: { $each: body.diagnoses } };
        }

        // Handle tests array update (using $push)
        if (body.tests && Array.isArray(body.tests)) {
            updates.tests = { $push: { $each: body.tests } };
        }

        // Handle treatment array update (using $push)
        if (body.treatment && Array.isArray(body.treatment)) {
            updates.treatment = { $push: { $each: body.treatment } };
        }

        // Handle advice array update (using $push)
        if (body.advice && Array.isArray(body.advice)) {
            updates.advice = { $push: { $each: body.advice } };
        }
        // Handle updates for other fields (using $set)
        const { medicines, diagnoses, tests, treatment, advice, ...otherUpdates } = body;
        if (Object.keys(otherUpdates).length > 0) {
            updates.$set = otherUpdates;
        }
        // Perform the update operation
        const result = await PatientModel.updateOne(
            { patient: id }, // Search for the patient record by patient ID
            updates, // Apply the dynamic updates
            { runValidators: true } // Optionally run validators (important for required fields)
        );

        if (result.modifiedCount === 0) {
            return {
                code: "404",
                message: "Patient record not found or no changes were made",
            };
        }
        return {
            code: "200",
            success: true,
            message: "Patient record has been updated",
        }

    } catch (error) {
        return error
    }
}