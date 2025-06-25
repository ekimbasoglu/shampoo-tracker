/* src/components/modals/settings-modal.tsx */
"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; // ← shadcn wrapper
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export const SettingsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onDeleted?: () => void;
}> = ({ isOpen, onClose, onDeleted }) => {
  const [busy, setBusy] = React.useState(false);

  const handleDeleteAll = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete ALL products? This cannot be undone."
      )
    )
      return;

    try {
      setBusy(true);
      await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URI}/api/products/delete-all`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      onDeleted?.();
      onClose();
      // refresh the page
      window.location.reload();
    } catch (err) {
      alert("Failed to delete all products.");
      console.error(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Manage advanced settings for your products.
          </DialogDescription>
        </DialogHeader>

        <div className="border rounded-lg p-4 space-y-3">
          <Label className="font-medium text-red-600">Danger Zone</Label>
          <Button
            variant="destructive"
            className="w-full"
            disabled={busy}
            onClick={handleDeleteAll}
          >
            Delete All Products
          </Button>
          <p className="text-xs text-muted-foreground">
            This will permanently delete all products from your account.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={busy}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
