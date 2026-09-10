import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import Button from "./Button";
import Modal from "./Modal2";
import Loader from "./Loader";
import UserForm from "../users/UserForm";
import { getAllUsers, createUser } from "../../services/userService";
import { createTeacher } from "../../services/teacherService";
import { FiChevronDown, FiCheck, FiSearch, FiX, FiUser } from "react-icons/fi";

const resolveTeacherId = (candidate) => {
  if (!candidate || typeof candidate !== "object") {
    return "";
  }

  const possible = [
    candidate.teacherId,
    candidate.TeacherID,
    candidate.teacherID,
    candidate.id,
    candidate.Id,
    candidate.userId,
    candidate.UserId,
    candidate.userID,
    candidate.UserID,
  ];

  const found = possible.find((value) => {
    if (value === undefined || value === null) return false;
    const str = String(value).trim();
    return str.length > 0;
  });

  return found !== undefined && found !== null ? String(found).trim() : "";
};

const formatTeacherOption = (user) => {
  if (!user) return null;

  const id = resolveTeacherId(user);
  if (!id) return null;

  const firstName =
    user.firstName ?? user.FirstName ?? user.raw?.FirstName ?? "";
  const lastName = user.lastName ?? user.LastName ?? user.raw?.LastName ?? "";
  const username = user.username ?? user.Username ?? "";

  const labelParts = [
    `${firstName} ${lastName}`.trim(),
    username ? `(${username})` : "",
  ].filter(Boolean);

  return {
    id,
    label: labelParts.length ? labelParts.join(" ") : `Teacher #${id}`,
  };
};

const TeacherPicker = ({
  value,
  onChange,
  onBlur,
  disabled = false,
  placeholder = "Select a teacher",
  allowClear = true,
  showRefresh = true,
  className = "",
}) => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createStep, setCreateStep] = useState(1);
  const [pendingCoreData, setPendingCoreData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  // Close dropdown on click outside or Escape
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


  const normalizedValue = useMemo(() => {
    if (value === undefined || value === null) return "";
    const str = String(value).trim();
    return str;
  }, [value]);

  const fetchTeachers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const users = await getAllUsers();
      const teacherUsers = (users || []).filter((user) => {
        const typeName = String(user?.userType || "").toLowerCase();
        if (typeName === "teacher") return true;

        const typeId = String(
          user?.UserTypeID ?? user?.userTypeID ?? user?.userTypeId ?? ""
        ).trim();
        return typeId === "2"; // 2 == teacher role
      });

      const options = teacherUsers
        .map((user) => {
          const option = formatTeacherOption(user);
          if (!option) return null;
          return {
            ...option,
            raw: user,
          };
        })
        .filter(Boolean)
        .sort((a, b) => a.label.localeCompare(b.label));

      setTeachers(options);
    } catch (err) {
      console.error("Failed to load teachers", err);
      setError(
        err?.message || "Unable to load teachers. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const handleSelectChange = (event) => {
    const nextValue = event.target.value;
    if (!nextValue && allowClear) {
      onChange?.("");
      return;
    }
    onChange?.(nextValue);
  };

  const openModal = () => {
    setIsModalOpen(true);
    setCreateStep(1);
    setPendingCoreData(null);
    setFormError("");
  };

  const closeModal = () => {
    if (isSubmitting) return;
    setIsModalOpen(false);
    setCreateStep(1);
    setPendingCoreData(null);
    setFormError("");
  };

  const handleFormCancel = () => {
    if (isSubmitting) return;
    if (createStep === 2) {
      setCreateStep(1);
      return;
    }
    closeModal();
  };

  const handleTeacherCreated = (option) => {
    setTeachers((prev) => {
      const exists = prev.some((item) => item.id === option.id);
      if (exists) return prev;
      return [...prev, option].sort((a, b) => a.label.localeCompare(b.label));
    });
    onChange?.(option.id);
  };

  const handleTeacherSubmit = async (formData) => {
    if (createStep === 1) {
      setPendingCoreData(formData);
      setCreateStep(2);
      return;
    }

    setIsSubmitting(true);
    setFormError("");
    try {
      const merged = {
        ...(pendingCoreData || {}),
        ...formData,
        UserTypeID: 2,
        IsActive: true,
      };

      if (!merged.Username) {
        throw new Error("Username is required to create a teacher");
      }

      // Ensure new teacher follows the same auto-increment user id logic as Admin > Users flow
      try {
        const existing = await getAllUsers();
        const nums = (existing || []).map((u) => {
          const id = u?.UserID ?? u?.id ?? u?.userID ?? u?.userId ?? 0;
          const n = Number(id);
          return Number.isNaN(n) ? 0 : n;
        });
        const max = nums.length ? Math.max(...nums) : 0;
        const nextId = max + 1;
        // Do not override if provided already
        merged.UserID = merged.UserID ?? nextId;
        merged.userID = merged.userID ?? nextId;
        merged.id = merged.id ?? nextId;
      } catch (genErr) {
        // proceed without injected id if anything fails
        console.warn("Failed to auto-generate next user id:", genErr);
      }

      const createdUser = await createUser(merged);

      // Use the actual id returned by the server for the created user as the authoritative link
      const createdUserId = resolveTeacherId(createdUser);
      const teacherPayload = {
        TeacherID:
          createdUserId ||
          merged.TeacherID ||
          merged.teacherID ||
          merged.teacherId,
        EmployeeID: merged.EmployeeID ?? undefined,
        Department: merged.Department ?? undefined,
        Qualification: merged.Qualification ?? undefined,
        JoiningDate:
          merged.JoiningDate ??
          merged.joiningDate ??
          merged.JoinDate ??
          undefined,
        Bio: merged.Bio ?? undefined,
      };

      // Require joining date when creating a teacher
      const joiningValue =
        merged.JoiningDate ?? merged.joiningDate ?? merged.JoinDate ?? null;
      if (!joiningValue) {
        setFormError("Joining date is required to create a teacher");
        setIsSubmitting(false);
        return;
      }

      const createdTeacher = await createTeacher(
        Object.fromEntries(
          Object.entries(teacherPayload).filter(([, v]) => v !== undefined)
        )
      );

      const teacherId = resolveTeacherId({
        ...createdUser,
        ...createdTeacher,
        TeacherID: createdTeacher?.TeacherID ?? teacherPayload.TeacherID,
      });

      // Purposefully skip course assignment in this flow to avoid triggering updateCourse during teacher creation.

      // Refresh list to include the new teacher.
      await fetchTeachers();

      if (teacherId) {
        const labelOption = formatTeacherOption({
          ...createdUser,
          TeacherID: teacherId,
        }) || {
          id: teacherId,
          label: `Teacher #${teacherId}`,
        };
        handleTeacherCreated(labelOption);
      }

      // Persist newly created teacher selection so downstream flows (like
      // Assign Courses) can pick up the created teacher automatically.
      try {
        const persisted = {
          id: String(teacherId || createdUser?.UserID || createdUser?.id || ""),
          name:
            (createdUser?.FirstName || createdUser?.firstName || "") +
            (createdUser?.LastName || createdUser?.lastName
              ? ` ${createdUser?.LastName || createdUser?.lastName}`
              : ""),
        };
        if (persisted.id) {
          window.localStorage.setItem(
            "selected_teacher_for_course",
            JSON.stringify(persisted)
          );
        }
      } catch (e) {
        // ignore localStorage failures
      }

      setIsSubmitting(false);
      closeModal();
    } catch (err) {
      console.error("Failed to create teacher", err);
      setFormError(err?.message || "Failed to create teacher. Please retry.");
      setIsSubmitting(false);
    }
  };

  const optionList = useMemo(() => {
    if (!teachers || !teachers.length) return [];
    return [...teachers].sort((a, b) => a.label.localeCompare(b.label));
  }, [teachers]);

  const selectedOption = useMemo(() => {
    if (!normalizedValue) return null;
    return (
      optionList.find((opt) => String(opt.id) === String(normalizedValue)) ||
      null
    );
  }, [optionList, normalizedValue]);

  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return optionList;
    const q = searchQuery.toLowerCase();
    return optionList.filter((opt) => opt.label.toLowerCase().includes(q));
  }, [optionList, searchQuery]);

  const displayLabel = useMemo(() => {
    if (selectedOption) return selectedOption.label;
    if (normalizedValue) return `Teacher #${normalizedValue}`;
    return placeholder;
  }, [selectedOption, normalizedValue, placeholder]);

  const handleSelectOption = (optionId) => {
    onChange?.(optionId);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange?.("");
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full min-w-0">
        <div className="relative flex-1 min-w-0 w-full" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => !disabled && !loading && setIsOpen((prev) => !prev)}
            onBlur={onBlur}
            disabled={disabled || loading || !!error}
            className={`w-full min-w-0 flex items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2.5 sm:py-2 text-sm text-left shadow-sm transition hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 ${
              disabled || loading || !!error
                ? "opacity-60 cursor-not-allowed"
                : "cursor-pointer"
            } ${className}`}
          >
            <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
              <FiUser className="w-4 h-4 flex-shrink-0 text-gray-400 dark:text-gray-500" />
              <span
                className={`truncate block text-sm ${
                  selectedOption || normalizedValue
                    ? "text-gray-900 dark:text-gray-100 font-medium"
                    : "text-gray-400 dark:text-gray-500"
                }`}
              >
                {displayLabel}
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {allowClear && normalizedValue && !disabled && !loading && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={handleClear}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleClear(e);
                    }
                  }}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
                  title="Clear selection"
                >
                  <FiX className="w-3.5 h-3.5" />
                </span>
              )}
              <FiChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                  isOpen ? "rotate-180 text-indigo-600 dark:text-indigo-400" : ""
                }`}
              />
            </div>
          </button>

          {isOpen && !disabled && !loading && (
            <div className="absolute left-0 right-0 top-full mt-1.5 z-50 w-full min-w-0 rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
              <div className="p-2 border-b border-gray-100 dark:border-gray-700/60 bg-gray-50/50 dark:bg-gray-800/50">
                <div className="relative w-full">
                  <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search teacher..."
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

              <div className="max-h-56 sm:max-h-60 overflow-y-auto p-1 divide-y divide-gray-50 dark:divide-gray-800/40 custom-scrollbar">
                {allowClear && (
                  <button
                    type="button"
                    onClick={() => handleSelectOption("")}
                    className={`w-full text-left px-3 py-2 text-xs sm:text-sm rounded-lg transition flex items-center justify-between ${
                      !normalizedValue
                        ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 font-medium"
                        : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/60"
                    }`}
                  >
                    <span className="italic">{placeholder}</span>
                    {!normalizedValue && (
                      <FiCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                    )}
                  </button>
                )}

                {filteredOptions.length === 0 ? (
                  <div className="py-6 text-center text-xs sm:text-sm text-gray-400 dark:text-gray-500">
                    No teachers found
                  </div>
                ) : (
                  filteredOptions.map((option) => {
                    const isSelected =
                      String(option.id) === String(normalizedValue);
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handleSelectOption(option.id)}
                        className={`w-full text-left px-3 py-2 text-xs sm:text-sm rounded-lg transition flex items-center justify-between gap-2 ${
                          isSelected
                            ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 font-semibold"
                            : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700/60"
                        }`}
                      >
                        <span className="truncate flex-1">{option.label}</span>
                        {isSelected && (
                          <FiCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0 ml-1.5" />
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
          <Button
            type="button"
            variant="secondary"
            onClick={openModal}
            disabled={disabled || loading}
            className="flex-1 sm:flex-initial h-10 justify-center sm:w-auto text-xs sm:text-sm"
          >
            +New
          </Button>
          {showRefresh && (
            <button
              type="button"
              onClick={fetchTeachers}
              disabled={loading}
              className="flex-1 sm:flex-initial h-10 rounded-lg border border-transparent bg-indigo-50 px-3 py-2 text-xs sm:text-sm font-medium text-indigo-600 shadow-sm transition hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 dark:bg-indigo-900/30 dark:text-indigo-200 dark:hover:bg-indigo-900/50"
            >
              Refresh
            </button>
          )}
        </div>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Loader size="sm" />
          <span>Loading teachers...</span>
        </div>
      )}

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
          <div className="flex items-center justify-between gap-2">
            <span>{error}</span>
            <button
              type="button"
              onClick={fetchTeachers}
              className="text-sm font-medium text-indigo-600 hover:underline"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={createStep === 1 ? "Add Teacher" : "Teacher Details"}
        size="lg"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>Step {createStep} of 2</span>
            {createStep === 2 && (
              <button
                type="button"
                onClick={() => setCreateStep(1)}
                className="text-indigo-600 hover:underline"
              >
                Back to account
              </button>
            )}
          </div>

          {formError && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
              {formError}
            </div>
          )}

          <UserForm
            onSubmit={handleTeacherSubmit}
            loading={isSubmitting}
            userTypes={[{ id: 2, name: "Teacher" }]}
            forceUserType={2}
            onCancel={handleFormCancel}
            showCoreFields={createStep === 1}
            showRoleFields={createStep === 2}
            submitLabel={
              createStep === 1
                ? "Next"
                : isSubmitting
                ? "Creating..."
                : "Create Teacher"
            }
          />
        </div>
      </Modal>
    </div>
  );
};

export default TeacherPicker;
