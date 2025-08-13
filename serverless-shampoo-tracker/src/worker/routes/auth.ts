import { Hono } from "hono";
import authController from "../controllers/authController";

const auth = new Hono<{ Bindings: { DB: D1Database } }>();

auth.post("/login", authController.login);
auth.post("/signup", authController.signup);

export default auth;
