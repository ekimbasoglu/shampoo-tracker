import React from "react";
import { Upload, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { importCSV, exportCSV } from "../../services/importExportService";

interface Props {
  isOpen: boolean;
  selectedProducts: Set<string>;
  onClose: () => void;
  onImported?: () => void;
}

export const ImportExportModal: React.FC<Props> = ({
  isOpen,
  selectedProducts,
  onClose,
  onImported,
}) => {
  /* ---------------------------------------------------------------- */
  /*  state                                                           */
  /* ---------------------------------------------------------------- */
  const [exportScope, setExportScope] = React.useState<"all" | "selected">(
    "all"
  );
  const [exportFormat, setExportFormat] = React.useState<
    "shopify" | "excel" | ""
  >("");

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [busy, setBusy] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const handleFileChosen = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    try {
      setBusy(true);
      await importCSV(e.target.files[0]);
      onImported?.();

      onClose(); // success – just close or show toast
    } catch (err) {
      console.error("Import failed:", err);
    } finally {
      setBusy(false);
    }
  };

  const handleExport = async () => {
    try {
      setBusy(true);
      await exportCSV(
        exportScope,
        [...selectedProducts],
        exportFormat as "shopify" | "excel"
      );
      onClose();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  /* ---------------------------------------------------------------- */
  /*  render                                                          */
  /* ---------------------------------------------------------------- */
  return (
    <>
      {/* hidden file field */}
      <input
        type="file"
        accept=".csv,text/csv"
        ref={fileInputRef}
        onChange={handleFileChosen}
        className="hidden"
      />

      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Import / Export Products</DialogTitle>
            <DialogDescription>
              Upload a CSV to create products or download products for Shopify /
              Excel.
            </DialogDescription>
          </DialogHeader>
          {/* ---------- main grid (IMPORT / EXPORT) ---------- */}
          <div className="space-y-4">
            {/* IMPORT side */}
            <div className="border rounded-lg p-4 space-y-3">
              <Label className="font-medium">Import products from CSV</Label>

              {/* choose / upload buttons */}
              <div className="flex gap-2">
                {/* hidden file input */}
                <input
                  type="file"
                  accept=".csv,text/csv"
                  ref={fileInputRef}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setSelectedFile(f); // new state
                  }}
                  className="hidden"
                />

                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={busy}
                >
                  <Upload className="h-4 w-4 mr-1" />
                  Choose CSV
                </Button>

                <Button
                  type="button"
                  className="flex-1"
                  disabled={busy || !selectedFile}
                  onClick={async () => {
                    if (!selectedFile) return;
                    try {
                      setBusy(true);
                      await importCSV(selectedFile);
                      onImported?.();
                      onClose();
                    } catch (err) {
                      console.error(err);
                      alert("Import failed – check console for details.");
                    } finally {
                      setBusy(false);
                      setSelectedFile(null);
                    }
                  }}
                >
                  Upload&nbsp;
                  {selectedFile ? `(${selectedFile.name})` : ""}
                </Button>
              </div>

              {/* tiny hint */}
              {selectedFile && (
                <p className="text-xs text-muted-foreground truncate">
                  Selected file: {selectedFile.name}
                </p>
              )}
            </div>

            {/* EXPORT side */}
            <div className="border rounded-lg p-4 space-y-3">
              <Label className="font-medium">Export products to CSV</Label>

              {/* scope buttons */}
              <div className="flex gap-2">
                <Button
                  variant={exportScope === "all" ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={() => setExportScope("all")}
                >
                  All
                </Button>
                <Button
                  variant={exportScope === "selected" ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  disabled={!selectedProducts.size}
                  onClick={() => setExportScope("selected")}
                >
                  Selected ({selectedProducts.size})
                </Button>
              </div>

              {/* format buttons */}
              <div className="flex gap-2">
                <Button
                  variant={exportFormat === "shopify" ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={() => setExportFormat("shopify")}
                >
                  Shopify
                </Button>
                <Button
                  variant={exportFormat === "excel" ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={() => setExportFormat("excel")}
                >
                  Excel
                </Button>
              </div>

              {/* export trigger */}
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={
                  busy ||
                  !exportFormat ||
                  (exportScope === "selected" && !selectedProducts.size)
                }
                onClick={handleExport}
              >
                <Download className="h-4 w-4 mr-1" />
                Export CSV
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={busy}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
