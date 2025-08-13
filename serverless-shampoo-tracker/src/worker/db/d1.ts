import type { Product } from "../models/productModel";
import type { User } from "../models/userModel";

export async function createUser(DB: D1Database, user: User) {
  const stmt = DB.prepare(`
    INSERT INTO users (email, password, username)
    VALUES (?, ?, ?)
  `);
  return await stmt.bind(user.email, user.password, user.username).run();
}

export async function createProduct(DB: D1Database, product: Product) {
  const stmt = DB.prepare(`
    INSERT INTO products
    (barcode, code, name, short_description, description, brand, category, price, volume, image_url, tags, attributes, ai_description, stock_qty, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  return await stmt.bind(
    product.barcode ?? null,
    product.code,
    product.name,
    product.short_description ?? null,
    product.description ?? null,
    product.brand ?? null,
    product.category ?? null,
    product.price ?? null,
    product.volume,
    product.image_url ?? null,
    product.tags ? JSON.stringify(product.tags) : null,
    product.attributes ? JSON.stringify(product.attributes) : null,
    product.ai_description ?? null,
    product.stock_qty,
    product.is_active
  ).run();
}

