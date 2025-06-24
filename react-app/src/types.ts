export interface Product {
  _id: string;
  barcode: string;
  code: string;
  name: string;
  shortDescription?: string;
  description?: string;
  brand?: string;
  category?: string;
  price?: string;
  volume?: string;
  imageUrl?: string;
  tags?: string[];
  attributes?: Record<string, string>;
  aiDescription?: {
    content?: string;
    model?: string;
    generatedAt?: Date;
  };
  stockQty: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
