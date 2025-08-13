import { Hono } from "hono";
import productController from "../controllers/productController";
import { authMiddleware } from "../utils/authMiddleware";
import { csvUpload } from "../utils/csvUpload";
import { csvToProducts } from "../utils/csvToProducts";

const products = new Hono<{ Bindings: { DB: D1Database } }>();

products.use("*", authMiddleware);

// CRUD routes
products.post("/", productController.createProduct);
products.get("/", productController.getProducts);
products.get("/:id", productController.getProductById);
products.put("/:id", productController.updateProductById);
products.delete("/:id", productController.deleteProductById);

// Import/Export
products.post(
  "/import",
  csvUpload,
  csvToProducts,
  productController.importProducts
);
products.post("/export", productController.exportProducts);
products.post("/delete-all", productController.deleteAllProducts);

export default products;
