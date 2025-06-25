import mongoose from "mongoose";

export interface IProduct extends Document {
  _id: any;
  barcode: string;
  code: string;
  name: string;
  shortDescription?: string;
  description?: string;
  brand?: string;
  category?: string;
  price?: string; // e.g. "19.99 EUR"
  volume: string; // e.g. "500 mL"
  imageUrl?: string;
  tags?: string[];
  attributes?: Map<string, string>;
  aiDescription?: string;
  stockQty: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new mongoose.Schema(
  {
    /* IDENTIFIERS */
    barcode: { type: String, unique: true, sparse: true }, // UPC/EAN
    code: { type: String, required: true, index: true }, // your own SKU

    /* CORE INFO */
    name: { type: String, required: true },
    shortDescription: { type: String, maxlength: 160 }, // tweet-length
    description: { type: String },
    brand: { type: String, index: true },
    category: { type: String, index: true }, // e.g. 'Shampoo'

    /* MERCH DATA */
    price: { type: String },
    volume: { type: String },
    imageUrl: { type: String },

    /* OPTIONAL EXTRAS */
    tags: [String], // 'anti-dandruff', 'vegan', …
    attributes: { type: Map, of: String }, // flexible key-value pairs
    aiDescription: { type: String, required: false },

    /* HOUSE-KEEPING */
    stockQty: { type: Number, default: 0 }, // if you track inventory
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true } // adds createdAt & updatedAt
);

productSchema.virtual("handle").get(function () {
  return this.name
    ?.toLowerCase()
    .replace(/\s+/g, "-") // replace spaces with hyphens
    .replace(/[^a-z0-9\-]/g, ""); // remove non-alphanumeric except hyphen
});

// Optional: ensure virtuals are included in JSON outputs (like toObject or toJSON)
productSchema.set("toObject", { virtuals: true });
productSchema.set("toJSON", { virtuals: true });

/* Full-text index for quick search */
productSchema.index({
  name: "text",
  brand: "text",
  shortDescription: "text",
  description: "text",
});

export default mongoose.model("Product", productSchema);
