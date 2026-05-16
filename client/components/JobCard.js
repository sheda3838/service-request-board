export default function JobCard({ job }) {
  const { title, description, location, category, status } = job;

  const getStatusColor = (status) => {
    switch (status) {
      case "Open":
        return "text-green-700 bg-green-50 ring-green-600/20";
      case "In Progress":
        return "text-yellow-700 bg-yellow-50 ring-yellow-600/20";
      default:
        return "text-red-700 bg-red-50 ring-red-600/20";
    }
  };

  return (
    <div className="bg-white border rounded-lg p-5 shadow-sm hover:shadow-md transition duration-200">
      <div className="flex justify-between items-start gap-4">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <span
          className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset whitespace-nowrap ${getStatusColor(
            status
          )}`}
        >
          {status}
        </span>
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
