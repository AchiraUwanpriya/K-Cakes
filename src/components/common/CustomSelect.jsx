import React, { useState, useRef, useEffect, useMemo } from "react";
import { FiChevronDown, FiSearch, FiCheck, FiX } from "react-icons/fi";

const CustomSelect = ({
  value,
  onChange,
  options = [],
  placeholder = "-- Select --",
  disabled = false,
  searchable = true,
  searchPlaceholder = "Search...",
  error = false,
  className = "",
  name,
  renderOption,
  renderSelected,
  icon,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  // Normalize options array into { value, label } format
  const normalizedOptions = useMemo(() => {
    return (options || []).map((opt) => {
      if (opt && typeof opt === "object") {
        const val =
          opt.value !== undefined
            ? opt.value
            : opt.id !== undefined
            ? opt.id
            : "";
        const label =
          opt.label !== undefined
            ? opt.label
            : opt.name !== undefined
            ? opt.name
            : opt.title !== undefined
            ? opt.title
            : String(val);
        return {
          ...opt,
          value: String(val),
          label: String(label),
          raw: opt,
        };
      }
      return {
        value: String(opt),
        label: String(opt),
        raw: opt,
      };
    });
  }, [options]);

  const selectedOption = useMemo(() => {
    if (value === undefined || value === null || value === "") return null;
    return (
      normalizedOptions.find((opt) => String(opt.value) === String(value)) ||
      null
    );
  }, [normalizedOptions, value]);

  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return normalizedOptions;
    const q = searchQuery.toLowerCase();
    return normalizedOptions.filter((opt) =>
      opt.label.toLowerCase().includes(q)
    );
  }, [normalizedOptions, searchQuery]);

  // Click outside and Escape key handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (val) => {
    onChange?.(val);
    setIsOpen(false);
    setSearchQuery("");
  };

  const isInvalid = Boolean(error);

  return (
    <div className="relative w-full min-w-0 max-w-full" ref={dropdownRef}>
      {/* Hidden input for form integration if name is passed */}
      {name && (
        <input
          type="hidden"
          name={name}
          value={value !== undefined && value !== null ? value : ""}
        />
      )}

      <button
        type="button"
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        disabled={disabled}
        className={`w-full min-w-0 max-w-full flex items-center justify-between gap-2 rounded-lg border bg-white px-3 py-2.5 sm:py-2 text-left text-sm shadow-sm transition focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-gray-100 ${
          isInvalid
            ? "border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500"
            : "border-gray-300 hover:border-gray-400 focus:border-indigo-500 focus:ring-indigo-500/20 dark:border-gray-600 dark:hover:border-gray-500"
        } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"} ${className}`}
      >
        <div className="truncate min-w-0 flex-1">
          {renderSelected && selectedOption ? (
            renderSelected(selectedOption)
          ) : (
            <span
              className={`truncate block ${
                selectedOption
                  ? "text-gray-900 dark:text-gray-100 font-medium"
                  : "text-gray-400 dark:text-gray-400"
              }`}
            >
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {icon && <span className="text-sm shrink-0">{icon}</span>}
          <FiChevronDown
            className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${
              isOpen ? "rotate-180 text-indigo-600 dark:text-indigo-400" : ""
            }`}
          />
        </div>
      </button>

      {isOpen && !disabled && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 w-full min-w-0 max-w-full rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
          {searchable && normalizedOptions.length > 5 && (
            <div className="p-2 border-b border-gray-100 dark:border-gray-700/60 bg-gray-50/50 dark:bg-gray-800/50">
              <div className="relative w-full">
                <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full pl-8 pr-7 py-1.5 text-xs sm:text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <FiX className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="max-h-56 sm:max-h-60 overflow-y-auto p-1 divide-y divide-gray-50 dark:divide-gray-800/40 custom-scrollbar">
            {placeholder && (
              <button
                type="button"
                onClick={() => handleSelect("")}
                className={`w-full min-w-0 max-w-full text-left px-3 py-2 text-xs sm:text-sm rounded-lg transition flex items-center justify-between ${
                  !value
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 font-medium"
                    : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700/60"
                }`}
              >
                <span className="italic truncate min-w-0">{placeholder}</span>
                {!value && (
                  <FiCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 ml-1.5" />
                )}
              </button>
            )}

            {filteredOptions.length === 0 ? (
              <div className="py-5 text-center text-xs sm:text-sm text-gray-400 dark:text-gray-500">
                No options found
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = String(opt.value) === String(value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={`w-full min-w-0 max-w-full text-left px-3 py-2 text-xs sm:text-sm rounded-lg transition flex items-center justify-between gap-2 ${
                      isSelected
                        ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 font-semibold"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700/60"
                    }`}
                  >
                    {renderOption ? (
                      renderOption(opt, isSelected)
                    ) : (
                      <span className="truncate flex-1 min-w-0">{opt.label}</span>
                    )}
                    {isSelected && (
                      <FiCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 ml-1.5" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
