import { Router } from 'express';
import { register, verifyEmail, login } from '../controllers/auth.controller';
export const authRouter = Router();

authRouter.post('/register', register);
authRouter.get('/verify-email', verifyEmail);
authRouter.post('/login', login);
