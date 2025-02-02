import { Router } from 'express';

import { createACL, updateACL } from './acl.controller.js';

import { authenticateUser } from '../authentication/authentication.middleware.js';


const router = Router();

router.route('/').post(authenticateUser, createACL);

router.route('/:role').put(authenticateUser, updateACL);


export default router;