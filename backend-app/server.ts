import app from "./src/app";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const PORT = process.env.PORT || 10000;
const HOST = process.env.HOST || "0.0.0.0";

app.listen(PORT, HOST, () =>
  console.log(`Listening on http://${HOST}:${PORT}`)
);
