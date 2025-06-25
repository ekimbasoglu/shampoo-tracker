import app from "./src/app";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const PORT = Number(process.env.PORT);
if (!PORT) throw new Error("PORT env var missing!");

app.listen(PORT, "10000", () => {
  console.log(`API listening on ${PORT}`);
});
