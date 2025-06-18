import { Router } from "express";
import productController from "../controllers/productController";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Content
 *   description: Content management
 */

/**
 * @swagger
 * /api/content:
 *   post:
 *     summary: Create a new content item
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: ["game", "video", "artwork", "music"]
 *               thumbnail_url:
 *                 type: string
 *               content_url:
 *                 type: string
 *     responses:
 *       201:
 *         description: Content created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 category:
 *                   type: string
 *                 thumbnail_url:
 *                   type: string
 *                 content_url:
 *                   type: string
 *       401:
 *         description: Unauthorized
 */
router.post("/", authMiddleware, productController.createProduct);

// /**
//  * @swagger
//  * /api/content:
//  *   get:
//  *     summary: Get all content items
//  *     tags: [Content]
//  *     responses:
//  *       200:
//  *         description: List of all content items
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 type: object
//  *                 properties:
//  *                   _id:
//  *                     type: string
//  *                   title:
//  *                     type: string
//  *                   description:
//  *                     type: string
//  *                   category:
//  *                     type: string
//  *                   thumbnail_url:
//  *                     type: string
//  *                   content_url:
//  *                     type: string
//  */
router.get("/", authMiddleware, productController.getProducts);

// /**
//  * @swagger
//  * /api/content/{id}:
//  *   get:
//  *     summary: Get a specific content item by ID
//  *     tags: [Content]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: The content ID
//  *     responses:
//  *       200:
//  *         description: The content item details
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 _id:
//  *                   type: string
//  *                 title:
//  *                   type: string
//  *                 description:
//  *                   type: string
//  *                 category:
//  *                   type: string
//  *                 thumbnail_url:
//  *                   type: string
//  *                 content_url:
//  *                   type: string
//  *       404:
//  *         description: Content not found
//  */
// router.get("/:id", authMiddleware, contentController.getContentById);

// /**
//  * @swagger
//  * /api/content/{id}:
//  *   put:
//  *     summary: Update a content item by ID
//  *     tags: [Content]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: The content ID
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               title:
//  *                 type: string
//  *               description:
//  *                 type: string
//  *               category:
//  *                 type: string
//  *                 enum: ["game", "video", "artwork", "music"]
//  *               thumbnail_url:
//  *                 type: string
//  *               content_url:
//  *                 type: string
//  *     responses:
//  *       200:
//  *         description: Content updated successfully
//  *       401:
//  *         description: Unauthorized
//  *       404:
//  *         description: Content not found
//  */
// router.put("/:id", authMiddleware, contentController.updateContentById);

// /**
//  * @swagger
//  * /api/content/{id}:
//  *   delete:
//  *     summary: Delete a content item by ID
//  *     tags: [Content]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: The content ID
//  *     responses:
//  *       200:
//  *         description: Content deleted successfully
//  *       401:
//  *         description: Unauthorized
//  *       404:
//  *         description: Content not found
//  */
// router.delete("/:id", authMiddleware, contentController.deleteContentById);

export default router;
