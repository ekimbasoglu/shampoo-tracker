import { MiddlewareHandler } from "hono";
import { parse } from "csv-parse/sync";
import { Product } from "../models/productModel";

// map raw CSV headers to IProduct fields (or false to drop)
const alias: Record<string, keyof Product | false> = {
  "": false,
  barcode: false,
  sku: "code",
  code: "code",
  "product name": "name",
  brand: "brand",
  "product category": "category",
  price: "price",
  ml: "volume",
  description: "description",
  tags: "tags",
  stock_qty: "stock_qty",
};

export const csvToProducts: MiddlewareHandler = async (c, next) => {
  const file = c.get("csvFile") as File | undefined;
  if (!file) return await next(); // let controller validate

  try {
    const text = await file.text();

    const records = parse(text, {
      columns: (headers) =>
        headers.map((header: string) => {
          const key = alias[header.trim().toLowerCase()];
          return key === false ? undefined : key || header;
        }),
      skip_empty_lines: true,
      trim: true,
    });

    c.set("products", records);
    await next();
  } catch (err) {
    return c.json({ message: "Bad CSV format", error: String(err) }, 400);
  }
};
