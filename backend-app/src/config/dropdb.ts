import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dropDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "");

    const collections = await mongoose.connection.db.collections();

    for (const collection of collections) {
      await collection.drop();
      console.log(`Dropped collection: ${collection.collectionName}`);
    }

    console.log("All collections dropped successfully.");
    process.exit(0);
  } catch (error) {
    console.error(`Error dropping collections: ${(error as Error).message}`);
    process.exit(1);
  }
};

(async () => {
    await dropDatabase();
  })();
  