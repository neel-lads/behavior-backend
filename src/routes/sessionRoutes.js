import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { createSession, logEvent } from '../controllers/sessionController.js';

const router = express.Router();

router.post('/', authenticate, createSession);
router.post('/event', authenticate, logEvent);

export default router;