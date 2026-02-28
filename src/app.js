import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import { limiter } from './middleware/rateLimiter.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(limiter);

app.use('/api/auth',authRoutes);
app.use('/api/session',sessionRoutes);
app.use('/api/analytics',analyticsRoutes);

export default app;