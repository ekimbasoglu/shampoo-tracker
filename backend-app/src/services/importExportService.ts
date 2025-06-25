import Product, { IProduct } from "../models/productModel";
import { z } from "zod/v4";
import { format } from "@fast-csv/format";

const productSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  brand: z.string().optional(),
  category: z.string().optional(),
  price: z.string().optional(),
  volume: z.string().optional(),
  imageUrl: z.string().optional(),
  tags: z.array(z.string()).optional(),
  attributes: z.record(z.string(), z.string()).optional(),
  aiDescription: z.string().optional(),
  stockQty: z.number().optional(),
  isActive: z.boolean().optional(),
});

/**
 * Takes the rows produced by csv-middleware and upserts them.
 * – drops completely empty values
 * – coerces numeric fields
 * – removes duplicates (last one wins)
 * – runs bulkWrite unordered so the whole CSV doesn’t abort on one bad row
 */
export const importProducts = async (
  data: Partial<IProduct>[]
): Promise<IProduct[]> => {
  if (!Array.isArray(data) || data.length === 0) return [];

  /* ---------- 1. zod validation ------------------------------------ */
  const validated: Partial<IProduct>[] = [];
  data.forEach((row, i) => {
    const parsed = productSchema.safeParse(row);
    if (parsed.success) {
      // Convert attributes from Record<string, string> to Map<string, string> if present
      const data = { ...parsed.data } as Partial<IProduct>;
      if (data.attributes && !(data.attributes instanceof Map)) {
        data.attributes = new Map(Object.entries(data.attributes));
      }
      validated.push(data);
    } else {
      console.warn(`row ${i + 1} skipped:`, parsed.error.flatten().fieldErrors);
    }
  });

  /* ---------- 2. sanitise + deduplicate by `code` ------------------ */
  const numberKeys = new Set<keyof IProduct>(["price", "stockQty"]);
  const tidy = (doc: Partial<IProduct>): Partial<IProduct> => {
    const clean: Partial<IProduct> = {};
    for (const [k, v] of Object.entries(doc)) {
      if (v === "" || v === null || v === undefined) continue; // drop empties
      if (numberKeys.has(k as keyof IProduct)) {
        const n = Number(v);
        if (!Number.isNaN(n)) (clean as any)[k] = n;
        continue;
      }
      (clean as any)[k] = v;
    }
    clean.isActive ??= true;
    return clean;
  };

  const unique = new Map<string, Partial<IProduct>>();
  for (const row of validated) {
    if (row.code) unique.set(row.code, tidy(row));
  }
  const docs = [...unique.values()];

  /* ---------- 3. bulk upsert (unordered) --------------------------- */
  const bulkOps = docs.map((doc) => ({
    updateOne: {
      filter: { code: doc.code },
      update: { $set: doc, $setOnInsert: { createdAt: new Date() } },
      upsert: true,
    },
  }));

  const result = await Product.bulkWrite(bulkOps, { ordered: false });
  console.log(
    `matched ${result.matchedCount} • inserted ${result.upsertedCount} • errors ${result.hasWriteErrors.length}`
  );

  /* ---------- 4. return the upserted / updated documents ----------- */
  const codes = docs.map((d) => d.code);
  return Product.find({ code: { $in: codes } });
};

/* ------------------------------------------------------------------ */
/* 2. EXPORT → SHOPIFY CSV (simple “Metafield CSV” flavour)           */
/* ------------------------------------------------------------------ */

interface ShopifyRow {
  Handle: string; // -> product.slug or code
  Title: string; // -> product.name
  Body: string; // -> product.description
  Vendor: string; // -> product.brand
  VariantSKU: string; // -> product.code
  VariantInventoryQty: number; // -> product.stockQty
  VariantPrice: string; // -> product.price
  Tags: string; // -> comma list product.tags
}
export const exportForShopify = async (
  products: IProduct[]
): Promise<string> => {
  // If products is empty, fetch all products from the database
  let items: IProduct[];
  if (products && products.length > 0) {
    const ids = products.map((p: any) => (typeof p === "string" ? p : p._id));
    items = await Product.find({ _id: { $in: ids } }).lean();
  } else {
    items = await Product.find({}).lean();
  }

  const rows = items.map((p) => ({
    Handle: (p.code ?? "").toLowerCase(),
    Title: p.name,
    Body: p.description ?? "",
    Vendor: p.brand ?? "",
    "Variant SKU": p.code,
    "Variant Inventory Qty": p.stockQty ?? 0,
    "Variant Price": p.price ?? "",
    Tags: (p.tags ?? []).join(", "),
  }));

  return new Promise<string>((resolve, reject) => {
    let csv = "";
    const stream = format({ headers: true })
      .on("error", reject)
      .on("data", (chunk) => (csv += chunk.toString()))
      .on("end", () => resolve(csv));

    rows.forEach((r) => stream.write(r));
    stream.end();
  });
};

/* ------------------------------------------------------------------ */
/* 3. EXPORT → “Excel friendly” CSV (tab-separated)                   */
/* ------------------------------------------------------------------ */

export const exportForExcelFormatted = async (
  products: IProduct[]
): Promise<string> => {
  // if caller didn’t pass any rows → dump everything
  let items: IProduct[];
  if (products && products.length) {
    const ids = products.map((p) => (typeof p === "string" ? p : p._id));
    items = await Product.find({ _id: { $in: ids } }).lean();
  } else {
    items = await Product.find({}).lean();
  }

  /** column order EXACTLY like her spreadsheet */
  const header = [
    "", // dummy leading column
    "Barcode",
    "CODE",
    "PRODUCT NAME",
    "PRICE",
    "PRODUCT CATEGORY",
    "IMAGE URL",
    "mL",
  ];

  /** turn each product into a row (keep empty strings for blanks) */
  const dataRows = items.map((p) => [
    "", // dummy leading column
    p.barcode ?? "",
    p.code ?? "",
    p.name ?? "",
    p.price ?? "",
    p.category ?? "",
    p.imageUrl ?? "",
    p.volume ?? "",
  ]);

  /* ----- build a CSV string --------------------------------------- */
  // Excel opens comma-separated just fine for most locales; if your
  // Excel expects semicolons, change `","` below to `";"`.
  const escape = (val: unknown) =>
    typeof val === "string" && val.includes(",")
      ? `"${val.replace(/"/g, '""')}"`
      : `${val}`;

  const lines = [
    header.map(escape).join(","), // header row
    ...dataRows.map((r) => r.map(escape).join(",")),
  ];

  return lines.join("\n"); // ready to send as text/csv
};

export default {
  importProducts,
  exportForShopify,
  exportForExcelFormatted,
};
