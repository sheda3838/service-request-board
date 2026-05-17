import express from "express";
import cors from "cors";
import jobRoutes from "./routes/jobRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://service-request-board-pearl.vercel.app",
    ],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.json({
    message: "API is running",
  });
});

// Routes
app.use("/api/jobs", jobRoutes);
app.use("/api/auth", authRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

app.use(errorHandler);

export default app;
