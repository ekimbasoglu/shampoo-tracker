import request from "supertest";
import app from "../src/app";
import { token } from "./auth.test";
import mongoose from "mongoose";

let contentId: string;

describe("Content API Tests", () => {
  beforeAll(async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI || "");
    } catch (error) {
      console.error("Database connection failed:", error);
    }
  });

  afterAll(async () => {
    try {
      await mongoose.connection.close();
    } catch (error) {
      console.error("Database disconnection failed:", error);
    }
  });

  it("should create a new content item", async () => {
    const res = await request(app)
      .post("/api/content")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Content",
        description: "This is a test content.",
        category: "game",
        thumbnail_url: "https://example.com/thumbnail.jpg",
        content_url: "https://example.com/content",
      });

    expect(res.status).toBe(201);
    expect(res.body.content).toHaveProperty("_id");
    contentId = res.body.content._id;
  });
});

export { contentId };
