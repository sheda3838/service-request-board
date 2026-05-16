"use client";

import { useEffect, useState } from "react";
import { getJobs, updateJobStatus } from "@/services/jobService";
import JobCard from "@/components/JobCard";
import Link from "next/link";
import { CATEGORIES, STATUSES } from "@/lib/constants";
import Toast from "@/components/Toast";

//dashboard to view all job requests
export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  //handles fetching jobs from our backend api and supports our query filters
  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (categoryFilter) params.category = categoryFilter;
      if (statusFilter) params.status = statusFilter;

      const res = await getJobs(params);
      setJobs(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch jobs.");
    } finally {
      setLoading(false);
    }
  };

  //we use this effect to grab any success messages that were passed through session storage from other pages (like after creating a job)
  useEffect(() => {
    const msg = sessionStorage.getItem("successMessage");
    if (msg) {
      setToastMessage(msg);
      sessionStorage.removeItem("successMessage");
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchJobs();
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery, categoryFilter, statusFilter]);

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      await updateJobStatus(jobId, newStatus);
      
      setToastMessage("Status updated successfully!");

      //if user changed any status by applying filters
      if (statusFilter && statusFilter !== newStatus) {
        setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
      } else {
        setJobs((prevJobs) =>
          prevJobs.map((job) =>
            job._id === jobId ? { ...job, status: newStatus } : job
          )
        );
      }
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update status.");
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <Toast message={toastMessage} onClose={() => setToastMessage("")} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Service Requests</h1>
        <Link 
          href="/new" 
          className="inline-flex items-center justify-center px-4 py-2.5 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 shrink-0 shadow-sm"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          New Job Request
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 mb-8 p-4 bg-slate-50 border border-slate-200 rounded-xl shadow-sm">
        <div className="w-full sm:w-1/3 relative">
          <label htmlFor="searchQuery" className="sr-only">Search</label>
          <input
            type="text"
            id="searchQuery"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search jobs..."
            className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition shadow-sm text-slate-700 font-medium placeholder-slate-400"
          />
        </div>

        <div className="w-full sm:w-1/3 relative">
          <label htmlFor="categoryFilter" className="sr-only">Filter by Category</label>
          <select
            id="categoryFilter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition appearance-none cursor-pointer shadow-sm text-slate-700 font-medium"
            style={{
              backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 1rem center",
              backgroundSize: "1.2em",
            }}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="w-full sm:w-1/3 relative">
          <label htmlFor="statusFilter" className="sr-only">Filter by Status</label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition appearance-none cursor-pointer shadow-sm text-slate-700 font-medium"
            style={{
              backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 1rem center",
              backgroundSize: "1.2em",
            }}
          >
            <option value="">All Statuses</option>
            {STATUSES.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white border border-slate-100 rounded-xl p-5 shadow-sm">
              <div className="flex justify-between items-start gap-4">
                <div className="h-5 bg-slate-200 rounded w-1/3"></div>
                <div className="h-7 bg-slate-200 rounded-full w-24"></div>
              </div>
              <div className="h-4 bg-slate-200 rounded w-full mt-5"></div>
              <div className="h-4 bg-slate-200 rounded w-2/3 mt-2"></div>
              <div className="flex gap-4 mt-6">
                <div className="h-4 bg-slate-200 rounded w-24"></div>
                <div className="h-4 bg-slate-200 rounded w-24"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="py-12 flex justify-center items-center">
          <div className="bg-rose-50 text-rose-700 px-6 py-4 rounded-xl border border-rose-200 text-center font-medium shadow-sm">
            {error}
          </div>
        </div>
      ) : jobs.length === 0 ? (
        <div className="py-20 px-6 flex flex-col items-center justify-center text-center bg-white border border-dashed border-slate-300 rounded-2xl shadow-sm">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-5 border border-slate-100 shadow-sm">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-slate-900 text-lg font-bold mb-2 tracking-tight">
            {(searchQuery || categoryFilter || statusFilter) 
              ? "No matching requests found" 
              : "No service requests yet"}
          </h3>
          <p className="text-slate-500 max-w-sm mx-auto mb-6">
            {(searchQuery || categoryFilter || statusFilter)
              ? "Try adjusting your filters or clear them to see all available jobs in the system."
              : "Get started by creating a new service request. It takes just a minute!"}
          </p>
          {(searchQuery || categoryFilter || statusFilter) ? (
            <button 
              onClick={() => { setSearchQuery(""); setCategoryFilter(""); setStatusFilter(""); }}
              className="text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg px-5 py-2.5 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1 shadow-sm"
            >
              Clear all filters
            </button>
          ) : (
            <Link 
              href="/new"
              className="text-sm font-semibold text-white bg-slate-900 rounded-lg px-5 py-2.5 hover:bg-slate-800 transition-colors shadow-sm"
            >
              Create First Request
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
