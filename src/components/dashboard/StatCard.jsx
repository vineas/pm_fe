const StatCard = ({ icon, label, value, status }) => {
  const statusStyles = {
    todo: {
      bg: "bg-red-50",
      text: "text-red-600",
    },
    inprogress: {
      bg: "bg-yellow-50",
      text: "text-yellow-600",
    },
    done: {
      bg: "bg-green-50",
      text: "text-green-600",
    },
    total: {
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
  };

  const style = statusStyles[status] || statusStyles.total;

  return (
    <div className="bg-white rounded-xl shadow p-6 hover:shadow-md transition">
      <div
        className={`w-12 h-12 rounded-lg ${style.bg} ${style.text} flex items-center justify-center mb-3`}
      >
        {icon}
      </div>

      <div className="text-2xl font-bold text-gray-800">
        {value}
      </div>

      <div className="text-sm text-gray-600">
        {label}
      </div>
    </div>
  );
};

export default StatCard;
