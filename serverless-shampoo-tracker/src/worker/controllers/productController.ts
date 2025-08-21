/* eslint-disable @typescript-eslint/no-explicit-any */
import { Context } from "hono";
import productService from "../services/productService";
import * as ioService from "../services/importExportService";

const createProduct = async (c: Context) => {
  const body = await c.req.json();
  if (!body || !body.code || !body.name) {
    return c.json(
      { message: "Barcode, code, and name are required fields" },
      400
    );
  }
  const existingProduct = await productService.getProductByBarcodeOrCode(
    c.env.DB,
    body.barcode,
    body.code
  );
  if (existingProduct) {
    return c.json(
      { message: "Product with this barcode or code already exists" },
      400
    );
  }
  try {
    const newProduct = await productService.createProduct(c.env.DB, body);
    return c.json(
      { message: "Product created successfully", product: newProduct },
      201
    );
  } catch (error: any) {
    return c.json(
      { message: "Failed to create product", error: error.message || error },
      500
    );
  }
};

const getProducts = async (c: Context) => {
  try {
    const products = await productService.getAllProducts(c.env.DB);
    return c.json({ message: "Products fetched successfully", products }, 200);
  } catch (error: any) {
    return c.json(
      { message: "Failed to fetch products", error: error.message || error },
      500
    );
  }
};

const getProductById = async (c: Context) => {
  const productId = c.req.param("id");
  if (!productId) return c.json({ message: "Product ID is required" }, 400);
  try {
    const product = await productService.getProductById(c.env.DB, productId);
    if (!product) return c.json({ message: "Product not found" }, 404);
    return c.json({ message: "Product fetched successfully", product }, 200);
  } catch (error: any) {
    return c.json(
      { message: "Failed to fetch product", error: error.message || error },
      500
    );
  }
};

const updateProductById = async (c: Context) => {
  const body = await c.req.json();

  if (!body)
    return c.json({ message: "Product ID and data are required" }, 400);
  try {
    const productId = body.id;
    const updatedProduct = await productService.updateProductById(
      c.env.DB,
      productId,
      body
    );
    if (!updatedProduct) return c.json({ message: "Product not found" }, 404);
    return c.json(
      { message: "Product updated successfully", product: updatedProduct },
      200
    );
  } catch (error: any) {
    return c.json(
      { message: "Failed to update product", error: error.message || error },
      500
    );
  }
};

const deleteProductById = async (c: Context) => {
  const productId = c.req.param("id");
  if (!productId) return c.json({ message: "Product ID is required" }, 400);
  try {
    const deletedProduct = await productService.deleteProductById(
      c.env.DB,
      productId
    );
    if (!deletedProduct) return c.json({ message: "Product not found" }, 404);
    return c.json(
      { message: "Product deleted successfully", product: deletedProduct },
      200
    );
  } catch (error: any) {
    return c.json(
      { message: "Failed to delete product", error: error.message || error },
      500
    );
  }
};

const importProducts = async (c: Context) => {
  const products = c.get("products");

  if (!products) return c.json({ message: "Products data is required" }, 400);
  try {
    const importedProducts = await ioService.importProducts(c.env.DB, products);
    return c.json(
      { message: "Products imported successfully", products: importedProducts },
      201
    );
  } catch (error: any) {
    return c.json(
      { message: "Failed to import products", error: error.message || error },
      500
    );
  }
};

const exportProducts = async (c: Context) => {
  try {
    const { format = "shopify", products = [] } = await c.req.json();
    let csv: string;
    switch (format) {
      case "shopify":
        csv = await ioService.exportForShopify(products);
        break;
      case "excel":
        csv = await ioService.exportForExcelFormatted(products);
        break;
      default:
        return c.json(
          { message: "Invalid export type. Must be 'shopify' or 'excel'." },
          400
        );
    }
    return new Response(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="products-${format}-${Date.now()}.csv"`,
      },
    });
  } catch (err: any) {
    return c.json(
      { message: "Failed to export products", error: err.message ?? err },
      500
    );
  }
};

const deleteAllProducts = async (c: Context) => {
  try {
    await productService.deleteAllProducts(c.env.DB);
    return c.json({ message: "All products deleted successfully" }, 200);
  } catch (error: any) {
    return c.json(
      {
        message: "Failed to delete all products",
        error: error.message || error,
      },
      500
    );
  }
};

export default {
  createProduct,
  getProducts,
  getProductById,
  updateProductById,
  deleteProductById,
  importProducts,
  exportProducts,
  deleteAllProducts,
};
