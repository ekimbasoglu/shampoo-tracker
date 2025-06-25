"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Droplets, Sparkles, FileText } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import type { Product } from "../../types";

interface ProductFormModalProps {
  isOpen: boolean;
  type: "create" | "update";
  product: Product | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  type,
  product,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<Product>({
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
  });

  const [isGenerating, setIsGenerating] = useState(false);

  // Update formData when product changes
  useEffect(() => {
    if (product && type === "update") {
      setFormData(product);
    } else if (type === "create") {
      setFormData({
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
      });
    }
  }, [product, type, isOpen]);

  const handleInput = (key: keyof Product, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handlePriceChange = (amount: number) => {
    setFormData((prev) => ({
      ...prev,
      price: `${amount}`,
    }));
  };

  const handleVolumeChange = (value: number) => {
    setFormData((prev) => ({
      ...prev,
      volume: `${value}mL`,
    }));
  };

  const generateDescription = async (descType: "short" | "full") => {
    if (!formData.name) {
      alert("Please enter a product name first");
      return;
    }

    setIsGenerating(true);
    try {
      // Simulate AI generation - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const generated =
        descType === "short"
          ? `Premium ${formData.name} for all hair types. Gentle formula with natural ingredients.`
          : `Experience the luxury of ${formData.name}, specially formulated for modern hair care needs. This premium product combines advanced technology with natural ingredients to deliver exceptional results. Suitable for all hair types, it provides deep nourishment while maintaining the natural balance of your hair. Perfect for daily use, this product will transform your hair care routine and leave your hair looking healthy, shiny, and beautiful.`;

      if (descType === "short") {
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
      type === "update" && product ? `/${product._id}` : ""
    }`;
    const method = type === "create" ? "POST" : "PUT";

    if (type === "create") {
      const missingFields = [];
      if (!formData.name.trim()) missingFields.push("Product name");
      if (!formData.code.trim()) missingFields.push("Product code");
      if (missingFields.length > 0) {
        alert(
          `Please fill in the following required field(s): ${missingFields.join(
            ", "
          )}.`
        );
        return;
      }
    }

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
        onSuccess();
      }
      if (!res.ok) {
        alert(`Product with this barcode or code already exists.`);
      }
    } catch (err) {
      console.error("Error saving product", err);
    }
  };

  const title = type === "create" ? "Create New Product" : "Update Product";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[900px] max-h-[90vh] overflow-y-auto sm:max-w-6xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-blue-600" />
            {title}
          </DialogTitle>
          <DialogDescription>
            {type === "create"
              ? "Add a new beauty product to your inventory"
              : "Update the product information"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
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
                    placeholder="Custom category"
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
              </div>
              <div>
                <Label htmlFor="price">Price (€)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={
                    formData.price && /^\d+(\.\d+)?/.test(formData.price)
                      ? Number.parseFloat(formData.price)
                      : 0
                  }
                  onChange={(e) =>
                    handlePriceChange(Number.parseFloat(e.target.value) || 0)
                  }
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="volume">Volume (mL)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="volume"
                    type="number"
                    value={Number.parseInt(formData.volume || "0", 10)}
                    onChange={(e) =>
                      handleVolumeChange(Number.parseInt(e.target.value) || 0)
                    }
                    placeholder="250"
                    min={0}
                  />
                  <span className="text-sm text-muted-foreground">mL</span>
                </div>
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
                </div>
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
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="description">Full Description</Label>
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
                </div>
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
              </div>
              <div>
                <Label>Status</Label>
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
            {type === "create" ? "Create Product" : "Update Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
