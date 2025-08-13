"use client";

import type React from "react";
import { Trash2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Product } from "../../types"

interface ProductDeleteModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onConfirm: (product: Product) => void;
}

export const ProductDeleteModal: React.FC<ProductDeleteModalProps> = ({
  isOpen,
  product,
  onClose,
  onConfirm,
}) => {
  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Product</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{product.name}"? This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={() => onConfirm(product)}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Product
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
