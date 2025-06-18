import mongoose from "mongoose";

export interface IProduct extends Document {
  barcode: string;
  code: string;
  name: string;
  shortDescription?: string;
  description?: string;
  brand?: string;
  category?: string;
  price?: {
    amount: number;
    currency: string;
  };
  volume?: {
    value: number;
    unit: string;
  };
  imageUrl?: string;
  tags?: string[];
  attributes?: Map<string, string>;
  aiDescription?: {
    content?: string;
    model?: string;
    generatedAt?: Date;
  };
  stockQty: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
const priceSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "EUR", maxlength: 3 },
  },
  { _id: false } // embedded sub-doc, no separate _id
);

const volumeSchema = new mongoose.Schema(
  {
    value: { type: Number, required: true, min: 0 },
    unit: { type: String, enum: ["mL", "L"], default: "mL" },
  },
  { _id: false }
);

const aiDescriptionSchema = new mongoose.Schema(
  {
    content: String, // full paragraph
    model: String, // e.g. 'gpt-4o'
    generatedAt: Date,
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    /* IDENTIFIERS */
    barcode: { type: String, required: true, unique: true }, // UPC/EAN
    code: { type: String, required: true, index: true }, // your own SKU

    /* CORE INFO */
    name: { type: String, required: true },
    shortDescription: { type: String, maxlength: 160 }, // tweet-length
    description: { type: String },
    brand: { type: String, index: true },
    category: { type: String, index: true }, // e.g. 'Shampoo'

    /* MERCH DATA */
    price: priceSchema,
    volume: volumeSchema,
    imageUrl: { type: String },

    /* OPTIONAL EXTRAS */
    tags: [String], // 'anti-dandruff', 'vegan', …
    attributes: { type: Map, of: String }, // flexible key-value pairs
    aiDescription: aiDescriptionSchema, // can be empty for now

    /* HOUSE-KEEPING */
    stockQty: { type: Number, default: 0 }, // if you track inventory
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true } // adds createdAt & updatedAt
);

/* Full-text index for quick search */
productSchema.index({
  name: "text",
  brand: "text",
  shortDescription: "text",
  description: "text",
});

export default mongoose.model("Product", productSchema);
