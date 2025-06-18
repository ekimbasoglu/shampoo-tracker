import { Request, Response } from "express";
import contentService from "../services/productService";
import { IContent } from "../models/productModel";

// Create new content
const createContent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, category, thumbnail_url, content_url } =
      req.body;

    const content: IContent = await contentService.createContent(req.body);
    res.status(201).json({
      message: "Content created successfully",
      content,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Read all content
const getAllContent = async (req: Request, res: Response): Promise<void> => {
  try {
    const contents = await contentService.getAllContent();
    res.status(200).json(contents);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Read specific content by ID
const getContentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const content = await contentService.getContentById(req.params.id);

    if (!content) {
      res.status(404).json({ message: "Content not found" });
      return;
    }

    res.status(200).json(content);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Update content by ID
const updateContentById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updatedContent = await contentService.updateContentById(
      req.params.id,
      req.body
    );

    if (!updatedContent) {
      res
        .status(404)
        .json({ message: "Content not found or no changes were made" });
      return;
    }

    res.status(200).json({
      message: "Content updated successfully",
      content: updatedContent,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Delete content by ID
const deleteContentById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deleted = await contentService.deleteContentById(req.params.id);

    if (!deleted) {
      res.status(404).json({ message: "Content not found" });
      return;
    }

    res.status(200).json({ message: "Content deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  createContent,
  getAllContent,
  getContentById,
  updateContentById,
  deleteContentById,
};
