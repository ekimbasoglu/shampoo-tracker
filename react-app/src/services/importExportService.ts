import Papa from "papaparse";

export async function importCSV(file: File): Promise<void> {
  const form = new FormData();
  form.append("file", file, file.name);
  const res = await fetch(
    `${import.meta.env.VITE_APP_BACKEND_URI}/api/products/import`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
      },
      body: form,
    }
  );
  console.log("res:", res);

  if (!res.ok) {
    const { message = "Import failed" } = await res.json().catch(() => ({}));
    throw new Error(message);
  }
}

type Scope = "all" | "selected";
type Format = "shopify" | "excel";

export async function exportCSV(
  scope: Scope,
  products: string[],
  format: Format
): Promise<void> {
  const res = await fetch(
    `${import.meta.env.VITE_APP_BACKEND_URI}/api/products/export/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")!}`,
      },
      body: JSON.stringify({ scope, products, format }),
    }
  );
  if (!res.ok) throw new Error(await res.text());

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `products-${scope}-${format}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function readLocalCSV(file: File): Promise<unknown[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (r) => resolve(r.data),
      error: reject,
    });
  });
}
