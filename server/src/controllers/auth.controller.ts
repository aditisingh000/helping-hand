import { Request, Response } from "express";

import { AppDataSource } from "../config/data-source.js";
import { User } from "../models/User.js";
import { hashPassword, comparePassword, generateAccessToken, generateVerificationToken } from "../utils/auth.js";
import { sendVerificationEmail, sendPasswordResetEmail } from "../utils/email.js";

const isProduction = process.env.NODE_ENV === "production";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: "Name, email, and password are required" });
      return;
    }

    const userRepository = AppDataSource.getRepository(User);

    const existingUser = await userRepository.findOneBy({ email });
    if (existingUser) {
      res.status(400).json({ message: "User with this email already exists" });
      return;
    }

    const hashedPassword = await hashPassword(password);
    const verificationToken = generateVerificationToken();

    const newUser = userRepository.create({
      name,
      email,
      passwordHash: hashedPassword,
      emailVerificationToken: verificationToken,
    });

    await userRepository.save(newUser);

    // Send verification email
    await sendVerificationEmail(newUser.email, verificationToken);

    res.status(201).json({ message: "Registration successful. Please check your email to verify your account." });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Internal server error during registration" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ email });

    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    if (!user.emailVerified) {
      res.status(403).json({ message: "Please verify your email before logging in" });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({ message: "Account disabled" });
      return;
    }

    // Update last login
    user.lastLogin = new Date();
    await userRepository.save(user);

    const token = generateAccessToken({ userId: user.id });

    // Set securely signed cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      signed: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Don't send password hash back
    const { passwordHash: _ph, emailVerificationToken: _evt, passwordResetToken: _prt, ...userSafeData } = user;
    
    res.status(200).json({
      message: "Login successful",
      user: userSafeData,
      token, // Also return in body primarily for mobile apps/custom clients
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error during login" });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
  });
  res.status(200).json({ message: "Logged out successfully" });
};

export const getCurrentUser = (req: Request, res: Response) => {
  // If we reach this, it means auth middleware passed and attached req.user
  const user = req.user!;
  
  const { passwordHash: _ph, emailVerificationToken: _evt, passwordResetToken: _prt, ...userSafeData } = user;
  
  res.status(200).json({ user: userSafeData });
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;

    if (!token || typeof token !== "string") {
      res.status(400).json({ message: "Verification token is required" });
      return;
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ emailVerificationToken: token });

    if (!user) {
      res.status(400).json({ message: "Invalid or expired verification token" });
      return;
    }

    user.emailVerified = true;
    user.emailVerificationToken = ""; // Clear token
    await userRepository.save(user);

    res.status(200).json({ message: "Email successfully verified. You can now log in." });
  } catch (error) {
    console.error("Verify email error:", error);
    res.status(500).json({ message: "Internal server error during email verification" });
  }
};

export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: "Email is required" });
      return;
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ email });

    // We don't want to expose if the user exists or not for security reasons,
    // so we always return 200 whether it's sent or not.
    if (user) {
      const resetToken = generateVerificationToken();
      // Valid for 1 hour
      const expires = new Date();
      expires.setHours(expires.getHours() + 1);

      user.passwordResetToken = resetToken;
      user.passwordResetExpires = expires;
      await userRepository.save(user);

      await sendPasswordResetEmail(user.email, resetToken);
    }

    res.status(200).json({ message: "If that email exists, a password reset link has been sent." });
  } catch (error) {
    console.error("Request password reset error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      res.status(400).json({ message: "Token and new password are required" });
      return;
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { passwordResetToken: token }
    });

    if (!user) {
      res.status(400).json({ message: "Invalid or expired reset token" });
      return;
    }

    // Check if token has expired
    if (user.passwordResetExpires && new Date() > user.passwordResetExpires) {
      res.status(400).json({ message: "Reset token has expired. Please request a new one." });
      return;
    }

    // Set new password
    user.passwordHash = await hashPassword(newPassword);
    
    // Clear reset token and expiration
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user.passwordResetToken = null as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user.passwordResetExpires = null as any;
    
    await userRepository.save(user);

    res.status(200).json({ message: "Password successfully reset. You can now log in with the new password." });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
