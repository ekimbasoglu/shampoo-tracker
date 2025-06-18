// src/services/contentService.ts

import Content, { IProduct } from "../models/productModel";

const createContent = async (data: Partial<IContent>): Promise<IContent> => {
  const { title, description, category, thumbnail_url, content_url } = data;

  // Validate category
  const validCategories: Array<"game" | "video" | "artwork" | "music"> = [
    "game",
    "video",
    "artwork",
    "music",
  ];
  if (
    !validCategories.includes(
      category as "game" | "video" | "artwork" | "music"
    )
  ) {
    throw new Error(
      `Invalid category. Must be one of: ${validCategories.join(", ")}`
    );
  }

  // Create content with category casted to the appropriate type
  const content = new Content({
    title,
    description,
    category: category as "game" | "video" | "artwork" | "music", // Explicitly cast the category
    thumbnail_url,
    content_url,
  });

  return await content.save();
};

const getAllContent = async (): Promise<IContent[]> => {
  const contents = await Content.aggregate([
    {
      $lookup: {
        from: "ratings",
        localField: "_id",
        foreignField: "content",
        as: "ratings",
      },
    },
    {
      $addFields: {
        averageRating: { $avg: "$ratings.rating" },
      },
    },
    {
      $project: {
        ratings: 0,
      },
    },
  ]);

  return contents;
};

const getContentById = async (id: string): Promise<IContent | null> => {
  return await Content.findById(id);
};

const updateContentById = async (
  id: string,
  data: Partial<IContent>
): Promise<IContent | null> => {
  return await Content.findByIdAndUpdate(id, data, { new: true });
};

const deleteContentById = async (id: string): Promise<boolean> => {
  const result = await Content.findByIdAndDelete(id);
  return result !== null;
};

export default {
  createContent,
  getAllContent,
  getContentById,
  updateContentById,
  deleteContentById,
};
