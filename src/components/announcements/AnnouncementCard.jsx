import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getCourseDetails } from "../../services/courseService";

const splitDateTime = (dateString) => {
  if (!dateString) return null;
  if (typeof dateString === "string") {
    const trimmed = dateString.trim();
    const match = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
    if (match) {
      const [, yyyy, mm, dd, hhStr, minStr] = match;
      let hours = parseInt(hhStr, 10);
      const minutes = minStr;
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      const formattedHours = String(hours).padStart(2, "0");
      return {
        date: `${yyyy} / ${mm} / ${dd}`,
        time: `${formattedHours}:${minutes} ${ampm}`,
      };
    }
  }
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return null;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const formattedHours = String(hours).padStart(2, "0");
  return {
    date: `${yyyy} / ${mm} / ${dd}`,
    time: `${formattedHours}:${minutes} ${ampm}`,
  };
};

const AnnouncementCard = ({
  announcement,
  isUnread,
  onMarkAsRead,
  onEdit,
  showDates,
}) => {
  const { user } = useAuth();
  const [courseName, setCourseName] = useState(null);
  const [loadingCourse, setLoadingCourse] = useState(false);

  const isTeacher = (() => {
    if (typeof showDates === "boolean") return showDates;
    if (onEdit) return true;
    if (!user) return false;
    const ut = (user?.userType || user?.UserType || user?.role || "")
      .toString()
      .toLowerCase();
    return (
      ut === "teacher" || user?.userTypeID === 2 || user?.UserTypeID === 2
    );
  })();

  useEffect(() => {
    let mounted = true;

    const resolveFromRaw = (raw) => {
      if (!raw || typeof raw !== "object") return null;
      const coursePayload =
        raw.Course ||
        raw.course ||
        raw.CourseDetails ||
        raw.courseDetails ||
        null;
      if (!coursePayload) return null;
      return (
        coursePayload.name ??
        coursePayload.CourseName ??
        coursePayload.courseName ??
        coursePayload.Title ??
        coursePayload.title ??
        null
      );
    };

    const load = async () => {
      if (!announcement) return;

      // Try to resolve directly from announcement payload (avoid extra network call)
      const directName =
        announcement.name ??
        announcement.courseName ??
        announcement.CourseName ??
        resolveFromRaw(announcement.raw) ??
        resolveFromRaw(announcement);

      if (directName) {
        setCourseName(directName);
        return;
      }

      const id =
        announcement.courseId ??
        announcement.CourseID ??
        announcement.courseID ??
        announcement.courseId ??
        null;

      if (!id) return;

      setLoadingCourse(true);
      try {
        const course = await getCourseDetails(id);
        if (!mounted) return;
        const name =
          course?.name ?? course?.CourseName ?? course?.courseName ?? "";
        if (name) setCourseName(name);
      } catch (err) {
        // ignore errors and leave courseName null
        console.warn("Failed to load course details for announcement", err);
      } finally {
        if (mounted) setLoadingCourse(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [announcement]);

  const postDateVal =
    announcement.raw?.postDate ??
    announcement.raw?.PostDate ??
    announcement.postDate ??
    announcement.PostDate;

  const expiryDateVal =
    announcement.raw?.expiryDate ??
    announcement.raw?.ExpiryDate ??
    announcement.expiryDate ??
    announcement.ExpiryDate;

  const postDt = splitDateTime(postDateVal);
  const expiryDt = splitDateTime(expiryDateVal);

  return (
    <div 
      onClick={() => isUnread && onMarkAsRead && onMarkAsRead(announcement.id)}
      className={`bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg transition-all ${
        isUnread 
          ? "border-l-4 border-blue-500 bg-blue-50/10 dark:bg-blue-900/10 cursor-pointer hover:bg-blue-50/20 dark:hover:bg-blue-900/20" 
          : ""
      }`}
    >
      <div className="px-4 py-5 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white break-words">
                {announcement.title}
              </h3>
              {(announcement.isImportant || announcement.IsImportant) && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200">
                  Important
                </span>
              )}
              {isUnread && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 animate-pulse">
                  New
                </span>
              )}
            </div>
            {loadingCourse ? (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Loading course…
              </p>
            ) : courseName ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Course: {courseName}
              </p>
            ) : announcement.courseId || announcement.CourseID ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Course: Unknown
              </p>
            ) : null}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {onEdit && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(announcement);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 dark:text-indigo-300 dark:bg-indigo-900/40 dark:hover:bg-indigo-900/60 rounded-md border border-indigo-200 dark:border-indigo-800 transition-colors shadow-sm cursor-pointer"
                title="Edit notice"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit
              </button>
            )}
          </div>
        </div>

        <div className="mt-3">
          <p className="text-sm text-gray-600 dark:text-gray-300 break-words whitespace-pre-line">
            {announcement.content}
          </p>
        </div>

        {isTeacher && (
          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/60 flex flex-wrap items-center justify-between gap-y-3 gap-x-6 text-xs">
            {/* Post Date */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 font-medium text-gray-700 dark:text-gray-300">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Post Date:</span>
              </div>
              {postDt ? (
                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs">
                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700/70 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 font-mono">
                    {postDt.date}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800/60 font-mono">
                    <svg className="w-3 h-3 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {postDt.time}
                  </span>
                </div>
              ) : (
                <span className="text-gray-400">N/A</span>
              )}
            </div>

            {/* Expiry Date */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 font-medium text-gray-700 dark:text-gray-300">
                <span className={`inline-block w-2 h-2 rounded-full ${expiryDt ? "bg-amber-500" : "bg-gray-400"}`}></span>
                <span>Expiry Date:</span>
              </div>
              {expiryDt ? (
                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs">
                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700/70 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 font-mono">
                    {expiryDt.date}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 font-semibold border border-amber-200 dark:border-amber-800/60 font-mono">
                    <svg className="w-3 h-3 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {expiryDt.time}
                  </span>
                </div>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[11px]">
                  No Expiry
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementCard;
