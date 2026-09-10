import React from "react";
import { createPortal } from "react-dom";

const sizeClasses = {
  xs: "max-w-xs",
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
  "7xl": "max-w-7xl",
  full: "max-w-full",
};

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  contentClassName = "bg-blue-50 dark:bg-gray-800 p-3 sm:p-4 rounded-lg",
  ariaLabel,
}) => {
  if (!isOpen) return null;

  const widthClass =
    sizeClasses[size] ||
    (typeof size === "string" && size.startsWith("max-w-")
      ? size
      : sizeClasses.md);
  const showTitle = title !== null && title !== undefined && title !== "";
  const computedAriaLabel = showTitle ? undefined : ariaLabel || "Dialog";

  const modal = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 fade-in overflow-x-hidden">
      <div
        className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={computedAriaLabel}
        className={`relative bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-3.5 sm:p-6 ${widthClass} w-full shadow-xl ring-1 ring-gray-200 dark:ring-0 scale-in soft-shadow-md max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-3rem)] overflow-y-auto custom-scrollbar`}
      >
        <div
          className={`flex items-start gap-3 ${
            showTitle ? "justify-between mb-3 sm:mb-4" : "justify-end mb-2"
          }`}
        >
          {showTitle ? (
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate mr-2">
              {title}
            </h2>
          ) : null}
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white rounded-full p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex-shrink-0 transition-colors"
            aria-label="Close dialog"
          >
            <span className="text-xl leading-none">&times;</span>
          </button>
        </div>
        <div className="text-gray-900 dark:text-white min-w-0">
          {/* content wrapper gives form inputs a subtle off-white background in light mode
              so inputs and borders are visible against the modal surface */}
          <div className={`${contentClassName} min-w-0`}>{children}</div>
        </div>
      </div>
    </div>
  );

  // render modal into document body so nested modals stack correctly
  if (typeof document !== "undefined") {
    return createPortal(modal, document.body);
  }

  // fallback for environments without document
  return modal;
};

export default Modal;
