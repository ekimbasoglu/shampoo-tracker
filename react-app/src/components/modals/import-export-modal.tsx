"use client";

import type React from "react";
import { Upload, Download } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface ImportExportModalProps {
  isOpen: boolean;
  selectedProducts: Set<string>;
  onClose: () => void;
}

export const ImportExportModal: React.FC<ImportExportModalProps> = ({
  isOpen,
  selectedProducts,
  onClose,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
                Export All Products
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
};
