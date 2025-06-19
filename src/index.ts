import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { authRouter } from './routes/auth.routes';
// import { userRouter } from './routes/user.routes';

dotenv.config();
const app = express();
app.use(express.json());

app.use('/api/auth', authRouter);
// app.use('/api/users', userRouter);

const PORT = process.env.PORT || 4000;
connectDB().then(() => app.listen(PORT, () => console.log(`API on ${PORT}`)));
