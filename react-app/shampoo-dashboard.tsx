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
} from "lucide-react";
import Image from "next/image";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  price?: {
    amount: number;
    currency: string;
  };
  volume?: {
    value: number;
    unit: string;
  };
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
    "create" | "update" | "delete" | "import-export" | "view"
  >("create");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

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
  const openCreateModal = () => {
    setSelectedProduct(null);
    setModalType("create");
    setIsModalOpen(true);
  };

  const openUpdateModal = (p: Product) => {
    setSelectedProduct(p);
    setModalType("update");
    setIsModalOpen(true);
  };

  const openViewModal = (p: Product) => {
    setSelectedProduct(p);
    setModalType("view");
    setIsModalOpen(true);
  };

  const openDeleteModal = (p: Product) => {
    setSelectedProduct(p);
    setModalType("delete");
    setIsModalOpen(true);
  };

  const openImportExportModal = () => {
    setSelectedProduct(null);
    setModalType("import-export");
    setIsModalOpen(true);
  };

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase());
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
    (sum, p) => sum + (p.price?.amount || 0) * p.stockQty,
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
              onClick={openCreateModal}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Product
            </Button>
            <Button onClick={openImportExportModal} variant="outline">
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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              <Tag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {lowStockProducts}
              </div>
            </CardContent>
          </Card>
          {/* <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{totalValue.toFixed(2)}</div>
            </CardContent>
          </Card> */}
        </div>

        {/* FILTERS */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search products, brands, or categories..."
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
          <CardTitle>Products ({filteredProducts.length})</CardTitle>
          <CardDescription>
            Manage your beauty product inventory with detailed information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Image</TableHead>
                  <TableHead>Product Details</TableHead>
                  <TableHead>Brand & Category</TableHead>
                  <TableHead>Price & Volume</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product._id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={
                            product.imageUrl ||
                            "/placeholder.svg?height=64&width=64"
                          }
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
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
                        <div className="text-xs text-muted-foreground">
                          SKU: {product.code || product.barcode}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-sm">
                          {product.brand || "—"}
                        </div>
                        {product.category && (
                          <Badge variant="secondary" className="text-xs">
                            {product.category}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-sm">
                          {product.price?.amount
                            ? `€${product.price.amount.toFixed(2)}`
                            : "—"}
                        </div>
                        {product.volume && (
                          <div className="text-xs text-muted-foreground">
                            {product.volume.value}
                            {product.volume.unit}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div
                          className={`font-medium text-sm ${
                            product.stockQty < 10
                              ? "text-orange-600"
                              : product.stockQty === 0
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {product.stockQty} units
                        </div>
                        {product.stockQty < 10 && product.stockQty > 0 && (
                          <Badge
                            variant="outline"
                            className="text-xs text-orange-600"
                          >
                            Low Stock
                          </Badge>
                        )}
                        {product.stockQty === 0 && (
                          <Badge variant="destructive" className="text-xs">
                            Out of Stock
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={product.isActive ? "default" : "secondary"}
                      >
                        {product.isActive ? "Active" : "Inactive"}
                      </Badge>
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
                            onClick={() => openViewModal(product)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openUpdateModal(product)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openDeleteModal(product)}
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

      {/* MODAL */}
      {isModalOpen && (
        <ProductModal
          modalType={modalType}
          product={selectedProduct}
          onClose={() => setIsModalOpen(false)}
          onDeleted={handleDelete}
          refresh={fetchProducts}
        />
      )}
    </div>
  );
};

/***************************
 *  Modal
 ***************************/
interface ModalProps {
  modalType: "create" | "update" | "delete" | "import-export" | "view";
  product: Product | null;
  onClose: () => void;
  onDeleted: (p: Product) => void;
  refresh: () => void;
}

const ProductModal: React.FC<ModalProps> = ({
  modalType,
  product,
  onClose,
  onDeleted,
  refresh,
}) => {
  /* build default formData */
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
      price: { amount: 0, currency: "EUR" },
      volume: { value: 0, unit: "mL" },
      imageUrl: "",
      tags: [],
      attributes: {},
      stockQty: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  );
  if (modalType === "view") {
    if (!product) return null; // wait for data
    return;
  }

  /* ----- handlers ----- */
  const handleInput = (key: keyof Product, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const saveProduct = async () => {
    const url = `${import.meta.env.VITE_APP_BACKEND_URI}/api/products${
      modalType === "update" && product ? `/${product._id}` : ""
    }`;
    const method = modalType === "create" ? "POST" : "PUT";

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

  /* delete inside modal */
  const confirmDelete = () => {
    if (product) onDeleted(product);
  };

  /* View modal */
  if (modalType === "view" && product) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-blue-600" />
              {product.name}
            </DialogTitle>
            <DialogDescription>
              Product details and specifications
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Product Image */}
            {product.imageUrl && (
              <div className="flex justify-center">
                <div className="relative w-48 h-48 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={product.imageUrl || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="inventory">Inventory</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Brand</Label>
                    <p className="text-sm text-muted-foreground">
                      {product.brand || "—"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Category</Label>
                    <p className="text-sm text-muted-foreground">
                      {product.category || "—"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Price</Label>
                    <p className="text-sm text-muted-foreground">
                      {product.price?.amount ? `€${product.price.amount}` : "—"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Volume</Label>
                    <p className="text-sm text-muted-foreground">
                      {product.volume
                        ? `${product.volume.value}${product.volume.unit}`
                        : "—"}
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">
                    Short Description
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {product.shortDescription || "No description available"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">
                    Full Description
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {product.description || "No detailed description available"}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Barcode</Label>
                    <p className="text-sm text-muted-foreground">
                      {product.barcode || "—"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">SKU/Code</Label>
                    <p className="text-sm text-muted-foreground">
                      {product.code || "—"}
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="inventory" className="space-y-4">
                <fieldset
                  className="grid grid-cols-2 gap-4 border border-gray-200 rounded-md p-4 bg-gray-50 opacity-70"
                  disabled
                  aria-disabled="true"
                  style={{ pointerEvents: "none" }}
                >
                  <div>
                    <Label className="text-sm font-medium">
                      Stock Quantity
                    </Label>
                    <p
                      className={`text-sm font-medium ${
                        product.stockQty < 10
                          ? "text-orange-600"
                          : product.stockQty === 0
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {product.stockQty} units
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <Badge
                      variant={product.isActive ? "default" : "secondary"}
                      className="mt-1"
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Created</Label>
                    <p className="text-sm text-muted-foreground">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Updated</Label>
                    <p className="text-sm text-muted-foreground">
                      {new Date(product.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </fieldset>
              </TabsContent>
            </Tabs>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button
              onClick={() => {
                onClose();
                // Trigger edit modal
                setTimeout(() => {
                  const editEvent = new CustomEvent("openEditModal", {
                    detail: product,
                  });
                  window.dispatchEvent(editEvent);
                }, 100);
              }}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  /* import / export modal */
  if (modalType === "import-export") {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import / Export Products</DialogTitle>
            <DialogDescription>
              Import products from CSV or export your current inventory
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
            <p className="text-sm text-muted-foreground">
              Import/Export functionality will be implemented soon. This will
              allow you to bulk manage your product inventory.
            </p>
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

  /* delete modal */
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

  /* create / update form */
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {modalType === "create" ? "Create New Product" : "Update Product"}
          </DialogTitle>
          <DialogDescription>
            {modalType === "create"
              ? "Add a new beauty product to your inventory"
              : "Update the product information"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInput("name", e.target.value)}
                  placeholder="e.g., Moisturizing Shampoo"
                />
              </div>
              <div>
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => handleInput("brand", e.target.value)}
                  placeholder="e.g., L'Oréal"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
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
              </div>
              <div>
                <Label htmlFor="price">Price (€)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price?.amount ?? 0}
                  onChange={(e) =>
                    handleInput("price", {
                      ...formData.price,
                      amount: Number.parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="volume">Volume (mL)</Label>
                <Input
                  id="volume"
                  type="number"
                  value={formData.volume?.value ?? 0}
                  onChange={(e) =>
                    handleInput("volume", {
                      ...formData.volume,
                      value: Number.parseFloat(e.target.value) || 0,
                      unit: "mL",
                    })
                  }
                  placeholder="250"
                />
              </div>
            </div>
          </div>

          {/* Product Details Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Product Details
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="shortDescription">Short Description</Label>
                <Textarea
                  id="shortDescription"
                  value={formData.shortDescription}
                  onChange={(e) =>
                    handleInput("shortDescription", e.target.value)
                  }
                  placeholder="Brief product description..."
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="description">Full Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInput("description", e.target.value)}
                  placeholder="Detailed product description, ingredients, benefits..."
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="barcode">Barcode</Label>
                  <Input
                    id="barcode"
                    value={formData.barcode}
                    onChange={(e) => handleInput("barcode", e.target.value)}
                    placeholder="1234567890123"
                  />
                </div>
                <div>
                  <Label htmlFor="code">SKU/Code</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => handleInput("code", e.target.value)}
                    placeholder="SHP-001"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => handleInput("imageUrl", e.target.value)}
                  placeholder="https://example.com/product-image.jpg"
                />
              </div>
            </div>
          </div>

          {/* Inventory Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Inventory & Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="stockQty">Stock Quantity</Label>
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
                />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Checkbox
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    handleInput("isActive", checked)
                  }
                />
                <Label htmlFor="isActive">Product is active</Label>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={saveProduct}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {modalType === "create" ? "Create Product" : "Update Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default ProductDashboard;
