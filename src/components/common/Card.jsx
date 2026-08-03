const Card = ({ children, className = "", ...props }) => {
  const hasOverflowClass = className.includes("overflow-");
  return (
    <div
      className={`bg-white dark:bg-gray-800 ${hasOverflowClass ? "" : "overflow-hidden"} shadow rounded-lg hover-lift soft-shadow animated-card w-full ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
