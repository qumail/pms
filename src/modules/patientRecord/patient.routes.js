import { Router } from 'express';

import { updatePatientRecord, getPatientRecord, getPatientById, deletePatient, createPatientRecord } from './patient.controller.js';

import { authenticateUser } from '../authentication/authentication.middleware.js';

const router = Router();

router.route('/').get(authenticateUser, getPatientRecord);

router.route('/:patientId').post(authenticateUser, createPatientRecord);

router.route('/update-patient-record').put(authenticateUser, updatePatientRecord);

router.route('/:patientId').get(authenticateUser, getPatientById);

router.route('/:patientId').delete(authenticateUser, deletePatient);

export default router;
