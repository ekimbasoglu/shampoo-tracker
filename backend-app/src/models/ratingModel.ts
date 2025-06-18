import mongoose, { Document, Schema } from "mongoose";

export interface IRating extends Document {
  user: mongoose.Types.ObjectId;
  content: mongoose.Types.ObjectId;
  rating: number;
  created_at: Date;
}

const ratingSchema: Schema = new Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    content: { type: mongoose.Types.ObjectId, ref: "Content", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    created_at: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const Rating = mongoose.model<IRating>("Rating", ratingSchema);

export default Rating;
