import { Router } from 'express';

import {
  getResearchStatus,
  postResearchSearch,
} from '../controllers/research.controller.js';

const router = Router();

router.get('/status', getResearchStatus);
router.post('/search', postResearchSearch);

export default router;

