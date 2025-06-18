import { Request, Response } from "express";
import productService from "../services/productService";
import { IProduct } from "../models/productModel";

// TODO
// Create new product
const createProduct = async (req: Request, res: Response): Promise<void> => {
  res.status(201).json({
    message: "Product created successfully",
    // content,
  });
};

// TODO
// Get all products
const getProducts = async (req: Request, res: Response): Promise<void> => {
  res.status(201).json({
    message: "Products fetched successfully",
    // content,
  });
};

// // Read all content
// const getAllContent = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const contents = await contentService.getAllContent();
//     res.status(200).json(contents);
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// };
export default {
  createProduct,
  getProducts,
};
