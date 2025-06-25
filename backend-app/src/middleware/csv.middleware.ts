// src/middleware/csv.middleware.ts
import { Readable } from "stream";
import { HeaderArray, parse } from "@fast-csv/parse";
import multer from "multer";
import { RequestHandler } from "express";
import { IProduct } from "../models/productModel";

/* 1️⃣  map raw CSV headers  →  IProduct keys (or false to ignore) */
const alias: Record<string, keyof IProduct | false> = {
  // first empty column in your sample:
  "": false,
  barcode: false, // you said you don’t store it
  sku: "code",
  code: "code",
  "product name": "name",
  brand: "brand",
  "product category": "category",
  price: "price",
  ml: "volume",
  "short description": "shortDescription",
  description: "description",
  "image url": "imageUrl",
  tags: "tags",
  stock: "stockQty",
};

/* 2️⃣  multer – keep as-is */
export const csvUpload = multer({ storage: multer.memoryStorage() }).single(
  "file"
);

/* 3️⃣  middleware */
export const csvToProducts: RequestHandler = async (req, res, next) => {
  if (!req.file) return next(); // let controller 400 if neither JSON nor file

  try {
    const products: Partial<IProduct>[] = [];

    await new Promise<void>((resolve, reject) => {
      Readable.from(req.file!.buffer)
        .pipe(
          parse({
            /** 1️⃣ keep original headers but transform/skip in one go */
            headers: (cols: HeaderArray): HeaderArray =>
              cols.map((h) => {
                const key = alias[h!.trim().toLowerCase()];
                return key === false // explicit “drop this column”
                  ? undefined // <- fast-csv will ignore it
                  : (key as string) || h; // rename or keep as-is
              }),
            renameHeaders: true,
            trim: true,
            ignoreEmpty: true,
          })
        )
        .on("error", reject)
        .on("data", (row) => products.push(row))
        .on("end", () => resolve());
    });

    req.body.products = products;
    next();
  } catch (err) {
    res.status(400).json({ message: "Bad CSV format", error: String(err) });
  }
};
