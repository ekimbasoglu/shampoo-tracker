import Rating, { IRating } from "../models/ratingModel";

const rateContent = async (
  userId: string,
  contentId: string,
  ratingValue: number
): Promise<IRating> => {
  // Check if the user has already rated this content
  const existingRating = await Rating.findOne({
    user: userId,
    content: contentId,
  });

  if (existingRating) {
    // Update the existing rating
    existingRating.rating = ratingValue;
    return await existingRating.save();
  } else {
    // Create a new rating
    const newRating = new Rating({
      user: userId,
      content: contentId,
      rating: ratingValue,
    });
    return await newRating.save();
  }
};

const getRatingsByContent = async (contentId: string): Promise<IRating[]> => {
  return await Rating.find({ content: contentId }).populate("user", "username");
};

const getRatingsByUser = async (userId: string): Promise<IRating[]> => {
  return await Rating.find({ user: userId }).populate("content", "title");
};

export default {
  rateContent,
  getRatingsByContent,
  getRatingsByUser,
};
