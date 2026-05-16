"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getJobById, updateJobStatus, deleteJob } from "@/services/jobService";
import Link from "next/link";

export default function JobDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getJobById(id);
      setJob(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch job details.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
      setUpdating(true);
      await updateJobStatus(id, newStatus);
      setJob((prev) => ({ ...prev, status: newStatus }));
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update status.");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this job request?")) return;
    
    try {
      setDeleting(true);
      await deleteJob(id);
      router.push("/");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete job.");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-medium text-gray-600">Loading job details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4">
        <p className="text-red-600 font-medium">{error}</p>
        <Link href="/" className="text-gray-600 hover:text-gray-900 underline">
          Go back home
        </Link>
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Jobs
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {/*header section */}
        <div className="p-6 sm:p-8 border-b border-gray-100 flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h1>
            <p className="text-sm text-gray-500">
              Posted on {new Date(job.createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
             <div className="flex items-center gap-2">
                <label htmlFor="status" className="text-sm font-medium text-gray-700">Status:</label>
                <select
                  id="status"
                  value={job.status}
                  onChange={handleStatusChange}
                  disabled={updating}
                  className="px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-900 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none disabled:opacity-50 transition cursor-pointer"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Closed">Closed</option>
                </select>
             </div>
          </div>
        </div>

        {/* Details section */}
        <div className="p-6 sm:p-8 space-y-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{job.description}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Category</h3>
              <p className="text-gray-900 font-medium">{job.category}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Location</h3>
              <p className="text-gray-900 font-medium">{job.location}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Contact Name</h3>
              <p className="text-gray-900 font-medium">{job.contactName}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Contact Email</h3>
              <p className="text-gray-900 font-medium">
                <a href={`mailto:${job.contactEmail}`} className="text-blue-600 hover:text-blue-800 hover:underline transition">
                  {job.contactEmail}
                </a>
              </p>
            </div>
          </div>
        </div>
        
        {/* Footer section (Actions) */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="cursor-pointer px-4 py-2 bg-white text-red-600 border border-red-200 rounded-md text-sm font-medium hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete Job Request"}
          </button>
        </div>
      </div>
    </div>
  );
}
