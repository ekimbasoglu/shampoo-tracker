-- Migration number: 0001 	 2025-08-08T11:57:31.844Z
-- USERS
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PRODUCTS
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  barcode TEXT UNIQUE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  brand TEXT,
  category TEXT,
  price TEXT,
  volume TEXT,
  image_url TEXT,
  tags TEXT, -- JSON encoded array
  attributes TEXT, -- JSON encoded key-value map
  stock_qty INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
