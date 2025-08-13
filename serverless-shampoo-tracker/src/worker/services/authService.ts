/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import type { User } from "../models/userModel";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret";
const secretKey = new TextEncoder().encode(JWT_SECRET); // Uint8Array

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const comparePassword = async (
  inputPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(inputPassword, hashedPassword);
};

export async function verifyToken(token: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(token, secretKey);
  return payload; // contains { id, email, exp, … }
}

export async function generateToken(user: User): Promise<string> {
  return new SignJWT({ id: user.id, email: user.email })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1h")
    .sign(secretKey);
}

export const signup = async (
  DB: D1Database,
  email: string,
  username: string,
  password: string
): Promise<User> => {
  const duplicate = await DB.prepare(
    `SELECT id FROM users
      WHERE email = ? OR username = ?
      LIMIT 1`
  )
    .bind(email, username)
    .first<{ id: number } | null>();

  if (duplicate) {
    throw new Error("Email or username already exists");
  }
  const hashed = await hashPassword(password);

  const result = await DB.prepare(
    `INSERT INTO users (email, username, password) VALUES (?, ?, ?)`
  )
    .bind(email, username, hashed)
    .run();

  const id = result.meta?.last_row_id!;

  return {
    id,
    email,
    username,
    password: hashed,
  };
};

export const login = async (
  DB: D1Database,
  email: string,
  password: string
): Promise<User | null> => {
  const user = await DB.prepare(`SELECT * FROM users WHERE email = ?`)
    .bind(email)
    .first<User>();

  if (!user || !(await comparePassword(password, user.password))) {
    throw new Error("Invalid credentials");
  }

  return user;
};

export default {
  hashPassword,
  comparePassword,
  verifyToken,
  generateToken,
  signup,
  login,
};
