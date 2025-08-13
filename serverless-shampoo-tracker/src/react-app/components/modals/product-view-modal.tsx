"use client";

import type React from "react";
import { Edit, Droplets } from "lucide-react";
import { Image } from "@unpic/react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import type { Product } from "../../types";

interface ProductViewModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onEdit: (product: Product) => void;
}

export const ProductViewModal: React.FC<ProductViewModalProps> = ({
  isOpen,
  product,
  onClose,
  onEdit,
}) => {
  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[900px] max-h-[90vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-blue-600" />
            Product Details
          </DialogTitle>
          <DialogDescription>
            View detailed product information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Image Preview */}
          {product.imageUrl && (
            <div className="flex justify-center">
              <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={product.imageUrl || "/placeholder.svg"}
                  alt={product.name || "Product"}
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
                <Label className="text-sm font-medium">Product Name</Label>
                <p className="text-sm mt-1 font-medium">
                  {product.name || "—"}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Brand</Label>
                <p className="text-sm mt-1">{product.brand || "—"}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Category</Label>
                <div className="mt-1">
                  {product.category ? (
                    <Badge variant="secondary" className="text-xs">
                      {product.category}
                    </Badge>
                  ) : (
                    <span className="text-sm">—</span>
                  )}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Price</Label>
                <p className="text-sm mt-1 font-medium">
                  {product.price && !isNaN(Number(product.price))
                    ? `€${Number(product.price).toFixed(2)}`
                    : product.price && /^\d+(\.\d+)?/.test(product.price)
                    ? `€${Number.parseFloat(product.price).toFixed(2)}`
                    : "—"}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Volume</Label>
                <p className="text-sm mt-1">{product.volume || "—"}</p>
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
                <Label className="text-sm font-medium">Short Description</Label>
                <p className="text-sm mt-1">
                  {product.shortDescription || "No description available"}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Full Description</Label>
                <p className="text-sm mt-1">
                  {product.description || "No detailed description available"}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Barcode</Label>
                  <p className="text-sm mt-1 font-mono">
                    {product.barcode || "—"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">SKU/Code</Label>
                  <p className="text-sm mt-1 font-mono">
                    {product.code || "—"}
                  </p>
                </div>
              </div>
              {product.imageUrl && (
                <div>
                  <Label className="text-sm font-medium">Image URL</Label>
                  <p className="text-sm mt-1 break-all text-blue-600">
                    {product.imageUrl}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Inventory & Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Inventory & Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="opacity-50">
                <Label className="text-sm font-medium line-through">
                  Stock Quantity
                </Label>
                <p className="text-sm mt-1 font-medium line-through text-gray-400">
                  {product.stockQty} units
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Status</Label>
                <div className="mt-1">
                  <Badge variant={product.isActive ? "default" : "secondary"}>
                    {product.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
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
            </div>
          </div>

          {/* AI Description if available */}
          {product.aiDescription?.content && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                AI Generated Content
              </h3>
              <div>
                <Label className="text-sm font-medium">AI Description</Label>
                <p className="text-sm mt-1 bg-blue-50 p-3 rounded-md">
                  {product.aiDescription.content}
                </p>
                {product.aiDescription.model && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Generated by: {product.aiDescription.model}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Tags if available */}
          {product.tags && product.tags.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Attributes if available */}
          {product.attributes && Object.keys(product.attributes).length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Additional Attributes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.attributes).map(([key, value]) => (
                  <div key={key}>
                    <Label className="text-sm font-medium capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </Label>
                    <p className="text-sm mt-1">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={() => onEdit(product)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Product
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
