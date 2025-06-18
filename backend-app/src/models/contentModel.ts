import mongoose, { Document, Schema } from "mongoose";

export interface IContent extends Document {
  title: string;
  description: string;
  category: "game" | "video" | "artwork" | "music";
  thumbnail_url: string;
  content_url: string;
  created_at: Date;
}

const contentSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["game", "video", "artwork", "music"],
      required: true,
    },
    thumbnail_url: { type: String, required: true },
    content_url: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const Content = mongoose.model<IContent>("Content", contentSchema);

export default Content;
