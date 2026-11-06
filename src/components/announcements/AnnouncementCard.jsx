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

  const isImportant = !!(announcement.isImportant || announcement.IsImportant);
  const isForAll = !!announcement.isForAllStudents;
  const subjectName = announcement.subjectName || announcement.SubjectName || null;
  const hasCourse = !!(announcement.courseId || announcement.CourseID);

  const accent = isImportant
    ? "bg-red-500"
    : isUnread
    ? "bg-blue-500"
    : "bg-indigo-500";

  return (
    <div
      onClick={() => isUnread && onMarkAsRead && onMarkAsRead(announcement.id)}
      className={`group relative overflow-hidden rounded-xl border bg-white dark:bg-gray-900/70 shadow-sm hover:shadow-md transition-all ${
        isImportant
          ? "border-red-200 dark:border-red-900/60"
          : "border-gray-200 dark:border-gray-700"
      } ${isUnread ? "cursor-pointer ring-1 ring-blue-400/40" : ""}`}
    >
      <span className={`absolute inset-y-0 left-0 w-1.5 ${accent}`} />
      <div className="pl-5 pr-4 py-4 sm:pl-7 sm:pr-6 sm:py-5">
        <div className="flex items-start gap-3">
          <div
            className={`hidden sm:flex shrink-0 items-center justify-center w-10 h-10 rounded-lg ${
              isImportant
                ? "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300"
                : "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
              />
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base sm:text-lg leading-6 font-semibold text-gray-900 dark:text-white break-words">
                    {announcement.title}
                  </h3>
                  {isImportant && (
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

                {/* Audience chips */}
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  {isForAll && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800/60">
                      All students
                    </span>
                  )}
                  {!isForAll && loadingCourse && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Loading course…
                    </span>
                  )}
                  {!isForAll && !loadingCourse && (courseName || hasCourse) && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800/60">
                      Course: {courseName || "Unknown"}
                    </span>
                  )}
                  {!isForAll && subjectName && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800/60">
                      Class: {subjectName}
                    </span>
                  )}
                </div>
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
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

            <div className="mt-3 rounded-lg bg-gray-50 dark:bg-gray-800/70 border border-gray-100 dark:border-gray-700/60 px-3.5 py-3">
              <p className="text-sm text-gray-700 dark:text-gray-200 break-words whitespace-pre-line">
                {announcement.content}
              </p>
            </div>

            {!isTeacher && postDt && (
              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                Posted {postDt.date} · {postDt.time}
              </p>
            )}
          </div>
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
