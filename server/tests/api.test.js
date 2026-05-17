import request from "supertest";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import mongoose from "mongoose";
import app from "../app.js";
import connectDB from "../config/db.js";
import User from "../models/User.js";

describe("API Endpoints", () => {
  beforeAll(async () => {
    // connect to the real local MongoDB before running tests
    await connectDB();
  });

  afterAll(async () => {
    // close the connection after tests to prevent hanging
    await mongoose.connection.close();
  });

  describe("GET /api/jobs", () => {
    it("should return status 200 and an array of jobs", async () => {
      const response = await request(app).get("/api/jobs");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("POST /api/auth/register", () => {
    beforeAll(async () => {
      // clean up the dummy user from previous test runs if it exists
      await User.deleteOne({ email: "test@gmail.com" });
    });

    it("should register a new dummy user and return status 201", async () => {
      const newUser = {
        name: "Test user",
        email: "test@gmail.com",
        password: "1234",
      };

      const response = await request(app).post("/api/auth/register").send(newUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("token");
      expect(response.body.user.name).toBe(newUser.name);
      expect(response.body.user.email).toBe(newUser.email);
    });
  });
});
