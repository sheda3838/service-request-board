"use client";

import { useEffect, useState } from "react";
import { getJobs, updateJobStatus } from "@/services/jobService";
import JobCard from "@/components/JobCard";
import Link from "next/link";
import { CATEGORIES, STATUSES } from "@/lib/constants";

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};
      if (categoryFilter) params.category = categoryFilter;
      if (statusFilter) params.status = statusFilter;

      const res = await getJobs(params);
      setJobs(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [categoryFilter, statusFilter]);

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      await updateJobStatus(jobId, newStatus);

      if (statusFilter && statusFilter !== newStatus) {
        setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
      } else {
        setJobs((prevJobs) =>
          prevJobs.map((job) =>
            job._id === jobId ? { ...job, status: newStatus } : job,
          ),
        );
      }
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update status.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Service Requests</h1>
        <Link
          href="/new"
          className="inline-flex items-center justify-center px-4 py-2 bg-gray-900 text-white font-medium rounded-md hover:bg-gray-800 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 shrink-0"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          New Job
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full sm:w-48 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition appearance-none cursor-pointer"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 0.75rem center",
            backgroundSize: "1em",
          }}
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-48 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition appearance-none cursor-pointer"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 0.75rem center",
            backgroundSize: "1em",
          }}
        >
          <option value="">All Statuses</option>
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center items-center">
          <p className="text-gray-500 font-medium text-lg">Loading jobs...</p>
        </div>
      ) : error ? (
        <div className="py-12 flex justify-center items-center text-red-500">
          <p>{error}</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="py-16 px-6 flex flex-col items-center justify-center text-center bg-gray-50 border border-dashed border-gray-300 rounded-xl">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <p className="text-gray-900 text-lg font-medium mb-2">
            {categoryFilter || statusFilter
              ? "No matching requests found"
              : "No service requests yet"}
          </p>
          <p className="text-gray-500 max-w-sm mx-auto mb-4">
            {categoryFilter || statusFilter
              ? "Try adjusting your filters or clear them to see all jobs."
              : "Get started by creating a new service request."}
          </p>
          {(categoryFilter || statusFilter) && (
            <button
              onClick={() => {
                setCategoryFilter("");
                setStatusFilter("");
              }}
              className="text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50 transition"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
