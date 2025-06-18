import request from "supertest";
import app from "../src/app";
import { contentId } from "./content.test";
import { token, userId } from "./auth.test";
import mongoose from "mongoose";

describe("Rating API Tests", () => {
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

  it("should rate the content", async () => {
    const res = await request(app)
      .post(`/api/rating/${contentId}/rate`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        rating: 5,
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("rating");
    expect(res.body.rating.rating).toBe(5);
  });

  it("should get all ratings for the content", async () => {
    const res = await request(app)
      .get(`/api/rating/content/${contentId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body[0]).toHaveProperty("rating", 5);
  });

  it("should get all ratings by the user", async () => {
    const res = await request(app)
      .get(`/api/rating/user/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body[0]).toHaveProperty("rating", 5);
  });
});
