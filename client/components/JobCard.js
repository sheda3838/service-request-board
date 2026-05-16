import StatusBadge from "./StatusBadge";
import Link from "next/link"; // Also adding Link here so the card title can be clickable later if desired, but for now just updating the badge

export default function JobCard({ job, onStatusChange }) {
  const { title, description, location, category, status } = job;

  return (
    <div className="bg-white border rounded-lg p-5 shadow-sm hover:shadow-md transition duration-200">
      <div className="flex justify-between items-start gap-4">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <StatusBadge 
          status={status} 
          onChange={onStatusChange ? (e) => onStatusChange(job._id, e.target.value) : undefined} 
        />
      </div>

      <p className="text-gray-600 mt-2">{description}</p>

      <div className="flex flex-wrap items-center gap-3 mt-4 text-sm text-gray-500">
        <span className="font-medium text-gray-700">{location || "N/A"}</span>
        <span className="text-gray-300">•</span>
        <span>{category || "Uncategorized"}</span>
      </div>
    </div>
  );
}
