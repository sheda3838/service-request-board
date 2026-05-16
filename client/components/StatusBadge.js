import { STATUSES } from "@/lib/constants";

export default function StatusBadge({ status, onChange, disabled }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "Open":
        return "text-green-700 bg-green-50 ring-green-600/20 border-green-200";
      case "In Progress":
        return "text-yellow-700 bg-yellow-50 ring-yellow-600/20 border-yellow-200";
      case "Closed":
        return "text-red-700 bg-red-50 ring-red-600/20 border-red-200";
      default:
        return "text-gray-700 bg-gray-50 ring-gray-600/20 border-gray-200";
    }
  };

  const isInteractive = !!onChange;

  if (isInteractive) {
    return (
      <select
        value={status}
        onChange={onChange}
        disabled={disabled}
        className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset outline-none focus:ring-2 focus:ring-offset-1 transition cursor-pointer disabled:opacity-50 appearance-none pr-6 ${getStatusColor(
          status
        )}`}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 0.25rem center",
          backgroundSize: "1em",
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
      className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset whitespace-nowrap ${getStatusColor(
        status
      )}`}
    >
      {status}
    </span>
  );
}
