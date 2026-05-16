import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  createJob,
  getJobs,
  getJobById,
  updateJobStatus,
  deleteJob,
} from "../controllers/jobController.js";

const router = express.Router();

//route - /api/jobs
router.get("/", getJobs);
router.post("/", protect, createJob);

//route - /api/jobs/:id
router.get("/:id", getJobById);
router.patch("/:id", updateJobStatus);
router.delete("/:id", protect, deleteJob);

export default router;
