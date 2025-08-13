-- USERS ------------------------------------------------
INSERT INTO users (email, username, password)
VALUES
  ('ekim@example.com', 'ekim', '$2a$10$HASHEDPW1'),   -- bcrypt-hashed
  ('hrsti@example.com',   'hrsti',   '$2a$10$HASHEDPW2');

-- PRODUCTS ---------------------------------------------
INSERT INTO products
  (code, name, brand, category, price, volume, stock_qty)
VALUES
  ('SKU-1001', 'Demo Shampoo', 'Brand-A', 'Hair',  '9.99',  '250 mL', 50),
  ('SKU-1002', 'Demo Conditioner', 'Brand-B', 'Hair', '11.50', '250 mL', 30);
