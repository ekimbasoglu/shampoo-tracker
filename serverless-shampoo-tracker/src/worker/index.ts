import { Hono } from "hono";
import type { Env } from "./types/env";
import authRoutes from "./routes/auth";
import productRoutes from "./routes/products";
import { cors } from "hono/cors";

const app = new Hono<Env>();

app.use(
  "/api/*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);

app.get("/api/", (c) => c.json({ name: "Test" }));

app.route("/api/auth", authRoutes);
app.route("/api/products", productRoutes);

export default app;
