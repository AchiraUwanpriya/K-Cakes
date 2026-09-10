const Card = ({ children, className = "", ...props }) => {
  const hasOverflowClass = className.includes("overflow-");
  return (
    <div
      className={`bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/60 shadow-sm rounded-xl hover:shadow-md transition-all duration-200 animated-card w-full ${
        hasOverflowClass ? "" : "overflow-hidden"
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
