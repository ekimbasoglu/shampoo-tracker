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
  let items = products;
  if (!items || items.length === 0) {
    items = await Product.find({}).lean();
  }

  const rows: ShopifyRow[] = items.map((p) => ({
    Handle: (p.code ?? "").toLowerCase(),
    Title: p.name,
    Body: p.description ?? "",
    Vendor: p.brand ?? "",
    VariantSKU: p.code,
    VariantInventoryQty: p.stockQty ?? 0,
    VariantPrice: p.price ?? "",
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

// Same idea, but tab-separated so Excel opens it without a locale prompt
export const exportForExcelFormatted = async (
  products: IProduct[]
): Promise<string> => {
  // If products is empty, fetch all products from the database
  let items = products;
  if (!items || items.length === 0) {
    items = await Product.find({}).lean();
  }

  const cols = [
    "code",
    "name",
    "brand",
    "category",
    "price",
    "volume",
    "stockQty",
    "isActive",
  ] as const;

  const header = cols.join("\t");
  const body = items
    .map((p) => cols.map((c) => p[c] ?? "").join("\t"))
    .join("\n");

  return `${header}\n${body}`;
};

export default {
  importProducts,
  exportForShopify,
  exportForExcelFormatted,
};
