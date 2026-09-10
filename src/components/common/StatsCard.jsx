const StatsCard = ({
  icon,
  title,
  value,
  change,
  valueColor = "text-green-600 dark:text-green-400",
  className = "",
}) => (
  <div
    className={`bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/60 shadow-sm rounded-xl p-2.5 sm:p-3 px-3 sm:px-4 min-h-[76px] sm:min-h-[88px] flex flex-col justify-between hover:shadow-md transition-all duration-200 animated-card w-full min-w-0 ${className}`}
  >
    <div className="flex items-center justify-between gap-1.5 min-w-0">
      <div className="text-[10px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide truncate">
        {title}
      </div>
      <div className="text-sm sm:text-lg flex items-center justify-center shrink-0">{icon}</div>
    </div>
    <div className="mt-1 sm:mt-2 flex items-baseline justify-between gap-1 min-w-0">
      <div
        className={`text-sm sm:text-xl md:text-2xl font-bold truncate ${valueColor}`}
        title={typeof value === "string" ? value : undefined}
      >
        {value}
      </div>
      {change && (
        <span className="text-[10px] sm:text-xs font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-1.5 sm:px-2 py-0.5 rounded-full shrink-0">
          {change}
        </span>
      )}
    </div>
  </div>
);

export default StatsCard;
