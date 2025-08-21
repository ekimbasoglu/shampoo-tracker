export interface Product {
  id?: number;
  barcode?: string;
  code: string;
  name: string;
  description?: string;
  brand?: string;
  category?: string;
  price?: string;
  volume: string;
  image_url?: string;
  tags?: string[]; // stored as JSON in D1
  attributes?: Record<string, string>; // stored as JSON
  stock_qty: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}
