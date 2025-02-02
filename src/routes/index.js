import { Router } from 'express';

import healthRoutes from '../modules/health/health.routes.js';
// import  {readAllFromVault}  from '../configs/keyVault';
import authRoutes from '../modules/authentication/authentication.routes.js';

import userRoutes from '../modules/user/user.routes.js';

import patientRoutes from '../modules/patientRecord/patient.routes.js';

import aclRoutes from '../modules/accessControlLimit/acl.routes.js';

import appointmentRoutes from '../modules/appointment/appointment.routes.js'

/* Creating a new router object. */
const router = Router();

/** Route to check service health */
// router.route('').get(healthCtrl.checkConnection);
router.use('/health-check', healthRoutes);

router.use('/auth', authRoutes);

router.use('/user', userRoutes);

router.use('/patient', patientRoutes);

router.use('/acl', aclRoutes);

router.use('/appointment', appointmentRoutes)

/** Mounting keyvault services */
//router.route('/keyvault').get(readAllFromVault);

export default router;
