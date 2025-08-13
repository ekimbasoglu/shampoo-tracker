import type { Product } from "../models/productModel";
import { z } from "zod";

// ---------- 1. Zod schema for a single row ----------
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

/* ------------------------------------------------------------------ */
/* 1.  IMPORT  (CSV → DB upsert)                                       */
/* ------------------------------------------------------------------ */
export async function importProducts(
  DB: D1Database,
  rows: Partial<Product>[]
): Promise<Product[]> {
  if (!Array.isArray(rows) || rows.length === 0) return [];

  // 1-a. validate & tidy -------------------------------------------
  const numberKeys = new Set<keyof Product>(["stock_qty"]);
  const validated: Partial<Product>[] = [];

  rows.forEach((row, i) => {
    const parsed = productSchema.safeParse(row);
    if (!parsed.success) {
      console.warn(`row ${i + 1} skipped`, parsed.error.flatten().fieldErrors);
      return;
    }

    const clean: Partial<Record<keyof Product, Product[keyof Product]>> = {};

    // fully typed loop
    for (const [key, value] of Object.entries(parsed.data) as [
      keyof Product,
      unknown
    ][]) {
      if (value === "" || value === null || value === undefined) continue;

      if (numberKeys.has(key)) {
        const num = Number(value);
        if (!Number.isNaN(num)) {
          clean[key] = num as Product[typeof key]; // ✅ specific field type
        }
      } else {
        clean[key] = value as Product[typeof key]; // ✅ specific field type
      }
    }

    (clean as Partial<Product>).is_active ??= true; // keep defaulting logic
  });

  // 1-b. dedupe by code (last row wins) -----------------------------
  const docs = Array.from(
    validated
      .reduce<Map<string, Partial<Product>>>(
        (acc, d) => (d.code ? acc.set(d.code, d) : acc),
        new Map()
      )
      .values()
  );

  if (docs.length === 0) return [];

  // 1-c. run all UPSERTs in one batch --------------------------------
  const statements = docs.map((d) =>
    DB.prepare(
      `INSERT INTO products (
        barcode, code, name, short_description, description, brand, category,
        price, volume, image_url, tags, attributes, ai_description,
        stock_qty, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(code) DO UPDATE SET
        barcode=excluded.barcode,
        name=excluded.name,
        short_description=excluded.short_description,
        description=excluded.description,
        brand=excluded.brand,
        category=excluded.category,
        price=excluded.price,
        volume=excluded.volume,
        image_url=excluded.image_url,
        tags=excluded.tags,
        attributes=excluded.attributes,
        ai_description=excluded.ai_description,
        stock_qty=excluded.stock_qty,
        is_active=excluded.is_active,
        updated_at=CURRENT_TIMESTAMP`
    ).bind(
      d.barcode ?? null,
      d.code,
      d.name,
      d.description ?? null,
      d.brand ?? null,
      d.category ?? null,
      d.price ?? null,
      d.volume ?? null,
      d.image_url ?? null,
      d.tags ? JSON.stringify(d.tags) : null,
      d.attributes ? JSON.stringify(d.attributes) : null,
      d.stock_qty ?? 0,
      d.is_active !== false
    )
  );

  await DB.batch(statements);

  // 1-d. fetch & return the freshly upserted products ----------------
  const codes = docs.map((d) => d.code);
  const placeholders = codes.map(() => "?").join(",");
  const { results } = await DB.prepare(
    `SELECT * FROM products WHERE code IN (${placeholders})`
  )
    .bind(...codes)
    .all<Product>();

  return results;
}

/* ------------------------------------------------------------------ */
/* 2.  EXPORT → Shopify CSV                                           */
/* ------------------------------------------------------------------ */
export async function exportForShopify(
  DB: D1Database,
  products: Product[] | string[] = []
): Promise<string> {
  const items = await selectProducts(DB, products);

  const rows = items.map((p) => ({
    Handle: (p.code ?? "").toLowerCase(),
    Title: p.name,
    Body: p.description ?? "",
    Vendor: p.brand ?? "",
    "Variant SKU": p.code,
    "Variant Inventory Qty": p.stock_qty ?? 0,
    "Variant Price": p.price ?? "",
    Tags: (p.tags ?? []).join(", "),
  }));

  return buildCsv(rows);
}

/* ------------------------------------------------------------------ */
/* 3.  EXPORT → Excel-friendly CSV                                    */
/* ------------------------------------------------------------------ */
export async function exportForExcelFormatted(
  DB: D1Database,
  products: Product[] | string[] = []
): Promise<string> {
  const items = await selectProducts(DB, products);

  const header = [
    "",
    "Barcode",
    "CODE",
    "PRODUCT NAME",
    "PRICE",
    "PRODUCT CATEGORY",
    "IMAGE URL",
    "mL",
  ];

  const rows = items.map((p) => [
    "",
    p.barcode ?? "",
    p.code ?? "",
    p.name ?? "",
    p.price ?? "",
    p.category ?? "",
    p.image_url ?? "",
    p.volume ?? "",
  ]);

  return buildCsv([header, ...rows]);
}

/* ------------------------------------------------------------------ */
/* 4.  Helper utilities                                               */
/* ------------------------------------------------------------------ */

async function selectProducts(
  DB: D1Database,
  selector: Product[] | string[]
): Promise<Product[]> {
  if (Array.isArray(selector) && selector.length) {
    // IDs or full objects were passed
    const ids = selector.map((v) => (typeof v === "string" ? v : v.id));
    const placeholders = ids.map(() => "?").join(",");
    const { results } = await DB.prepare(
      `SELECT * FROM products WHERE id IN (${placeholders})`
    )
      .bind(...ids)
      .all<Product>();
    return results;
  }

  // Otherwise dump everything
  const { results } = await DB.prepare(`SELECT * FROM products`).all<Product>();
  return results;
}

function buildCsv(rows: (Record<string, unknown> | unknown[])[]): string {
  const escape = (val: unknown) =>
    typeof val === "string" && /[,"]/.test(val)
      ? `"${val.replace(/"/g, '""')}"`
      : `${val ?? ""}`;

  if (!rows.length) return "";

  // If first entry is an object → treat keys as header order.
  if (!Array.isArray(rows[0])) {
    const objects = rows as Record<string, unknown>[];
    const header = Object.keys(objects[0]);
    const csvLines = [
      header.join(","),
      ...objects.map((o) => header.map((h) => escape(o[h])).join(",")),
    ];
    return csvLines.join("\n");
  }

  // Else rows of arrays (already ordered)
  return (rows as unknown[][]).map((r) => r.map(escape).join(",")).join("\n");
}

export default {
  importProducts,
  exportForShopify,
  exportForExcelFormatted,
};
