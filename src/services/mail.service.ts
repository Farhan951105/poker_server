import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

export const sendVerificationEmail = async (email: string, token: string) => {
  const url = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  await transporter.sendMail({
    from: `"WildPoker" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Verify your WildPoker account',
    html: `<p>Click <a href="${url}">here</a> to verify your email.</p>`,
  });
};
