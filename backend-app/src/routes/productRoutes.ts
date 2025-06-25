import { Router } from "express";
import productController from "../controllers/productController";
import authMiddleware from "../middleware/authMiddleware";
import { csvUpload, csvToProducts } from "../middleware/csv.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: product
 *   description: product management
 */

/**
 * @swagger
 * /api/product:
 *   post:
 *     summary: Create a new product item
 *     tags: [product]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       product:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               barcode:
 *                 type: string
 *               code:
 *                 type: string
 *               name:
 *                 type: string
 *               shortDescription:
 *                 type: string
 *               description:
 *                 type: string
 *               brand:
 *                 type: string
 *               category:
 *                 type: string
 *               price:
 *                 type: number
 *               volume:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               attributes:
 *                 type: object
 *                 additionalProperties: true
 *               aiDescription:
 *                 type: string
 *               stockQty:
 *                 type: integer
 *               isActive:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: product created successfully
 *         product:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 barcode:
 *                   type: string
 *                 code:
 *                   type: string
 *                 name:
 *                   type: string
 *                 shortDescription:
 *                   type: string
 *                 description:
 *                   type: string
 *                 brand:
 *                   type: string
 *                 category:
 *                   type: string
 *                 price:
 *                   type: number
 *                 volume:
 *                   type: string
 *                 imageUrl:
 *                   type: string
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: string
 *                 attributes:
 *                   type: object
 *                   additionalProperties: true
 *                 aiDescription:
 *                   type: string
 *                 stockQty:
 *                   type: integer
 *                 isActive:
 *                   type: boolean
 *       401:
 *         description: Unauthorized
 */
router.post("/", authMiddleware, productController.createProduct);

/**
 * @swagger
 * /api/product:
 *   get:
 *     summary: Get all product items
 *     tags: [product]
 *     responses:
 *       200:
 *         description: List of all product items
 *         product:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   barcode:
 *                     type: string
 *                   code:
 *                     type: string
 *                   name:
 *                     type: string
 *                   shortDescription:
 *                     type: string
 *                   description:
 *                     type: string
 *                   brand:
 *                     type: string
 *                   category:
 *                     type: string
 *                   price:
 *                     type: number
 *                   volume:
 *                     type: string
 *                   imageUrl:
 *                     type: string
 *                   tags:
 *                     type: array
 *                     items:
 *                       type: string
 *                   attributes:
 *                     type: object
 *                     additionalProperties: true
 *                   aiDescription:
 *                     type: string
 *                   stockQty:
 *                     type: integer
 *                   isActive:
 *                     type: boolean
 */
router.get("/", authMiddleware, productController.getProducts);

/**
 * @swagger
 * /api/product/{id}:
 *   get:
 *     summary: Get a specific product item by ID
 *     tags: [product]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product ID
 *     responses:
 *       200:
 *         description: The product item details
 *         product:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 barcode:
 *                   type: string
 *                 code:
 *                   type: string
 *                 name:
 *                   type: string
 *                 shortDescription:
 *                   type: string
 *                 description:
 *                   type: string
 *                 brand:
 *                   type: string
 *                 category:
 *                   type: string
 *                 price:
 *                   type: number
 *                 volume:
 *                   type: string
 *                 imageUrl:
 *                   type: string
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: string
 *                 attributes:
 *                   type: object
 *                   additionalProperties: true
 *                 aiDescription:
 *                   type: string
 *                 stockQty:
 *                   type: integer
 *                 isActive:
 *                   type: boolean
 *       404:
 *         description: product not found
 */
router.get("/:id", authMiddleware, productController.getProductById);

/**
 * @swagger
 * /api/product/{id}:
 *   put:
 *     summary: Update a product item by ID
 *     tags: [product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product ID
 *     requestBody:
 *       required: true
 *       product:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               barcode:
 *                 type: string
 *               code:
 *                 type: string
 *               name:
 *                 type: string
 *               shortDescription:
 *                 type: string
 *               description:
 *                 type: string
 *               brand:
 *                 type: string
 *               category:
 *                 type: string
 *               price:
 *                 type: number
 *               volume:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               attributes:
 *                 type: object
 *                 additionalProperties: true
 *               aiDescription:
 *                 type: string
 *               stockQty:
 *                 type: integer
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         product:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 barcode:
 *                   type: string
 *                 code:
 *                   type: string
 *                 name:
 *                   type: string
 *                 shortDescription:
 *                   type: string
 *                 description:
 *                   type: string
 *                 brand:
 *                   type: string
 *                 category:
 *                   type: string
 *                 price:
 *                   type: number
 *                 volume:
 *                   type: string
 *                 imageUrl:
 *                   type: string
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: string
 *                 attributes:
 *                   type: object
 *                   additionalProperties: true
 *                 aiDescription:
 *                   type: string
 *                 stockQty:
 *                   type: integer
 *                 isActive:
 *                   type: boolean
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: product not found
 */
router.put("/:id", authMiddleware, productController.updateProductById);

/**
 * @swagger
 * /api/product/{id}:
 *   delete:
 *     summary: Delete a product item by ID
 *     tags: [product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product ID
 *     responses:
 *       200:
 *         description: product deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: product not found
 */
router.delete("/:id", authMiddleware, productController.deleteProductById);

// Import/Export

// Import products from CSV
router.post(
  "/import",
  authMiddleware,
  csvUpload, // <== first: grab the file
  csvToProducts, // <== second: turn it into req.body.products
  productController.importProducts
);

// Export as CSV (no change on input)
router.post("/export", authMiddleware, productController.exportProducts);

router.post("/delete-all", authMiddleware, productController.deleteAllProducts);
export default router;
