"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Upload,
  Download,
  LogOut,
  Package,
  Droplets,
  Tag,
  DollarSign,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  ShoppingCart,
  Sparkles,
  FileText,
} from "lucide-react";
import { Image } from "@unpic/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/***************************
 *  Product interface (same shape as back‑end)
 ***************************/
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

/***************************
 *  Dashboard component
 ***************************/
const ProductDashboard: React.FC = () => {
  /* STATE */
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<
    "create" | "update" | "view" | "delete" | "import-export"
  >("create");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
    new Set()
  );
  const [selectAll, setSelectAll] = useState(false);

  /************* fetch *************/
  const fetchProducts = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URI}/api/products`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.status === 401) {
        handleLogout();
        return;
      }

      const raw = await res.json();
      const list: Product[] = Array.isArray(raw) ? raw : raw.products ?? [];
      setProducts(list);
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /************* Auth *************/
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  /************* CRUD helpers *************/
  const handleDelete = async (p: Product) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URI}/api/products/${p._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.ok) {
        fetchProducts();
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error("Error deleting product", err);
    }
  };

  /* UI helpers */
  function openModal(type: any, p?: Product) {
    if (p) {
      setSelectedProduct(p);
      // use layout effect or nextTick to ensure state is ready
      setTimeout(() => {
        setModalType(type);
        setIsModalOpen(true);
      });
    } else {
      setModalType(type);
      setIsModalOpen(true);
    }
  }

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Selection handlers
  const handleSelectProduct = (productId: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
    setSelectAll(newSelected.size === filteredProducts.length);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedProducts(new Set());
      setSelectAll(false);
    } else {
      setSelectedProducts(new Set(filteredProducts.map((p) => p._id)));
      setSelectAll(true);
    }
  };

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean))
  );

  // Calculate stats
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.isActive).length;
  const lowStockProducts = products.filter((p) => p.stockQty < 10).length;
  const totalValue = products.reduce(
    (sum, p) => sum + (p.price ? parseInt(p.price, 10) : 0) * p.stockQty,
    0
  );

  /*************************** render ***************************/
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      {/* HEADER */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Droplets className="h-8 w-8 text-blue-600" />
              Beauty Product Tracker
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your shampoo and beauty product inventory
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => openModal("create")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Product
            </Button>
            <Button
              onClick={() => openModal("import-export")}
              variant="outline"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import/Export
            </Button>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Products
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Products
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {activeProducts}
              </div>
            </CardContent>
          </Card>
          <Card className="opacity-50 pointer-events-none relative">
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <span className="text-gray-400 text-lg font-semibold line-through"></span>
            </div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 ">
                Stock Info
                <span className="ml-2 text-orange-600 font-bold"></span>
              </CardTitle>
              <Tag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600 line-through"></div>
            </CardContent>
          </Card>
          <Card className="opacity-50 pointer-events-none relative">
            <div className="absolute inset-0 flex items-center justify-center z-10">
              {/* <span className="text-gray-400 text-lg font-semibold line-through">
                No Info
              </span> */}
            </div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {/* <div className="text-2xl font-bold line-through">
                €{totalValue.toFixed(2)}
              </div> */}
            </CardContent>
          </Card>
        </div>

        {/* FILTERS */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search products, brands, categories, or SKU..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category!}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* PRODUCTS TABLE */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Products ({filteredProducts.length})</span>
            {selectedProducts.size > 0 && (
              <Badge variant="secondary">
                {selectedProducts.size} selected
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Manage your beauty product inventory with detailed information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectAll}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="w-20">Image</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Volume</TableHead>
                  <TableHead className="w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product._id} className="hover:bg-muted/50">
                    <TableCell>
                      <Checkbox
                        checked={selectedProducts.has(product._id)}
                        onCheckedChange={() => handleSelectProduct(product._id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={
                            product.imageUrl ||
                            "/placeholder.svg?height=64&width=64"
                          }
                          alt={product.name}
                          width={64}
                          height={64}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-mono font-medium">
                        {product.code || product.barcode || "—"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-sm">
                          {product.name}
                        </div>
                        {product.shortDescription && (
                          <div className="text-xs text-muted-foreground line-clamp-2">
                            {product.shortDescription}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{product.brand || "—"}</div>
                    </TableCell>
                    <TableCell>
                      {product.category ? (
                        <Badge variant="secondary" className="text-xs">
                          {product.category}
                        </Badge>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">
                        {product.price
                          ? `€${parseInt(product.price, 10)}`
                          : "—"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {product.volume ? `${product.volume}` : "—"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => openModal("view", product)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openModal("update", product)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem disabled>
                            <div className="flex items-center justify-between w-full">
                              <span className="text-xs">Status:</span>
                              <Badge
                                variant={
                                  product.isActive ? "default" : "secondary"
                                }
                                className="text-xs ml-2"
                              >
                                {product.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openModal("delete", product)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* UNIFIED MODAL */}
      {isModalOpen && (
        <UnifiedProductModal
          modalType={modalType}
          product={selectedProduct}
          selectedProducts={selectedProducts}
          onClose={closeModal}
          onDeleted={handleDelete}
          refresh={fetchProducts}
          openModal={openModal}
        />
      )}
    </div>
  );
};

/***************************
 *  Unified Modal Component
 ***************************/
interface UnifiedModalProps {
  modalType: "create" | "update" | "view" | "delete" | "import-export";
  product: Product | null;
  selectedProducts: Set<string>;
  onClose: () => void;
  onDeleted: (p: Product) => void;
  refresh: () => void;
  openModal: (
    type: "create" | "update" | "view" | "delete" | "import-export",
    product?: Product
  ) => void;
}

const UnifiedProductModal: React.FC<UnifiedModalProps> = ({
  modalType,
  product,
  selectedProducts,
  onClose,
  onDeleted,
  refresh,
  openModal,
}) => {
  const [formData, setFormData] = useState<Product>(
    product ?? {
      _id: "temp",
      barcode: "",
      code: "",
      name: "",
      shortDescription: "",
      description: "",
      brand: "",
      category: "",
      price: "0",
      volume: "0mL",
      imageUrl: "",
      tags: [],
      attributes: {},
      stockQty: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  );

  const [isGenerating, setIsGenerating] = useState(false);

  // Update formData when product changes
  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const handleInput = (key: keyof Product, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handlePriceChange = (amount: number) => {
    setFormData((prev) => ({
      ...prev,
      price: `${amount} ${prev.price?.split(" ")[1] || "EUR"}`,
    }));
  };

  const handleVolumeChange = (value: number) => {
    setFormData((prev) => ({
      ...prev,
      volume: `${value}${prev.volume?.split(/(\d+)/)[2] || "mL"}`,
    }));
  };

  const generateDescription = async (type: "short" | "full") => {
    if (!formData.name) {
      alert("Please enter a product name first");
      return;
    }

    setIsGenerating(true);
    try {
      // Simulate AI generation - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const generated =
        type === "short"
          ? `Premium ${formData.name} for all hair types. Gentle formula with natural ingredients.`
          : `Experience the luxury of ${formData.name}, specially formulated for modern hair care needs. This premium product combines advanced technology with natural ingredients to deliver exceptional results. Suitable for all hair types, it provides deep nourishment while maintaining the natural balance of your hair. Perfect for daily use, this product will transform your hair care routine and leave your hair looking healthy, shiny, and beautiful.`;

      if (type === "short") {
        handleInput("shortDescription", generated);
      } else {
        handleInput("description", generated);
      }
    } catch (error) {
      console.error("Error generating description:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const saveProduct = async () => {
    const url = `${import.meta.env.VITE_APP_BACKEND_URI}/api/products${
      modalType === "update" && product ? `/${product._id}` : ""
    }`;
    const method = modalType === "create" ? "POST" : "PUT";
    console.log(formData);
    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        refresh();
        onClose();
      }
    } catch (err) {
      console.error("Error saving product", err);
    }
  };

  const confirmDelete = () => {
    if (product) onDeleted(product);
  };

  // Import/Export Modal
  if (modalType === "import-export") {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Import / Export Products</DialogTitle>
            <DialogDescription>
              Choose to import new products or export existing ones
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-20 flex-col">
                <Upload className="h-6 w-6 mb-2" />
                Import CSV
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Download className="h-6 w-6 mb-2" />
                Export CSV
              </Button>
            </div>
            <div className="space-y-2">
              <Label>Export Options:</Label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Export All (
                  {selectedProducts.size > 0 ? "All Products" : "All Products"})
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  disabled={selectedProducts.size === 0}
                >
                  Export Selected ({selectedProducts.size})
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Delete Modal
  if (modalType === "delete" && product) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{product.name}"? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Unified Product Modal (Create/Update/View)
  const isReadOnly = modalType === "view";
  const title =
    modalType === "create"
      ? "Create New Product"
      : modalType === "update"
      ? "Update Product"
      : "Product Details";

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-[900px] max-h-[90vh] overflow-y-auto sm:max-w-6xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-blue-600" />
            {title}
          </DialogTitle>
          <DialogDescription>
            {modalType === "create"
              ? "Add a new beauty product to your inventory"
              : modalType === "update"
              ? "Update the product information"
              : "View detailed product information"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Image Preview */}
          {formData.imageUrl && (
            <div className="flex justify-center">
              <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={formData.imageUrl || "/placeholder.svg"}
                  alt={formData.name || "Product"}
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="name">Product Name *</Label>
                {isReadOnly ? (
                  <p className="text-sm mt-1">{formData.name || "—"}</p>
                ) : (
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInput("name", e.target.value)}
                    placeholder="e.g., Moisturizing Shampoo"
                  />
                )}
              </div>
              <div>
                <Label htmlFor="brand">Brand</Label>
                {isReadOnly ? (
                  <p className="text-sm mt-1">{formData.brand || "—"}</p>
                ) : (
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => handleInput("brand", e.target.value)}
                    placeholder="e.g., L'Oréal"
                  />
                )}
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                {isReadOnly ? (
                  <p className="text-sm mt-1">{formData.category || "—"}</p>
                ) : (
                  <div className="flex gap-2">
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleInput("category", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Shampoo">Shampoo</SelectItem>
                        <SelectItem value="Conditioner">Conditioner</SelectItem>
                        <SelectItem value="Hair Mask">Hair Mask</SelectItem>
                        <SelectItem value="Hair Oil">Hair Oil</SelectItem>
                        <SelectItem value="Styling">Styling</SelectItem>
                        <SelectItem value="Treatment">Treatment</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      type="text"
                      placeholder="Add category here"
                      value={
                        formData.category &&
                        ![
                          "Shampoo",
                          "Conditioner",
                          "Hair Mask",
                          "Hair Oil",
                          "Styling",
                          "Treatment",
                        ].includes(formData.category)
                          ? formData.category
                          : ""
                      }
                      onChange={(e) => handleInput("category", e.target.value)}
                      className="w-40"
                    />
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="price">Price (€)</Label>
                {isReadOnly ? (
                  <p className="text-sm mt-1">
                    {formData.price && !isNaN(Number(formData.price))
                      ? `€${Number(formData.price).toFixed(2)}`
                      : formData.price && /^\d+(\.\d+)?/.test(formData.price)
                      ? `€${parseFloat(formData.price).toFixed(2)}`
                      : "—"}
                  </p>
                ) : (
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={
                      formData.price && /^\d+(\.\d+)?/.test(formData.price)
                        ? parseFloat(formData.price)
                        : 0
                    }
                    onChange={(e) =>
                      handlePriceChange(Number.parseFloat(e.target.value) || 0)
                    }
                    placeholder="0.00"
                  />
                )}
              </div>
              <div>
                <Label htmlFor="volume">Volume (mL)</Label>
                {isReadOnly ? (
                  <p className="text-sm mt-1">{formData.volume || "—"}</p>
                ) : (
                  <div className="flex items-center gap-2">
                    <Input
                      id="volume"
                      type="number"
                      value={parseInt(formData.volume || "0", 10)}
                      onChange={(e) =>
                        handleVolumeChange(Number.parseInt(e.target.value) || 0)
                      }
                      placeholder="250"
                      min={0}
                    />
                    <span className="text-sm text-muted-foreground">mL</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Product Details
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="shortDescription">Short Description</Label>
                  {!isReadOnly && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => generateDescription("short")}
                      disabled={isGenerating}
                    >
                      <Sparkles className="h-4 w-4 mr-1" />
                      {isGenerating ? "Generating..." : "Generate"}
                    </Button>
                  )}
                </div>
                {isReadOnly ? (
                  <p className="text-sm">
                    {formData.shortDescription || "No description available"}
                  </p>
                ) : (
                  <Textarea
                    id="shortDescription"
                    value={formData.shortDescription}
                    onChange={(e) =>
                      handleInput("shortDescription", e.target.value)
                    }
                    placeholder="Brief product description..."
                    rows={2}
                  />
                )}
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="description">Full Description</Label>
                  {!isReadOnly && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => generateDescription("full")}
                      disabled={isGenerating}
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      {isGenerating ? "Generating..." : "Generate"}
                    </Button>
                  )}
                </div>
                {isReadOnly ? (
                  <p className="text-sm">
                    {formData.description ||
                      "No detailed description available"}
                  </p>
                ) : (
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInput("description", e.target.value)}
                    placeholder="Detailed product description, ingredients, benefits..."
                    rows={4}
                  />
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="barcode">Barcode</Label>
                  {isReadOnly ? (
                    <p className="text-sm mt-1 font-mono">
                      {formData.barcode || "—"}
                    </p>
                  ) : (
                    <Input
                      id="barcode"
                      value={formData.barcode}
                      onChange={(e) => handleInput("barcode", e.target.value)}
                      placeholder="1234567890123"
                    />
                  )}
                </div>
                <div>
                  <Label htmlFor="code">SKU/Code</Label>
                  {isReadOnly ? (
                    <p className="text-sm mt-1 font-mono">
                      {formData.code || "—"}
                    </p>
                  ) : (
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => handleInput("code", e.target.value)}
                      placeholder="SHP-001"
                    />
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                {isReadOnly ? (
                  <p className="text-sm mt-1 break-all">
                    {formData.imageUrl || "—"}
                  </p>
                ) : (
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => handleInput("imageUrl", e.target.value)}
                    placeholder="https://example.com/product-image.jpg"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Inventory & Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Inventory & Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="opacity-50 pointer-events-none select-none">
                <Label htmlFor="stockQty" className="line-through">
                  Stock Quantity
                </Label>
                {isReadOnly ? (
                  <p
                    className={`text-sm mt-1 font-medium line-through text-gray-400`}
                  >
                    {formData.stockQty} units
                  </p>
                ) : (
                  <Input
                    id="stockQty"
                    type="number"
                    value={formData.stockQty}
                    onChange={(e) =>
                      handleInput(
                        "stockQty",
                        Number.parseInt(e.target.value) || 0
                      )
                    }
                    placeholder="0"
                    disabled
                    className="line-through"
                  />
                )}
              </div>
              <div>
                <Label>Status</Label>
                {isReadOnly ? (
                  <div className="mt-1">
                    <Badge
                      variant={formData.isActive ? "default" : "secondary"}
                    >
                      {formData.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) =>
                        handleInput("isActive", checked)
                      }
                    />
                    <Label htmlFor="isActive">Product is active</Label>
                  </div>
                )}
              </div>
            </div>
            {isReadOnly && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div>
                  <Label className="text-sm font-medium">Created</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(formData.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Updated</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(formData.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            {isReadOnly ? "Close" : "Cancel"}
          </Button>
          {!isReadOnly && (
            <Button
              onClick={saveProduct}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {modalType === "create" ? "Create Product" : "Update Product"}
            </Button>
          )}
          {isReadOnly && (
            <Button
              onClick={() => {
                onClose();
                if (product) {
                  setTimeout(() => openModal("update", product), 100);
                }
              }}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Product
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDashboard;
