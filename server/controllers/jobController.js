import Job from "../models/Job.js";

// Create a new job request using POST /api/jobs
const createJob = async (req, res, next) => {
  try {
    const job = await Job.create(req.body);

    res.status(201).json(job);
  } catch (error) {
    next(error);
  }
};

// Get all job requests using GET /api/jobs
const getJobs = async (req, res, next) => {
  try {
    const filter = {};

    //category filter
    if (req.query.category) {
      filter.category = req.query.category;
    }

    //status filter
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const jobs = await Job.find(filter).sort({ createdAt: -1 });

    res.status(200).json(jobs);
  } catch (error) {
    next(error);
  }
};

// Get single job request using GET /api/jobs/:id
const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    //return 404 if job does not exist
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    res.status(200).json(job);
  } catch (error) {
    next(error);
  }
};

// Update job status only using PATCH /api/jobs/:id
const updateJobStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ["Open", "In Progress", "Closed"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status value",
      });
    }

    //only allow status updates
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true,
      },
    );

    //return 404 if job does not exist
    if (!updatedJob) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    res.status(200).json(updatedJob);
  } catch (error) {
    next(error);
  }
};

//delete a job request using DELETE /api/jobs/:id
const deleteJob = async (req, res, next) => {
  try {
    const deletedJob = await Job.findByIdAndDelete(req.params.id);

    //return 404 if job does not exist
    if (!deletedJob) {
      return res.status(404).json({
        message: "Job not foundd",
      });
    }

    res.status(200).json({
      message: "Job deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export {
  createJob,
  getJobs,
  getJobById,
  updateJobStatus,
  deleteJob,
};