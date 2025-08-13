import { MiddlewareHandler } from "hono";

// Parses multipart and sets the File on context
export const csvUpload: MiddlewareHandler = async (c, next) => {
  const formData = await c.req.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return c.json({ message: "CSV file is required" }, 400);
  }

  c.set("csvFile", file);
  await next();
};
