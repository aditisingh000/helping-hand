import nodemailer from "nodemailer";

// Using Ethereal Email for testing:
// https://ethereal.email/
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST ?? "smtp.ethereal.email",
  port: parseInt(process.env.SMTP_PORT ?? "587", 10),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Ensures the transporter is configured properly.
 */
export const verifyTransporter = async (): Promise<boolean> => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn("SMTP_USER or SMTP_PASS not set in environment. Email service may fail.");
    }
    await transporter.verify();
    return true;
  } catch (error) {
    console.error("Transporter verification failed:", error);
    return false;
  }
};

/**
 * General purpose function to send emails.
 * Uses nodemailer transporter configured securely in the environment.
 */
export const sendEmail = async (to: string, subject: string, htmlContent: string) => {
  try {
    const info = await transporter.sendMail({
      from: `"Helping Hand Support" <${process.env.SMTP_USER ?? "no-reply@helpinghand.example.com"}>`,
      to,
      subject,
      html: htmlContent,
    });
    console.log(`Email sent: ${info.messageId}`);
    if (info.messageId.includes("ethereal")) {
      console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
    return true;
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
    return false;
  }
};

/**
 * Sends a verification email for user registration.
 */
export const sendVerificationEmail = async (to: string, verificationToken: string) => {
  const clientUrl = process.env.CLIENT_URL ?? "http://localhost:5173";
  const verificationLink = `${clientUrl}/verify-email?token=${verificationToken}`;

  const html = `
    <h1>Verify Your Email</h1>
    <p>Welcome to Helping Hand! Please verify your email address to complete your registration by clicking the link below:</p>
    <a href="${verificationLink}" style="display:inline-block;padding:10px 20px;background-color:#4ECDC4;color:#fff;text-decoration:none;border-radius:4px;">Verify Email</a>
    <p>If you did not request this, please ignore this email.</p>
  `;

  return sendEmail(to, "Helping Hand - Verify Your Email", html);
};

/**
 * Sends a password reset email.
 */
export const sendPasswordResetEmail = async (to: string, resetToken: string) => {
  const clientUrl = process.env.CLIENT_URL ?? "http://localhost:5173";
  const resetLink = `${clientUrl}/reset-password?token=${resetToken}`;

  const html = `
    <h1>Reset Your Password</h1>
    <p>We received a request to reset your password. Click the link below to set a new password:</p>
    <a href="${resetLink}" style="display:inline-block;padding:10px 20px;background-color:#FF6B6B;color:#fff;text-decoration:none;border-radius:4px;">Reset Password</a>
    <p>This link is valid for 1 hour. If you did not request this, please ignore this email.</p>
  `;

  return sendEmail(to, "Helping Hand - Password Reset Request", html);
};
