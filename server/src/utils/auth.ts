import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? "10", 10);
const JWT_SECRET = process.env.JWT_SECRET ?? "supersecretkey_dev_only";

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

export interface TokenPayload {
  userId: string;
}

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  // Let's also use JWT_SECRET for refresh token for simplicity, though best practice uses a differing secret.
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};

export const generateVerificationToken = (): string => {
  // Generate random 64 character hex string
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
};
