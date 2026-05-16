"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createJob } from "@/services/jobService";
import { CATEGORIES } from "@/lib/constants";
import Link from "next/link";

// handles the creation of new job requests
export default function NewJobPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    contactName: "",
    contactEmail: "",
  });
  const [customCategory, setCustomCategory] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const PREDEFINED_CATEGORIES = [...CATEGORIES, "Other"];

  // handles all of our standard text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // basic client side validation before bothering the server
  const validate = () => {
    if (!formData.title.trim()) return "Title is required.";
    if (!formData.description.trim()) return "Description is required.";
    if (!formData.category) return "Category is required.";
    if (formData.category === "Other" && !customCategory.trim())
      return "Category is required.";
    if (!formData.location.trim()) return "Location is required.";
    if (!formData.contactName.trim()) return "Contact Name is required.";
    if (!formData.contactEmail.trim()) return "Contact Email is required.";
    if (formData.category !== "Other") setCustomCategory("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.contactEmail)) return "Invalid email format.";

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    // if user chose other we need to get a custom categroy they are looking for
    const finalCategory =
      formData.category === "Other" ? customCategory.trim() : formData.category;

    const jobPayload = {
      ...formData,
      category: finalCategory,
    };

    try {
      setLoading(true);
      await createJob(jobPayload);
      
      // sends a success message
      sessionStorage.setItem(
        "successMessage",
        "Job request created successfully!",
      );
      router.push("/");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to create job request. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/"
          className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Post a Job Request
        </h1>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/*title*/}
            <div className="md:col-span-2">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Job Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Fix leaking kitchen pipe"
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition"
              />
            </div>

            {/* description */}
            <div className="md:col-span-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Describe the issue or required work in detail..."
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition resize-y"
              ></textarea>
            </div>

            {/* category */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition appearance-none"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 1rem center",
                  backgroundSize: "1em",
                }}
              >
                <option value="">Select a category</option>
                {PREDEFINED_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* custom category */}
            {formData.category === "Other" && (
              <div>
                <label
                  htmlFor="customCategory"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Specify Category *
                </label>
                <input
                  type="text"
                  id="customCategory"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="e.g. Carpentry"
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition"
                />
              </div>
            )}

            {/* location */}
            <div
              className={
                formData.category === "Other"
                  ? "md:col-span-2"
                  : "md:col-span-1"
              }
            >
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. New York, NY"
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition"
              />
            </div>

            {/* contact name */}
            <div>
              <label
                htmlFor="contactName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Contact Name *
              </label>
              <input
                type="text"
                id="contactName"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                placeholder="Your full name"
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition"
              />
            </div>

            {/* contact email */}
            <div>
              <label
                htmlFor="contactEmail"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Contact Email *
              </label>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition"
              />
            </div>
          </div>

          <div className="flex justify-end pt-8 border-t border-slate-100">
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer px-6 py-2.5 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {loading ? "Submitting..." : "Post Job Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
