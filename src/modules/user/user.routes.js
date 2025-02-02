import { Router } from 'express';

import { getUserProfile, updateUserProfile, getUserProfileById, deleteUser, createACL } from './user.controller.js';

import { authenticateUser } from '../authentication/authentication.middleware.js';


const router = Router();

/* Creating a route for the fetching user details. */
router.route('/').get(authenticateUser, getUserProfile);

router.route('/update-user-profile').put(authenticateUser, updateUserProfile);

router.route('/:userId').get(authenticateUser, getUserProfileById);

router.route('/:userId').delete(authenticateUser, deleteUser);

router.post('/create-acl', authenticateUser, createACL);

export default router;
