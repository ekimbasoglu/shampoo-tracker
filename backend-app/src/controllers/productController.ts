import { Request, Response } from "express";
import productService from "../services/productService";
import { IProduct } from "../models/productModel";

// Create new product
const createProduct = async (req: Request, res: Response): Promise<void> => {
  if (!req.body || Object.keys(req.body).length === 0) {
    res.status(400).json({ message: "Product data is required" });
    return;
  }
  if (!req.body.barcode || !req.body.code || !req.body.name) {
    res
      .status(400)
      .json({ message: "Barcode, code, and name are required fields" });
    return;
  }
  // Validate that barcode and code are unique
  const existingProduct = await productService.getProductByBarcodeOrCode(
    req.body.barcode,
    req.body.code
  );
  if (existingProduct) {
    res.status(400).json({
      message: "Product with this barcode or code already exists",
    });
    return;
  }
  const productData: Partial<IProduct> = req.body;
  try {
    const newProduct = await productService.createProduct(productData);

    res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to create product",
      error: error.message || error,
    });
  }
};

// Get all products
const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await productService.getAllProducts();
    res.status(200).json({
      message: "Products fetched successfully",
      products,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch products",
      error: error.message || error,
    });
  }
};

const getProductById = async (req: Request, res: Response): Promise<void> => {
  const productId = req.params.id;
  if (!productId) {
    res.status(400).json({ message: "Product ID is required" });
    return;
  }
  try {
    const product = await productService.getProductById(productId);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.status(200).json({
      message: "Product fetched successfully",
      product,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch product",
      error: error.message || error,
    });
  }
};

const updateProductById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const productId = req.params.id;
  if (!productId) {
    res.status(400).json({ message: "Product ID is required" });
    return;
  }
  if (!req.body || Object.keys(req.body).length === 0) {
    res.status(400).json({ message: "Product data is required" });
    return;
  }
  try {
    const updatedProduct = await productService.updateProductById(
      productId,
      req.body
    );
    if (!updatedProduct) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to update product",
      error: error.message || error,
    });
  }
};

const deleteProductById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const productId = req.params.id;
  if (!productId) {
    res.status(400).json({ message: "Product ID is required" });
    return;
  }
  try {
    const deletedProduct = await productService.deleteProductById(productId);
    if (!deletedProduct) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.status(200).json({
      message: "Product deleted successfully",
      product: deletedProduct,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to delete product",
      error: error.message || error,
    });
  }
};

export default {
  createProduct,
  getProducts,
  getProductById,
  updateProductById,
  deleteProductById,
};
