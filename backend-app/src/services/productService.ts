import Product, { IProduct } from "../models/productModel";

const createProduct = async (data: Partial<IProduct>): Promise<IProduct> => {
  const {
    barcode,
    code,
    name,
    shortDescription,
    description,
    brand,
    category,
    price,
    volume,
    imageUrl,
    tags,
    attributes,
    aiDescription,
    stockQty,
    isActive,
  } = data;

  const product = new Product({
    barcode,
    code,
    name,
    shortDescription,
    description,
    brand,
    category,
    price,
    volume,
    imageUrl,
    tags: tags || [],
    attributes: attributes || {},
    aiDescription: aiDescription || "",
    stockQty: stockQty || 0,
    isActive: isActive !== undefined ? isActive : true,
  });

  const savedProduct = await product.save();
  return savedProduct.toObject() as IProduct;
};

const getProductByBarcodeOrCode = async (
  barcode: string,
  code: string
): Promise<IProduct | null> => {
  return await Product.findOne({
    $or: [{ barcode }, { code }],
  });
};

const getAllProducts = async (): Promise<IProduct[]> => {
  return await Product.find();
};

const getProductById = async (id: string): Promise<IProduct | null> => {
  return await Product.findById(id);
};

const updateProductById = async (
  id: string,
  data: Partial<IProduct>
): Promise<IProduct | null> => {
  return await Product.findByIdAndUpdate(id, data, { new: true });
};

const deleteProductById = async (id: string): Promise<boolean> => {
  const result = await Product.findByIdAndDelete(id);
  return result !== null;
};

const deleteAllProducts = async (): Promise<boolean> => {
  const result = await Product.deleteMany({});
  return result.deletedCount > 0;
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
