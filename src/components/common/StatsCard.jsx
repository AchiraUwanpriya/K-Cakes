const StatsCard = ({
  icon,
  title,
  value,
  change,
  valueColor = "text-green-600 dark:text-green-400",
  className = "",
}) => (
  <div
    className={`bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/60 shadow-sm rounded-xl p-3 px-4 min-h-[88px] flex flex-col justify-between hover:shadow-md transition-all duration-200 animated-card w-full ${className}`}
  >
    <div className="flex items-center justify-between">
      <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {title}
      </div>
      <div className="text-lg flex items-center justify-center">{icon}</div>
    </div>
    <div className="mt-2 flex items-baseline justify-between">
      <div className={`text-2xl font-bold ${valueColor}`}>{value}</div>
      {change && (
        <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
          {change}
        </span>
      )}
    </div>
  </div>
);

export default StatsCard;
