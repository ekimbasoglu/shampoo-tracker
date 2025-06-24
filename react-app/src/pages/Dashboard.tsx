"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Upload,
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

import type { Product } from "../types";
import { ProductViewModal } from "../components/modals/product-view-modal";
import { ProductFormModal } from "../components/modals/product-form-modal";
import { ProductDeleteModal } from "../components/modals/product-delete-modal";
import { ImportExportModal } from "../components/modals/import-export-modal";

const ProductDashboard: React.FC = () => {
  /* STATE */
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [importExportModalOpen, setImportExportModalOpen] = useState(false);
  const [formModalType, setFormModalType] = useState<"create" | "update">(
    "create"
  );
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
        setDeleteModalOpen(false);
        setSelectedProduct(null);
      }
    } catch (err) {
      console.error("Error deleting product", err);
    }
  };

  /* Modal handlers */
  const openViewModal = (product: Product) => {
    setSelectedProduct(product);
    setViewModalOpen(true);
  };

  const openFormModal = (type: "create" | "update", product?: Product) => {
    setFormModalType(type);
    setSelectedProduct(product || null);
    setFormModalOpen(true);
  };

  const openDeleteModal = (product: Product) => {
    setSelectedProduct(product);
    setDeleteModalOpen(true);
  };

  const closeAllModals = () => {
    setViewModalOpen(false);
    setFormModalOpen(false);
    setDeleteModalOpen(false);
    setImportExportModalOpen(false);
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
              onClick={() => openFormModal("create")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Product
            </Button>
            <Button
              onClick={() => setImportExportModalOpen(true)}
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
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
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
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent></CardContent>
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
                            // eslint-disable-next-line no-constant-binary-expression
                            product.imageUrl ||
                            "/placeholder.svg?height=64&width=64" ||
                            "/placeholder.svg"
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
                          ? `€${Number.parseInt(product.price, 10)}`
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
                            onClick={() => openViewModal(product)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openFormModal("update", product)}
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

      {/* MODALS */}
      <ProductViewModal
        isOpen={viewModalOpen}
        product={selectedProduct}
        onClose={closeAllModals}
        onEdit={(product) => {
          closeAllModals();
          setTimeout(() => openFormModal("update", product), 100);
        }}
      />

      <ProductFormModal
        isOpen={formModalOpen}
        type={formModalType}
        product={selectedProduct}
        onClose={closeAllModals}
        onSuccess={() => {
          fetchProducts();
          closeAllModals();
        }}
      />

      <ProductDeleteModal
        isOpen={deleteModalOpen}
        product={selectedProduct}
        onClose={closeAllModals}
        onConfirm={handleDelete}
      />

      <ImportExportModal
        isOpen={importExportModalOpen}
        selectedProducts={selectedProducts}
        onClose={() => setImportExportModalOpen(false)}
      />
    </div>
  );
};

export default ProductDashboard;
