// One shared Active / Inactive tab style used on every admin list page.
const StatusTabs = ({ tabs, active, onChange, className = "" }) => (
  <div
    role="tablist"
    className={`inline-flex max-w-full gap-1 overflow-x-auto rounded-xl bg-gray-100 dark:bg-gray-700/50 p-1 ${className}`}
  >
    {tabs.map((tab) => {
      const isActive = active === tab.id;
      return (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={isActive}
          onClick={() => onChange(tab.id)}
          className={`flex flex-shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
            isActive
              ? "bg-white text-indigo-600 shadow-sm dark:bg-gray-900 dark:text-indigo-300"
              : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          }`}
        >
          {tab.dot && (
            <span className={`h-1.5 w-1.5 rounded-full ${tab.dot}`}></span>
          )}
          <span>{tab.label}</span>
          {tab.count !== undefined && (
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                isActive
                  ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
                  : "bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-200"
              }`}
            >
              {tab.count}
            </span>
          )}
        </button>
      );
    })}
  </div>
);

export default StatusTabs;