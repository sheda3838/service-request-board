import StatusBadge from "./StatusBadge";
import Link from "next/link";

// represents a single job request card displayed on the home page grid
export default function JobCard({ job, onStatusChange }) {
  const { _id, title, description, location, category, status } = job;

  // gives a similar bg for card to match with status
  const getCardBg = (status) => {
    switch (status) {
      case "Open":
        return "bg-emerald-50/30 hover:bg-emerald-50/60 border-emerald-100/60";
      case "In Progress":
        return "bg-amber-50/30 hover:bg-amber-50/60 border-amber-100/60";
      case "Closed":
        return "bg-rose-50/30 hover:bg-rose-50/60 border-rose-100/60";
      default:
        return "bg-white hover:bg-slate-50 border-slate-200";
    }
  };

  return (
    <div className={`group relative flex flex-col h-full border rounded-2xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300 ease-out focus-within:ring-2 focus-within:ring-slate-400 focus-within:ring-offset-2 ${getCardBg(status)}`}>
      {/* using an absolute inset link to cover the entire card so its clickable without breaking nested interactive elements */}
      <Link 
        href={`/job/${_id}`} 
        className="absolute inset-0 z-0 rounded-2xl focus:outline-none"
        aria-label={`View details for ${title}`}
      />
      
      <div className="flex justify-between items-start mb-3">
        <div className="shrink-0 relative z-10">
          <StatusBadge 
            status={status} 
            onChange={onStatusChange ? (e) => onStatusChange(_id, e.target.value) : undefined} 
          />
        </div>
      </div>

      <h2 className="text-lg font-bold text-slate-900 transition-colors line-clamp-2 mb-2 leading-tight relative z-10 pointer-events-none">
        {title}
      </h2>

      <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-5 flex-grow relative z-10 pointer-events-none">
        {description}
      </p>

      <div className="flex items-center gap-4 mt-auto pt-4 border-t border-slate-200/60 text-xs text-slate-500 relative z-10 pointer-events-none">
        <span className="flex items-center gap-1.5 font-medium text-slate-700 truncate min-w-0">
          <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{location || "N/A"}</span>
        </span>
        <span className="flex items-center gap-1.5 truncate min-w-0">
          <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <span className="truncate">{category || "Uncategorized"}</span>
        </span>
      </div>
    </div>
  );
}
