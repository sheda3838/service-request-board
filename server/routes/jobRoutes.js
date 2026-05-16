import express from "express";

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
router.post("/", createJob);

//route - /api/jobs/:id
router.get("/:id", getJobById);
router.patch("/:id", updateJobStatus);
router.delete("/:id", deleteJob);

export default router;
