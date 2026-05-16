"use client";

import { useEffect, useState } from "react";
import { getJobs } from "@/services/jobService";

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getJobs();
      setJobs(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-medium">Loading jobs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Service Requests</h1>

      {jobs.length === 0 ? (
        <p className="text-gray-500">No jobs found.</p>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold">{job.title}</h2>

              <p className="text-gray-600 mt-1">{job.description}</p>

              <div className="flex gap-4 mt-3 text-sm text-gray-500">
                <span>{job.location || "N/A"}</span>
                <span>{job.category || "Uncategorized"}</span>
                <span
                  className={`font-medium ${
                    job.status === "Open"
                      ? "text-green-600"
                      : job.status === "In Progress"
                        ? "text-yellow-600"
                        : "text-red-600"
                  }`}
                >
                  {job.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
