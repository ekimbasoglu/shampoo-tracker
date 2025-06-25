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
  Edit,
  Trash2,
  ShoppingCart,
  Settings,
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

// ** 💡 new, fully‑separated modal components **
import { ProductViewModal } from "../components/modals/product-view-modal";
import { ProductFormModal } from "../components/modals/product-form-modal";
import { ProductDeleteModal } from "../components/modals/product-delete-modal";
import { ImportExportModal } from "../components/modals/import-export-modal";
import { SettingsModal } from "../components/modals/settings-modal";

import type { Product } from "../types";

/*****************************************************************
 🗂️  DASHBOARD
*****************************************************************/
const ProductDashboard: React.FC = () => {
  /**                           ░ STATE ░                         **/
  const [products, setProducts] = useState<Product[]>([]);

  // individual modal flags (no more reducer horror 🙂)
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [importExportModalOpen, setImportExportModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "update">("create");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  // list helpers
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  /**                         ░ NETWORK ░                        **/
  async function fetchProducts() {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URI}/api/products`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (res.status === 401) {
        handleLogout();
        return;
      }
      const raw = await res.json();
      setProducts(Array.isArray(raw) ? raw : raw.products ?? []);
    } catch (e) {
      console.error("fetchProducts()", e);
    }
  }
  useEffect(() => {
    fetchProducts();
  }, []);

  async function deleteProduct(p: Product) {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URI}/api/products/${p._id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (!res.ok) throw new Error();
      fetchProducts();
      closeAll();
    } catch (e) {
      console.error("deleteProduct()", e);
    }
  }

  /**                       ░ AUTH / NAV ░                       **/
  function handleLogout() {
    localStorage.removeItem("token");
    window.location.href = "/";
  }

  /**                        ░ MODAL API ░                       **/
  function openViewModal(p: Product) {
    setSelectedProduct(p);
    requestAnimationFrame(() => setViewModalOpen(true));
  }
  function openFormModal(mode: "create" | "update", p?: Product) {
    setFormMode(mode);
    setSelectedProduct(p ?? null);
    requestAnimationFrame(() => setFormModalOpen(true));
  }
  function openDeleteModal(p: Product) {
    setSelectedProduct(p);
    requestAnimationFrame(() => setDeleteModalOpen(true));
  }
  function openSettingsModal() {
    requestAnimationFrame(() => setSettingsModalOpen(true));
  }
  function closeAll() {
    setViewModalOpen(false);
    setFormModalOpen(false);
    setDeleteModalOpen(false);
    setImportExportModalOpen(false);
    setSettingsModalOpen(false);
    setSelectedProduct(null);
  }

  /**                       ░ LIST HELPERS ░                     **/
  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const copy = new Set(prev);
      copy.has(id) ? copy.delete(id) : copy.add(id);
      setSelectAll(copy.size === filtered.length);
      return copy;
    });
  }
  function toggleSelectAll() {
    if (selectAll) {
      setSelectedIds(new Set());
      setSelectAll(false);
    } else {
      setSelectedIds(new Set(filtered.map((p) => p._id)));
      setSelectAll(true);
    }
  }

  /**                       ░ DERIVED DATA ░                     **/
  const filtered = products.filter((p) => {
    const t = searchTerm.toLowerCase();
    const matchSearch = [p.name, p.brand, p.category, p.code].some((s) =>
      s?.toLowerCase().includes(t)
    );
    const matchCat = filterCategory === "all" || p.category === filterCategory;
    return matchSearch && matchCat;
  });
  const categories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean))
  );
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.isActive).length;

  /******************************* JSX *******************************/
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      {/* ░░ HEADER ░░ */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Droplets className="h-8 w-8 text-blue-600" /> Beauty Product
              Tracker
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
              <Plus className="h-4 w-4 mr-2" /> New Product
            </Button>
            <Button
              onClick={() => setImportExportModalOpen(true)}
              variant="outline"
            >
              <Upload className="h-4 w-4 mr-2" /> Import/Export
            </Button>
            <Button onClick={() => openSettingsModal()} variant="outline">
              <Settings className="h-4 w-4 mr-2" /> Settings
            </Button>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        </div>

        {/* ░░ STATS ░░ */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={Package}
            label="Total Products"
            value={totalProducts}
          />
          <StatCard
            icon={ShoppingCart}
            label="Active Products"
            value={activeProducts}
            accent="text-green-600"
          />
          <PlaceholderStat label="Stock Info" />
          <PlaceholderStat label="Total Value" />
        </div>

        {/* ░░ FILTERS ░░ */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
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
                  {categories.map((c) => (
                    <SelectItem key={c} value={c!}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ░░ TABLE ░░ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Products ({filtered.length})</span>
            {selectedIds.size > 0 && (
              <Badge variant="secondary">{selectedIds.size} selected</Badge>
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
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="w-20">Image</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Volume</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => (
                  <TableRow
                    key={p._id}
                    className="hover:bg-muted/50 cursor-pointer"
                    onClick={(e) => {
                      // Prevent row click if clicking on a button or checkbox
                      if (
                        (e.target as HTMLElement).closest("button") ||
                        (e.target as HTMLElement).closest(
                          "input[type='checkbox']"
                        )
                      ) {
                        return;
                      }
                      openViewModal(p);
                    }}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.has(p._id)}
                        onCheckedChange={() => toggleSelect(p._id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Thumb src={p.imageUrl} alt={p.name} />
                    </TableCell>
                    <TableCell>
                      <code className="text-sm font-mono">
                        {p.code || p.barcode || "—"}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-sm">{p.name}</div>
                        {p.shortDescription && (
                          <div className="text-xs text-muted-foreground line-clamp-2">
                            {p.shortDescription}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{p.brand || "—"}</TableCell>
                    <TableCell>
                      {p.category ? (
                        <Badge variant="secondary" className="text-xs">
                          {p.category}
                        </Badge>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {p.price ? `€${parseFloat(p.price).toFixed(2)}` : "—"}
                    </TableCell>
                    <TableCell className="text-sm">{p.volume || "—"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {/* <Button
                          variant="ghost"
                          size="icon"
                          aria-label="View"
                          onClick={() => openViewModal(p)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button> */}
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Edit"
                          onClick={() => openFormModal("update", p)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Delete"
                          onClick={() => openDeleteModal(p)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                        <Badge
                          variant={p.isActive ? "default" : "secondary"}
                          className="ml-2"
                        >
                          {p.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* ░░ MODALS ░░ */}
      <ProductViewModal
        isOpen={viewModalOpen}
        product={selectedProduct}
        onClose={closeAll}
        onEdit={(p) => {
          closeAll();
          setTimeout(() => openFormModal("update", p), 100);
        }}
      />

      <ProductFormModal
        isOpen={formModalOpen}
        type={formMode}
        product={selectedProduct}
        onClose={closeAll}
        onSuccess={() => {
          fetchProducts();
          closeAll();
        }}
      />

      <ProductDeleteModal
        isOpen={deleteModalOpen}
        product={selectedProduct}
        onClose={closeAll}
        onConfirm={deleteProduct}
      />

      <ImportExportModal
        isOpen={importExportModalOpen}
        selectedProducts={selectedIds}
        onClose={() => setImportExportModalOpen(false)}
      />

      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
      />
    </div>
  );
};

/*****************************************************************
 🩻 SMALL PRESENTATIONAL BITS
*****************************************************************/
function Thumb({ src, alt }: { src?: string; alt: string }) {
  return (
    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
      <Image
        src={src || "/placeholder.svg?height=64&width=64"}
        alt={alt}
        width={64}
        height={64}
        className="object-cover w-full h-full"
      />
    </div>
  );
}
function StatCard({
  icon: Icon,
  label,
  value,
  accent = "",
}: {
  icon: React.ElementType;
  label: string;
  value?: number | string;
  accent?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${accent}`}>{value}</div>
      </CardContent>
    </Card>
  );
}
function PlaceholderStat({ label }: { label: string }) {
  return (
    <Card className="opacity-50 pointer-events-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {label}
        </CardTitle>
        <Tag className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}

export default ProductDashboard;
