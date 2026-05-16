import API from "@/lib/api";

export const getJobs = () => API.get("/jobs");

export const getJobById = (id) =>
  API.get(`/jobs/${id}`);

export const createJob = (data) =>
  API.post("/jobs", data);

export const updateJobStatus = (id, status) =>
  API.patch(`/jobs/${id}`, { status });

export const deleteJob = (id) =>
  API.delete(`/jobs/${id}`);