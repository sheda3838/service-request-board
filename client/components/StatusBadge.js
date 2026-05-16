import { STATUSES } from "@/lib/constants";

//status badges
export default function StatusBadge({ status, onChange, disabled }) {
  //tailwind utility classes depending on status
  const getStatusStyle = (status) => {
    switch (status) {
      case "Open":
        return "text-emerald-700 bg-emerald-100/60 ring-emerald-600/30 border-emerald-200";
      case "In Progress":
        return "text-amber-700 bg-amber-100/60 ring-amber-600/30 border-amber-200";
      case "Closed":
        return "text-rose-700 bg-rose-100/60 ring-rose-600/30 border-rose-200";
      default:
        return "text-slate-700 bg-slate-100/60 ring-slate-600/30 border-slate-200";
    }
  };

  const isInteractive = !!onChange;

  //if an onchange handler is passed we render a fully styled select dropdown instead of just a span
  if (isInteractive) {
    return (
      <select
        value={status}
        onChange={onChange}
        disabled={disabled}
        onClick={(e) => e.stopPropagation()} 
        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset outline-none focus:ring-2 focus:ring-offset-1 focus:ring-slate-400 transition cursor-pointer disabled:opacity-50 appearance-none pr-7 shadow-sm ${getStatusStyle(
          status
        )}`}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 0.35rem center",
          backgroundSize: "1.1em",
        }}
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset whitespace-nowrap shadow-sm ${getStatusStyle(
        status
      )}`}
    >
      {status}
    </span>
  );
}
