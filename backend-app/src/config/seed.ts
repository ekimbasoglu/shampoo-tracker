import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import User from "../models/userModel";
import Content from "../models/productModel";
import Rating from "../models/ratingModel";

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "");
    console.log("MongoDB connected");
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
};

// Seed data
const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Content.deleteMany({});
    await Rating.deleteMany({});

    // Sample Users
    const users = await User.insertMany([
      {
        email: "user1@example.com",
        password: await bcrypt.hash("password1", 10),
        username: "user1",
      },
      {
        email: "user2@example.com",
        password: await bcrypt.hash("password2", 10),
        username: "user2",
      },
    ]);

    console.log("Users seeded");

    // Sample Content
    const content = await Content.insertMany([
      {
        title: "Blasphemous 2",
        description:
          "Like its predecessor, Blasphemous 2 is a 2D side-scrolling Metroidvania action-adventure game. Players assume control of the Penitent One, a silent knight who must embark on a new adventure in a new kingdom to prevent the rebirth of a curse named The Miracle",
        category: "game",
        thumbnail_url:
          "data:image/jpeg;base64,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",
        content_url:
          "https://store.steampowered.com/app/2114740/Blasphemous_2/",
      },
      {
        title: "Blasphemous 2 Gameplay",
        description:
          "Blasphemous 2 is a metroidvania that puts you back in the hallowed boots of The Penitent one as they continue their adventure filled with religious iconography and some of the grossest enemies ever spawned. Here are the first 16 minutes of this unholy sequel.",
        category: "video",
        thumbnail_url:
          "https://assets-prd.ignimgs.com/2023/08/12/blasphemous2thumb-1691857441134.jpg",
        content_url: "https://www.youtube.com/watch?v=WYRmZkDqRdQ",
      },
    ]);

    console.log("Content seeded");

    // Sample Ratings
    await Rating.insertMany([
      {
        user: users[0]._id,
        content: content[0]._id,
        rating: 5,
      },
      {
        user: users[1]._id,
        content: content[1]._id,
        rating: 4,
      },
      {
        user: users[0]._id,
        content: content[1]._id,
        rating: 3,
      },
    ]);

    console.log("Ratings seeded");

    process.exit();
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
};

// Run the seeding script
(async () => {
  await connectDB();
  await seedData();
})();
