import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getCourseDetails } from "../../services/courseService";
import { getAttendanceByStudentAndSchedule } from "../../services/attendanceService";
import { getAllClassSchedules } from "../../services/classScheduleService";
import { getEnrollmentsByStudent } from "../../services/enrollmentService";
import AttendanceList from "../../components/attendance/AttendanceList";
import EmptyState from "../../components/common/EmptyState";
import Loader from "../../components/common/Loader";
import StudentQRPass from "../../components/attendance/StudentQRPass";
import CustomSelect from "../../components/common/CustomSelect";

const StudentAttendance = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [schedules, setSchedules] = useState([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [loadingSchedules, setLoadingSchedules] = useState(false);

  // Get student ID from user context
  const getStudentId = () => {
    return (
      user?.StudentID ??
      user?.studentID ??
      user?.studentId ??
      user?.UserID ??
      user?.userID ??
      user?.userId ??
      user?.id
    );
  };

  // Fetch schedules for enrolled courses
  useEffect(() => {
    const fetchEnrolledSchedules = async () => {
      setLoadingSchedules(true);
      try {
        const studentId = getStudentId();
        if (!studentId) {
          console.warn("No student ID found");
          setLoadingSchedules(false);
          return;
        }

        // Get student's enrollments
        const enrollments = await getEnrollmentsByStudent(studentId);

        if (!enrollments || enrollments.length === 0) {
          console.warn("No enrollments found for student");
          setSchedules([]);
          setLoadingSchedules(false);
          return;
        }

        // Get all schedules
        const allSchedules = await getAllClassSchedules();

        // Filter schedules that belong to enrolled courses/subjects
        const enrolledCourseIds = enrollments
          .map((e) => e.CourseID ?? e.courseID ?? e.courseId)
          .filter(Boolean);

        const enrolledSubjectIds = enrollments
          .map((e) => e.SubjectID ?? e.subjectID ?? e.subjectId)
          .filter(Boolean);

        const filteredSchedules = allSchedules.filter((schedule) => {
          const scheduleCourseId =
            schedule.CourseID ?? schedule.courseID ?? schedule.courseId;
          const scheduleSubjectId =
            schedule.SubjectID ?? schedule.subjectID ?? schedule.subjectId;

          return (
            enrolledCourseIds.includes(scheduleCourseId) ||
            enrolledSubjectIds.includes(scheduleSubjectId)
          );
        });

        setSchedules(filteredSchedules);

        // Auto-select first schedule if available
        if (filteredSchedules.length > 0 && !selectedScheduleId) {
          const firstScheduleId =
            filteredSchedules[0].ScheduleID ??
            filteredSchedules[0].scheduleID ??
            filteredSchedules[0].scheduleId ??
            filteredSchedules[0].id;
          setSelectedScheduleId(firstScheduleId);
        }
      } catch (error) {
        console.error("Error fetching enrolled schedules:", error);
        setSchedules([]);
      } finally {
        setLoadingSchedules(false);
      }
    };

    fetchEnrolledSchedules();
  }, [user]);

  // Fetch attendance when schedule is selected
  useEffect(() => {
    const fetchAttendanceData = async () => {
      if (!selectedScheduleId) {
        setAttendance([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const studentId = getStudentId();
        if (!studentId) {
          console.warn("No student ID found");
          setAttendance([]);
          setLoading(false);
          return;
        }

        // Fetch attendance using the new API
        const attendanceData = await getAttendanceByStudentAndSchedule(
          selectedScheduleId,
          studentId
        );

        setAttendance(attendanceData || []);
      } catch (error) {
        console.error("Error fetching attendance:", error);
        setAttendance([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [selectedScheduleId, user]);

  // Fetch course details if id is provided (legacy support)
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        if (id) {
          const courseData = await getCourseDetails(id);
          setCourse(courseData);
        }
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };

    fetchCourseData();
  }, [id]);

  // Helper function to build options for CustomSelect
  const scheduleOptions = useMemo(() => {
    return schedules.map((schedule) => {
      const scheduleId =
        schedule.ScheduleID ??
        schedule.scheduleID ??
        schedule.scheduleId ??
        schedule.id;

      const courseName =
        schedule.CourseName ??
        schedule.courseName ??
        schedule.Course?.CourseName ??
        "Unknown Course";

      const className =
        schedule.ClassName ??
        schedule.className ??
        schedule.Class?.ClassName ??
        schedule.RoomNumber ??
        schedule.roomNumber ??
        "";

      const subjectName =
        schedule.SubjectName ??
        schedule.subjectName ??
        schedule.Subject?.SubjectName ??
        "";

      const classDate =
        schedule.ClassDate ??
        schedule.classDate ??
        schedule.Date ??
        schedule.date ??
        "";

      const startTime = schedule.StartTime ?? schedule.startTime ?? "";
      const endTime = schedule.EndTime ?? schedule.endTime ?? "";

      const formatTime = (time) => {
        if (!time) return "";
        const timeStr = String(time);
        if (timeStr.includes(":")) return timeStr.substring(0, 5);
        return timeStr;
      };

      const timeRange =
        startTime && endTime
          ? `${formatTime(startTime)}-${formatTime(endTime)}`
          : "";

      const formattedDate = classDate
        ? new Date(classDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "";

      const labelParts = [courseName];
      if (className) labelParts.push(className);
      if (formattedDate) labelParts.push(formattedDate);
      if (timeRange) labelParts.push(timeRange);

      return {
        value: scheduleId,
        label: labelParts.join(" | "),
        courseName,
        className,
        subjectName,
        date: formattedDate,
        time: timeRange,
        raw: schedule,
      };
    });
  }, [schedules]);

  if (loadingSchedules) {
    return <Loader className="py-12" />;
  }

  return (
    <div className="space-y-6 sm:space-y-8 px-1 sm:px-0 w-full min-w-0 max-w-full">
      <div className="flex items-center justify-between px-1">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white border-l-4 border-indigo-500/60 dark:border-indigo-400/60 pl-2 sm:pl-3">
          My Attendance
        </h1>
      </div>

      {/* QR Pass Section */}
      <div className="bg-gradient-to-br from-white to-indigo-50/70 dark:from-gray-900/70 dark:to-indigo-950/20 backdrop-blur shadow-lg ring-1 ring-indigo-100 dark:ring-indigo-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6">
        <StudentQRPass courseId={id} />
      </div>

      {/* Attendance Records */}
      <div className="space-y-4 sm:space-y-6 w-full min-w-0 max-w-full">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white border-l-4 border-violet-500/60 dark:border-violet-400/60 pl-2 sm:pl-3">
            Your Attendance Records
          </h2>
        </div>

        {/* Schedule Selector */}
        <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-md p-3.5 sm:p-6 border border-gray-200 dark:border-gray-700 w-full min-w-0 max-w-full">
          <label
            htmlFor="schedule-select"
            className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Select Schedule
          </label>
          {schedules.length === 0 ? (
            <div className="py-4">
              <EmptyState
                title="No Schedules Found"
                description="You don't have any enrolled courses with schedules yet."
              />
            </div>
          ) : (
            <CustomSelect
              value={selectedScheduleId}
              onChange={(val) =>
                setSelectedScheduleId(val ? Number(val) : null)
              }
              options={scheduleOptions}
              placeholder="-- Select a Schedule --"
              searchPlaceholder="Search schedule..."
              renderSelected={(opt) => (
                <span className="truncate block font-medium text-gray-900 dark:text-gray-100 text-xs sm:text-sm">
                  {opt.courseName || opt.label}
                  {opt.className ? ` • ${opt.className}` : ""}
                  {opt.date ? ` • ${opt.date}` : ""}
                  {opt.time ? ` (${opt.time})` : ""}
                </span>
              )}
              renderOption={(opt) => (
                <div className="flex flex-col gap-1 min-w-0 flex-1 py-1">
                  <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                    <span className="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm truncate">
                      {opt.courseName || opt.label}
                    </span>
                    {opt.className && (
                      <span className="px-2 py-0.5 text-[10px] sm:text-[11px] font-medium rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 shrink-0">
                        {opt.className}
                      </span>
                    )}
                    {opt.subjectName && (
                      <span className="px-2 py-0.5 text-[10px] sm:text-[11px] font-medium rounded-md bg-purple-50 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 shrink-0">
                        {opt.subjectName}
                      </span>
                    )}
                  </div>
                  {(opt.date || opt.time) && (
                    <div className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2 flex-wrap">
                      {opt.date && <span>📅 {opt.date}</span>}
                      {opt.time && <span>🕒 {opt.time}</span>}
                    </div>
                  )}
                </div>
              )}
            />
          )}
        </div>

        <div className="min-h-[200px]">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
            </div>
          ) : !selectedScheduleId ? (
            <div className="py-8">
              <EmptyState
                title="Select a Schedule"
                description="Please select a schedule above to view your attendance records."
              />
            </div>
          ) : attendance.length === 0 ? (
            <div className="py-8">
              <EmptyState
                title="No Attendance Records"
                description="No attendance records found for the selected schedule."
              />
            </div>
          ) : (
            <AttendanceList attendance={attendance} simpleView={true} />
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentAttendance;
