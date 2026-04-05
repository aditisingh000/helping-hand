import { Request, Response, NextFunction } from "express";

import { AppDataSource } from "../config/data-source.js";
import { User } from "../models/User.js";
import { verifyToken, TokenPayload } from "../utils/auth.js";

// Extend Express Request object to hold current user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;

    // Standard Bearer Token strategy
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies && req.cookies.jwt) {
      // Fallback to httpOnly cookie strategy
      token = req.cookies.jwt;
    }

    if (!token) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      res.status(401).json({ message: "Invalid or expired token" });
      return;
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id: decoded.userId });

    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({ message: "Account disabled" });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }
};
