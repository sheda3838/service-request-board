"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getJobById, updateJobStatus, deleteJob } from "@/services/jobService";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import Toast from "@/components/Toast";

// this page displays the full details of a specific job request and allows you to update its status or delete it
export default function JobDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (!id) return;
    fetchJob();
  }, [id]);

  // fetches the actual job data from our express backend
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

  // we handle the status change directly here so it instantly updates the ui before hittting the server
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
      setUpdating(true);
      await updateJobStatus(id, newStatus);
      setJob((prev) => ({ ...prev, status: newStatus }));
      setToastMessage("Status updated successfully!");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update status.");
    } finally {
      setUpdating(false);
    }
  };

  // ensures user doesn't accidentally delete a job without confirming first
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this job request?")) return;
    
    try {
      setDeleting(true);
      await deleteJob(id);
      
      // used session storage to safely pass the success toast over to the home page after redirecting
      sessionStorage.setItem("successMessage", "Job request deleted successfully!");
      router.push("/");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete job.");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 h-[100dvh] flex flex-col">
        <div className="mb-4">
          <div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm animate-pulse flex-1">
          <div className="h-8 bg-slate-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-slate-200 rounded w-1/4 mb-12"></div>
          <div className="space-y-3">
            <div className="h-4 bg-slate-200 rounded w-full"></div>
            <div className="h-4 bg-slate-200 rounded w-5/6"></div>
            <div className="h-4 bg-slate-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-[100dvh] gap-4">
        <div className="bg-rose-50 text-rose-700 px-6 py-4 rounded-xl border border-rose-200 text-center font-medium shadow-sm">
          {error}
        </div>
        <Link href="/" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
          &larr; Go back home
        </Link>
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:py-8 h-[100dvh] flex flex-col">
      <Toast message={toastMessage} onClose={() => setToastMessage("")} />

      <div className="mb-4 shrink-0">
        <Link href="/" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors px-3 py-2 -ml-3 rounded-lg hover:bg-slate-100">
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Jobs
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-0 flex-1">
        {/* header section */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-6 bg-slate-50/50 shrink-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1 sm:mb-2 tracking-tight">{job.title}</h1>
            <p className="text-sm text-slate-500 font-medium">
              Posted on {new Date(job.createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
             <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                <label htmlFor="status" className="text-sm font-semibold text-slate-700">Status:</label>
                <StatusBadge 
                  status={job.status} 
                  onChange={handleStatusChange} 
                  disabled={updating} 
                />
             </div>
          </div>
        </div>

        {/* details section */}
        <div className="p-5 sm:p-6 space-y-8 overflow-y-auto flex-1">
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Description</h2>
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{job.description}</p>
            </div>
          </div>

          <div>
             <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Job Details</h2>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-500 mb-1">Category</span>
                  <span className="text-slate-900 font-semibold">{job.category}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-500 mb-1">Location</span>
                  <span className="text-slate-900 font-semibold flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {job.location}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-500 mb-1">Contact Name</span>
                  <span className="text-slate-900 font-semibold">{job.contactName}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-500 mb-1">Contact Email</span>
                  <span className="text-slate-900 font-semibold">
                    <a href={`mailto:${job.contactEmail}`} className="text-blue-600 hover:text-blue-800 hover:underline transition-colors flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {job.contactEmail}
                    </a>
                  </span>
                </div>
             </div>
          </div>
        </div>
        
        {/* footer section */}
        <div className="px-5 sm:px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="cursor-pointer px-5 py-2 bg-white text-rose-600 border border-rose-200 rounded-lg text-sm font-semibold hover:bg-rose-50 hover:border-rose-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-all disabled:opacity-50 shadow-sm"
          >
            {deleting ? "Deleting..." : "Delete Job Request"}
          </button>
        </div>
      </div>
    </div>
  );
}
