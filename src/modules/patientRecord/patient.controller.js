import { PatientModel } from "../../database/patientRecord/patient.model.js";
import { UserModel } from "../../database/user/user.model.js";
import { checkPermissions } from "../authentication/authentication.helper.js";
import {
  CREATE_PATIENT_RECORD,
  DELETE_PATIENT_RECORD,
  GET_PATIENT_RECORD,
  GET_PATIENT_RECORD_BY_ID,
  UPDATE_PATIENT_RECORD,
} from "../../configs/constants.config.js";

export const getPatientRecord = async (req, res, next) => {
  try {
    const hasPermission = await checkPermissions(
      req.user.role,
      GET_PATIENT_RECORD,
      "read"
    );
    if (!hasPermission) {
      return res.send({
        code: "401",
        message: "Access denied: insufficient permissions",
      });
    }
    const patientRecord = await PatientModel.findOne({
      patient: req.user.id,
    }).lean();

    if (!patientRecord) {
      return res.send({
        code: "202",
        success: true,
        message: "Patient not found",
        data: {},
      });
    }
    return res.send({
      code: "200",
      success: true,
      message: "Patient record fetched",
      data: patientRecord,
    });
  } catch (error) {
    return next(error);
  }
};

export const updatePatientRecord = async (req, res, next) => {
  try {
    const {
      body,
      query: { id },
    } = req;

    if (Object.keys(body).length === 0) {
      return res.send({
        code: "201",
        success: true,
        message: "Payload is required",
      });
    }
    const hasPermission = await checkPermissions(
      req.user.role,
      UPDATE_PATIENT_RECORD,
      "write"
    );
    if (!hasPermission) {
      return res.send({
        code: "401",
        message: "Access denied: insufficient permissions",
      });
    }
    await PatientModel.updateOne({ patient: id }, body);
    return res.send({
      code: "200",
      success: true,
      message: "Patient record has been updated",
    });
  } catch (error) {
    return next(error);
  }
};

// TODO: Fetch only assigned patients records for doctor
export const getPatientById = async (req, res, next) => {
  try {
    const {
      params: { patientId },
    } = req;

    const hasPermission = await checkPermissions(
      req.user.role,
      GET_PATIENT_RECORD_BY_ID,
      "read"
    );
    if (!hasPermission) {
      return res.send({
        code: "401",
        message: "Access denied: insufficient permissions",
      });
    }

    const query = { patient: patientId };
    if (req.user.role === "doctor") {
      query.doctor = req.user.id;
    }
    const patientRecord = await PatientModel.findOne(query).lean();
    if (!patientRecord) {
      return res.send({
        code: "202",
        success: true,
        message: "Patient Record not found",
        data: {},
      });
    }
    return res.send({
      code: "200",
      success: true,
      message: "Patient Record Fetched",
      data: patientRecord,
    });
  } catch (error) {
    return next(error);
  }
};

export const deletePatient = async (req, res, next) => {
  try {
    const {
      params: { patientId },
    } = req;
    const hasPermission = await checkPermissions(
      req.user.role,
      DELETE_PATIENT_RECORD,
      "delete"
    );
    if (!hasPermission) {
      return res.send({
        code: "401",
        message: "Access denied: insufficient permissions",
      });
    }
    const patientRecord = await PatientModel.findOneAndDelete({
      patient: patientId,
    });
    if (!patientRecord) {
      return res.send({
        code: "202",
        success: true,
        message: "Patient Record not found",
        data: {},
      });
    }
    return res.send({
      code: "200",
      success: true,
      message: "Patient Record Deleted",
      data: patientRecord,
    });
  } catch (error) {
    return next(error);
  }
};

export const createPatientRecord = async (req, res, next) => {
  try {
    const {
      body,
      params: { patientId },
    } = req;

    if (Object.keys(body).length === 0) {
      return res.send({
        code: "201",
        success: true,
        message: "Record information is required",
      });
    }
    const hasPermission = await checkPermissions(
      req.user.role,
      CREATE_PATIENT_RECORD,
      "write"
    );
    if (!hasPermission) {
      return res.send({
        code: "401",
        message: "Access denied: insufficient permissions",
      });
    }
    const patientUserId = await UserModel.findOne({
      _id: patientId,
      role: "patient",
    })
      .select("_id")
      .lean();
    if (!patientUserId)
      return res.send({
        code: "201",
        message: "Patient is not registered on the system",
      });
    if (req.user.role === "admin" && !req?.body?.doctor)
      return res.send({ code: "201", message: "Required Doctor ID" });
    const patientObj = { ...body };
    patientObj.patient = patientUserId._id;
    patientObj.doctor = req.user.id;
    await PatientModel.create(patientObj);
    return res.send({
      code: "200",
      success: true,
      message: "Patient record has been created",
    });
  } catch (error) {
    return next(error);
  }
};
