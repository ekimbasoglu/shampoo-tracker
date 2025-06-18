import { Request, Response } from "express";
import ratingService from "../services/ratingService";

const rateContent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { contentId } = req.params;
    const { rating } = req.body;
    // @ts-ignore
    const userId = req.user.id;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
      res
        .status(400)
        .json({ message: "Rating must be a number between 1 and 5" });
      return;
    }

    const ratedContent = await ratingService.rateContent(
      userId,
      contentId,
      rating
    );
    res.status(200).json({
      message: "Content rated successfully",
      rating: ratedContent,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const getRatingsByContent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { contentId } = req.params;
    const ratings = await ratingService.getRatingsByContent(contentId);
    res.status(200).json(ratings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const getRatingsByUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const ratings = await ratingService.getRatingsByUser(userId);
    res.status(200).json(ratings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  rateContent,
  getRatingsByContent,
  getRatingsByUser,
};
