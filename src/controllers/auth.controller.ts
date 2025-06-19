import { Request, Response } from 'express';
import { User } from '../models/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendVerificationEmail } from '../services/mail.service';

const signToken = (id: number) => {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES;
    if (!secret) throw new Error('JWT_SECRET not set');
    // Only pass expiresIn if it's a string or number
    const options: jwt.SignOptions = {};
    if (typeof expiresIn === 'string' || typeof expiresIn === 'number') {
        options.expiresIn = expiresIn as any;
    }
    return jwt.sign({ id }, secret, options);
};

export const register = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) {
        res.status(409).json({ message: 'Email already used' });
        return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const emailToken = crypto.randomBytes(32).toString('hex');

    const user = await User.create({
        username,
        email,
        passwordHash,
        isEmailVerified: false,
        emailToken,
        emailTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    await sendVerificationEmail(email, emailToken);
    res.status(201).json({ message: 'Registration successful. Check your inbox.' });
};

export const verifyEmail = async (req: Request, res: Response) => {
    const token = typeof req.query.token === 'string' ? req.query.token : undefined;
    if (!token) {
        res.status(400).json({ message: 'Token invalid/expired' });
        return;
    }
    const user = await User.findOne({ where: { emailToken: token } });

    if (!user || (user.emailTokenExpires && user.emailTokenExpires < new Date())) {
        res.status(400).json({ message: 'Token invalid/expired' });
        return;
    }

    user.isEmailVerified = true;
    user.emailToken = undefined;
    user.emailTokenExpires = undefined;
    await user.save();

    res.json({ message: 'Email verified, you can now log in.' });
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) { res.status(400).json({ message: 'Invalid credentials' }); return; }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
        res.status(400).json({ message: 'Invalid credentials' });
        return;
    }

    if (!user.isEmailVerified) {
        res.status(401).json({ message: 'Verify your email first' });
        return;
    }

    const token = signToken(user.id);
    res.json({ token, user: { id: user.id, username: user.username, avatar: user.avatar } });
};
