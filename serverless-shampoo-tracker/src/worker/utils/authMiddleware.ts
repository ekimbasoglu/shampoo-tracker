import { MiddlewareHandler } from "hono";
import { verifyToken } from "../services/authService";
import type { Env } from "../types/env";
import { User } from "../models/userModel";

export const authMiddleware: MiddlewareHandler<Env> = async (c, next) => {
  const raw = c.req.header("Authorization") || "";
  const token = raw.startsWith("Bearer ") ? raw.slice(7) : null;
  if (!token) return c.json({ message: "No token provided" }, 401);

  try {
    const payload = await verifyToken(token);

    const user = await c.env.DB.prepare("SELECT * FROM users WHERE id = ?")
      .bind(payload.id)
      .first<User>();

    if (!user) return c.json({ message: "User not found" }, 401);

    c.set("user", user);
    await next();
  } catch {
    return c.json({ message: "Invalid token" }, 401);
  }
};
