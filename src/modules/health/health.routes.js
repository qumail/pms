import { Router } from 'express';

import { checkConnection } from './health.controller.js';

// import { catchAsync } from '@tczdigital/node-utilities/errors';

const router = Router();

/* Creating a route for the health check. */
router.route('/').get(checkConnection);

export default router;
