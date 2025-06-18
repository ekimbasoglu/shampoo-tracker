import { Router } from "express";
import authRoutes from "./authRoutes";
import productRoutes from "./productRoutes";

const router = Router();

// Auth routes
router.use("/auth", authRoutes);

// Products routes
router.use("/products", productRoutes);

export default router;
