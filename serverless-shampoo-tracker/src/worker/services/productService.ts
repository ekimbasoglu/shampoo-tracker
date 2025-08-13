import { Product } from "../models/productModel";

export const createProduct = async (
  DB: D1Database,
  data: Partial<Product>
): Promise<Product> => {
  const {
    barcode,
    code,
    name,
    description,
    brand,
    category,
    price,
    volume,
    image_url,
    tags,
    attributes,
    stock_qty,
  } = data;

  const result = await DB.prepare(
    `INSERT INTO products (
      barcode, code, name, short_description, description, brand, category,
      price, volume, image_url, tags, attributes, ai_description, stock_qty, is_active
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      barcode ?? null,
      code ?? "",
      name ?? "",
      description ?? null,
      brand ?? null,
      category ?? null,
      price ?? null,
      volume ?? "",
      image_url ?? null,
      tags ? JSON.stringify(tags) : null,
      attributes ? JSON.stringify(attributes) : null,
      stock_qty ?? 0
    )
    .run();
  const lastRowId = result.meta?.last_row_id;

  return {
    id: lastRowId!,
    barcode,
    code: code ?? "",
    name: name ?? "",
    description,
    brand,
    category,
    price,
    volume: volume ?? "",
    image_url,
    tags: tags ?? [],
    attributes: attributes ?? {},
    stock_qty: stock_qty ?? 0,
    is_active: true,
  };
};

export const getProductByBarcodeOrCode = async (
  DB: D1Database,
  barcode: string,
  code: string
): Promise<Product | null> => {
  const result = await DB.prepare(
    `SELECT * FROM products WHERE barcode = ? OR code = ?`
  )
    .bind(barcode, code)
    .first<Product>();

  return result ?? null;
};

export const getAllProducts = async (DB: D1Database): Promise<Product[]> => {
  const result = await DB.prepare(`SELECT * FROM products`).all<Product>();
  return result.results;
};

export const getProductById = async (
  DB: D1Database,
  id: string
): Promise<Product | null> => {
  const result = await DB.prepare(`SELECT * FROM products WHERE id = ?`)
    .bind(id)
    .first<Product>();

  return result ?? null;
};

export const updateProductById = async (
  DB: D1Database,
  id: string,
  data: Partial<Product>
): Promise<Product | null> => {
  const product = await getProductById(DB, id);
  if (!product) return null;

  const updated = { ...product, ...data };

  await DB.prepare(
    `UPDATE products SET
      barcode = ?, code = ?, name = ?, short_description = ?, description = ?, brand = ?, category = ?,
      price = ?, volume = ?, image_url = ?, tags = ?, attributes = ?, ai_description = ?, stock_qty = ?, is_active = ?
     WHERE id = ?`
  )
    .bind(
      updated.barcode ?? null,
      updated.code,
      updated.name,
      updated.description ?? null,
      updated.brand ?? null,
      updated.category ?? null,
      updated.price ?? null,
      updated.volume,
      updated.image_url ?? null,
      updated.tags ? JSON.stringify(updated.tags) : null,
      updated.attributes ? JSON.stringify(updated.attributes) : null,
      updated.stock_qty ?? 0,
      updated.is_active !== false,
      id
    )
    .run();

  return { ...updated, id: Number(id) };
};

export const deleteProductById = async (
  DB: D1Database,
  id: string
): Promise<boolean> => {
  const result = await DB.prepare(`DELETE FROM products WHERE id = ?`)
    .bind(id)
    .run();
  return result.success;
};

export const deleteAllProducts = async (DB: D1Database): Promise<boolean> => {
  const result = await DB.prepare(`DELETE FROM products`).run();
  return result.success;
};

export default {
  createProduct,
  getProductByBarcodeOrCode,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById,
  deleteAllProducts,
};
