import { Hono } from "hono";
import type { Env } from "./types/env";
import authRoutes from "./routes/auth";
import productRoutes from "./routes/products";

const app = new Hono<Env>();

app.get("/api/", (c) => c.json({ name: "Test" }));

app.route("/api/auth", authRoutes);
app.route("/api/products", productRoutes);

export default app;
