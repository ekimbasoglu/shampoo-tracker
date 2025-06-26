import express, { Application } from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import logger from "./middleware/logger";
import connectDB from "./config/db";
import { setupSwagger } from "./config/swagger";
import cors from "cors";

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app: Application = express();

// Set up Swagger
setupSwagger(app);

// Enable CORS for all routes
app.use(
  cors({
    origin: "https://shampoo-tracker-react.onrender.com", // exact origin
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, // if you set cookies / auth header
  })
);

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(logger);

// Routes
import routes from "./routes";
app.use("/api", routes);

export default app;
