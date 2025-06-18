import request from "supertest";
import app from "../src/app";
import mongoose from "mongoose";

let token: string;
let userId: string;

describe("Auth API Tests", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI || "");
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should create a new user", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      email: "testuser@example.com",
      username: "testuser",
      password: "testpassword",
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user).toHaveProperty("id");

    token = res.body.token;
    userId = res.body.user.id;
  });

  it("should log in the user", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "testuser@example.com",
      password: "testpassword",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user).toHaveProperty("id");

    token = res.body.token;
    userId = res.body.user.id;
  });
});

export { token, userId };
