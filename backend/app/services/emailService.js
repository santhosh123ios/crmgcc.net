// emailService.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const sendVerificationEmail = async (email, verificationLink) => {
  // Setup transporter
 const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT, // Usually 465
  secure: true, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },

});

// Setup email content
const mailOptions = {
  from: `"Reward Club" <${process.env.EMAIL_USER}>`, // use env variable for sender email
  to: email,
  subject: 'Verify Your Email - Reward Club',
  html: `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
      <h2 style="color: #0e76a8;">Email Verification</h2>
      <p>Hello,</p>
      <p>Thank you for registering with <strong>Reward Club</strong>.</p>
      <p>Please verify your email address by clicking the button below:</p>
      <p style="text-align: center; margin: 30px 0;">
        <a href="${verificationLink}" style="background-color: #0e76a8; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
      </p>
      <p>If the button doesn't work, copy and paste the link below into your browser:</p>
      <p style="word-break: break-all;">${verificationLink}</p>
      <br/>
      <p>Best regards,<br/>The Reward Club Team</p>
    </div>
  `,
  text: `Verify your email by visiting this link: ${verificationLink}`, // plain-text fallback
};

// Send mail
await transporter.sendMail(mailOptions);
// await transporter.sendMail({
//     from: `"Reward Club" <${process.env.EMAIL_USER}>`,
//     to: "user@example.com",
//     subject: "Email Verification",
//     html: `<h3>Click to verify</h3><p><a href="https://yourdomain.com/verify">Verify Email</a></p>`,
// });
};