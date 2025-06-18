import { Router } from "express";
import authRoutes from "./authRoutes";
import contentRoutes from "./contentRoutes";
import ratingRoutes from "./ratingRoutes";

const router = Router();

// Auth routes
router.use("/auth", authRoutes);

// Content routes
router.use("/content", contentRoutes);

// Rating routes
router.use("/rating", ratingRoutes);

export default router;
