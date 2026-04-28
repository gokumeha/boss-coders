import { Router } from 'express';

import { postLegalQuery } from '../controllers/legal.controller.js';

const router = Router();

router.post('/legal-query', postLegalQuery);

export default router;

