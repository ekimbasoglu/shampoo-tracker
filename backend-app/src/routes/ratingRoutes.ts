import { Router } from "express";
import ratingController from "../controllers/ratingController";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Ratings
 *   description: Rating management
 */

/**
 * @swagger
 * /api/rating/{contentId}/rate:
 *   post:
 *     summary: Rate a content item
 *     tags: [Ratings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contentId
 *         schema:
 *           type: string
 *         required: true
 *         description: The content ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *     responses:
 *       200:
 *         description: Rating created or updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rating:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: string
 *                     content:
 *                       type: string
 *                     rating:
 *                       type: number
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Content not found
 */
router.post("/:contentId/rate", authMiddleware, ratingController.rateContent);

/**
 * @swagger
 * /api/rating/content/{contentId}:
 *   get:
 *     summary: Get all ratings for a specific content item
 *     tags: [Ratings]
 *     parameters:
 *       - in: path
 *         name: contentId
 *         schema:
 *           type: string
 *         required: true
 *         description: The content ID
 *     responses:
 *       200:
 *         description: List of all ratings for the content item
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   user:
 *                     type: string
 *                   rating:
 *                     type: number
 *                     minimum: 1
 *                     maximum: 5
 *       404:
 *         description: Content not found
 */
router.get("/content/:contentId", ratingController.getRatingsByContent);

/**
 * @swagger
 * /api/rating/user/{userId}:
 *   get:
 *     summary: Get all ratings by a specific user
 *     tags: [Ratings]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: List of all ratings by the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   content:
 *                     type: string
 *                   rating:
 *                     type: number
 *                     minimum: 1
 *                     maximum: 5
 *       404:
 *         description: User not found
 */
router.get("/user/:userId", ratingController.getRatingsByUser);

export default router;
