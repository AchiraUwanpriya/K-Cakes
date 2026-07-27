// import { useState, useEffect, useRef } from "react";
// import { Link } from "react-router-dom";
// import { useAuth } from "../../contexts/AuthContext";
// import {
//   getTeacherCourses,
//   getTeacherStudents,
// } from "../../services/courseService";
// import { getAllClassSchedules } from "../../services/classScheduleService";
// import { getRecentMaterials } from "../../services/materialService";
// import CourseCard from "../courses/CourseCard";
// import StudentCard from "../users/UserCard";
// import MaterialCard from "../materials/MaterialCard";
// import Card from "../common/Card";
// import Loader from "../common/Loader";
// import AnnouncementList from "../announcements/AnnouncementList";
// import { getAnnouncementsByTeacher } from "../../services/announcementService";
// import { useTheme } from "../../contexts/ThemeContext";
// import {
//   FaUserGraduate,
//   FaBookOpen,
//   FaBell,
//   FaCalendarAlt,
//   FaBan,
// } from "react-icons/fa";

// const resolveTeacherId = (user) => {
//   if (!user || typeof user !== "object") {
//     return null;
//   }

//   return (
//     user.TeacherID ??
//     user.teacherID ??
//     user.teacherId ??
//     user.UserID ??
//     user.userID ??
//     user.userId ??
//     user.id ??
//     null
//   );
// };

// const resolveStudentUserId = (student) => {
//   if (!student || typeof student !== "object") {
//     return null;
//   }

//   const nestedUser =
//     student.UserDetails ||
//     student.userDetails ||
//     student.User ||
//     student.user ||
//     {};

//   return (
//     student.UserID ??
//     student.userID ??
//     student.userId ??
//     student.UserId ??
//     nestedUser.UserID ??
//     nestedUser.userID ??
//     nestedUser.userId ??
//     null
//   );
// };

// const TeacherDashboard = () => {
//   const { user } = useAuth();
//   const [courses, setCourses] = useState([]);
//   const [students, setStudents] = useState([]);
//   const [materials, setMaterials] = useState([]);
//   const [schedules, setSchedules] = useState([]);
//   const [announcements, setAnnouncements] = useState([]);
//   // UI state for header actions (search/filters)
//   const [showSearch, setShowSearch] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showOptions, setShowOptions] = useState(false);
//   const [sortOrder, setSortOrder] = useState("desc"); // newest first
//   const searchInputRef = useRef(null);
//   const searchBoxRef = useRef(null);
//   const optionsRef = useRef(null);
//   const [activeTab, setActiveTab] = useState("notices");
//   const { theme } = useTheme();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const teacherId = resolveTeacherId(user);

//     if (!teacherId) {
//       setCourses([]);
//       setStudents([]);
//       setMaterials([]);
//       setAnnouncements([]);
//       setLoading(false);
//       return;
//     }

//     let isMounted = true;

//     const fetchData = async () => {
//       try {
//         const [coursesData, studentsData, materialsData, schedulesData] =
//           await Promise.all([
//             getTeacherCourses(teacherId),
//             getTeacherStudents(teacherId),
//             getRecentMaterials(teacherId),
//             getAllClassSchedules(),
//           ]);
//         if (!isMounted) {
//           return;
//         }

//         setCourses(coursesData || []);
//         setStudents(studentsData || []);
//         setMaterials(materialsData || []);
//         // filter schedules to only those that belong to the teacher's courses
//         try {
//           const courseIdSet = new Set(
//             (coursesData || [])
//               .map((c) => String(c?.id ?? c?.CourseID ?? c?.courseId ?? ""))
//               .filter(Boolean)
//           );
//           const filteredSchedules = (schedulesData || []).filter((s) =>
//             courseIdSet.has(
//               String(s?.courseId ?? s?.CourseID ?? s?.courseId ?? "")
//             )
//           );
//           setSchedules(filteredSchedules);
//         } catch (e) {
//           setSchedules([]);
//         }
//         // load announcements authored by this teacher
//         const anns = await getAnnouncementsByTeacher(teacherId);
//         if (isMounted) {
//           setAnnouncements(anns || []);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         if (isMounted) {
//           setCourses([]);
//           setStudents([]);
//           setMaterials([]);
//           setAnnouncements([]);
//         }
//       } finally {
//         if (isMounted) {
//           setLoading(false);
//         }
//       }
//     };

//     fetchData();
//     return () => {
//       isMounted = false;
//     };
//   }, [user]);

//   // Focus search input when opened
//   useEffect(() => {
//     if (showSearch && searchInputRef.current) {
//       searchInputRef.current.focus();
//     }
//   }, [showSearch]);

//   // Close overlays when clicking/touching outside
//   useEffect(() => {
//     const handlePointerDown = (e) => {
//       const t = e.target;
//       if (
//         showSearch &&
//         searchBoxRef.current &&
//         !searchBoxRef.current.contains(t)
//       ) {
//         setShowSearch(false);
//       }
//       if (
//         showOptions &&
//         optionsRef.current &&
//         !optionsRef.current.contains(t)
//       ) {
//         setShowOptions(false);
//       }
//     };

//     document.addEventListener("pointerdown", handlePointerDown);
//     return () => document.removeEventListener("pointerdown", handlePointerDown);
//   }, [showSearch, showOptions]);

//   if (loading) {
//     return <Loader className="py-12" />;
//   }

//   // Derived stats (safe access in case fields are missing)
//   const totalLessons = courses.reduce(
//     (sum, c) => sum + (c.lessonsCount || c.lessons?.length || 0),
//     0
//   );
//   const totalTests = courses.reduce((sum, c) => sum + (c.testsCount || 0), 0);
//   const totalHours = courses.reduce((sum, c) => sum + (c.totalHours || 0), 0);
//   const scheduleCount = schedules.length;

//   const getTeacherIcon = (type, value) => {
//     const v = Number(value) || 0;
//     const size = 28;
//     switch (type) {
//       case "students":
//         if (v === 0) return <FaBan size={size} className="text-gray-400" />;
//         if (v < 10)
//           return <FaUserGraduate size={size} className="text-yellow-500" />;
//         return <FaUserGraduate size={size} className="text-green-500" />;
//       case "courses":
//         if (v === 0) return <FaBan size={size} className="text-gray-400" />;
//         if (v < 5)
//           return <FaBookOpen size={size} className="text-indigo-500" />;
//         return <FaBookOpen size={size} className="text-blue-600" />;
//       case "announcements":
//         if (v === 0) return <FaBell size={size} className="text-gray-400" />;
//         return <FaBell size={size} className="text-orange-500" />;
//       case "schedules":
//         if (v === 0) return <FaBan size={size} className="text-gray-400" />;
//         return <FaCalendarAlt size={size} className="text-purple-500" />;
//       default:
//         return <FaBookOpen size={size} className="text-gray-600" />;
//     }
//   };

//   // Prepare announcements list based on search + sort
//   const filteredAnnouncements = (announcements || [])
//     .filter((a) => {
//       if (!searchQuery) return true;
//       const q = searchQuery.toLowerCase();
//       return (
//         a.title?.toLowerCase().includes(q) ||
//         a.content?.toLowerCase().includes(q)
//       );
//     })
//     .slice()
//     .sort((a, b) => {
//       const da = new Date(a.postDate || 0).getTime();
//       const db = new Date(b.postDate || 0).getTime();
//       return sortOrder === "desc" ? db - da : da - db;
//     });

//   return (
//     <div className="space-y-6">
//       {/* Top stat cards - styled like the provided design */}
//       <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
//         <Card className="p-6 flex flex-col items-start transition-base hover-lift soft-shadow">
//           <div className="flex items-center w-full justify-between">
//             <div className="flex items-center space-x-4">
//               <div className="bg-white/60 dark:bg-gray-700 p-3 rounded-lg shadow-sm">
//                 {getTeacherIcon("students", students.length)}
//               </div>
//               <div>
//                 <div className="text-sm font-semibold text-gray-600 dark:text-gray-300">
//                   Class Students
//                 </div>
//                 <div className="text-3xl font-bold text-green-500 mt-2">
//                   {students.length}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </Card>

//         <Card className="p-6 flex flex-col items-start transition-base hover-lift soft-shadow">
//           <div className="flex items-center w-full justify-between">
//             <div className="flex items-center space-x-4">
//               <div className="bg-white/60 dark:bg-gray-700 p-3 rounded-lg shadow-sm">
//                 {getTeacherIcon("courses", courses.length)}
//               </div>
//               <div>
//                 <div className="text-sm font-semibold text-gray-600 dark:text-gray-300">
//                   Courses
//                 </div>
//                 <div className="text-3xl font-bold text-green-500 mt-2">
//                   {courses.length}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </Card>

//         <Card className="p-6 flex flex-col items-start transition-base hover-lift soft-shadow">
//           <div className="flex items-center w-full justify-between">
//             <div className="flex items-center space-x-4">
//               <div className="bg-white/60 dark:bg-gray-700 p-3 rounded-lg shadow-sm">
//                 {getTeacherIcon("announcements", announcements.length)}
//               </div>
//               <div>
//                 <div className="text-sm font-semibold text-gray-600 dark:text-gray-300">
//                   Announcements
//                 </div>
//                 <div className="text-3xl font-bold text-green-500 mt-2">
//                   {announcements.length}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </Card>

//         <Card className="p-6 flex flex-col items-start transition-base hover-lift soft-shadow">
//           <div className="flex items-center w-full justify-between">
//             <div className="flex items-center space-x-4">
//               <div className="bg-white/60 dark:bg-gray-700 p-3 rounded-lg shadow-sm">
//                 {getTeacherIcon("schedules", scheduleCount)}
//               </div>
//               <div>
//                 <div className="text-sm font-semibold text-gray-600 dark:text-gray-300">
//                   Scheduled Classes
//                 </div>
//                 <div className="text-3xl font-bold text-green-500 mt-2">
//                   {scheduleCount}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </Card>
//       </div>

//       {/* Big Notices & Announcements style panel */}
//       <Card className="p-0">
//         <div
//           className={`relative flex flex-col gap-4 rounded-t-lg p-5 text-white sm:p-6 lg:flex-row lg:items-center lg:justify-between ${
//             theme === "dark"
//               ? "bg-gradient-to-r from-blue-700 to-indigo-800"
//               : "bg-gradient-to-r from-blue-400 to-indigo-500"
//           }`}
//         >
//           <div className="flex flex-wrap items-center gap-4">
//             <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
//               <span className="text-2xl">🔔</span>
//             </div>
//             <div>
//               <h2 className="text-lg font-semibold sm:text-xl">
//                 Notices & Announcements
//               </h2>
//               <div className="text-sm opacity-90">
//                 (Stay updated with the latest information)
//               </div>
//             </div>
//           </div>
//           <div className="flex flex-wrap items-center gap-2 sm:gap-4">
//             <button
//               className="relative"
//               onClick={() => {
//                 setActiveTab("notices");
//                 setShowSearch(false);
//                 setShowOptions(false);
//               }}
//               title="View notices"
//             >
//               <svg
//                 className="w-6 h-6"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5"
//                 />
//               </svg>
//               {announcements.length > 0 && (
//                 <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
//                   {announcements.length}
//                 </span>
//               )}
//             </button>
//             <button
//               onClick={() => {
//                 setShowSearch((v) => !v);
//                 setShowOptions(false);
//               }}
//               title="Search notices"
//             >
//               <svg
//                 className="w-6 h-6 text-white/90"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
//                 />
//               </svg>
//             </button>
//             <button
//               onClick={() => {
//                 setShowOptions((v) => !v);
//                 setShowSearch(false);
//               }}
//               title="Options"
//             >
//               <svg
//                 className="w-6 h-6 text-white/90"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M4 6h16M4 12h16M4 18h16"
//                 />
//               </svg>
//             </button>
//           </div>

//           {/* Search input overlay */}
//           {showSearch && (
//             <div
//               ref={searchBoxRef}
//               className="absolute right-4 top-4 w-[min(18rem,calc(100vw-3rem))] sm:w-72"
//             >
//               <input
//                 ref={searchInputRef}
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="Search notices..."
//                 className="w-full rounded-md bg-white/90 px-3 py-1.5 text-gray-800 placeholder-gray-500 shadow focus:outline-none"
//               />
//             </div>
//           )}

//           {/* Options dropdown */}
//           {showOptions && (
//             <div
//               ref={optionsRef}
//               className="absolute right-4 top-14 bg-white text-gray-700 rounded-md shadow w-52 ring-1 ring-black/5"
//             >
//               <div className="py-1 text-sm">
//                 <div className="px-3 py-1.5 text-xs uppercase tracking-wide text-gray-500">
//                   Sort
//                 </div>
//                 <button
//                   className={`w-full text-left px-3 py-2 hover:bg-gray-100 ${
//                     sortOrder === "desc" ? "font-semibold text-gray-900" : ""
//                   }`}
//                   onClick={() => {
//                     setSortOrder("desc");
//                     setShowOptions(false);
//                   }}
//                 >
//                   Newest first
//                 </button>
//                 <button
//                   className={`w-full text-left px-3 py-2 hover:bg-gray-100 ${
//                     sortOrder === "asc" ? "font-semibold text-gray-900" : ""
//                   }`}
//                   onClick={() => {
//                     setSortOrder("asc");
//                     setShowOptions(false);
//                   }}
//                 >
//                   Oldest first
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//         <div className="px-5 py-5 sm:px-6 sm:py-6">
//           <div className="mb-4 flex flex-col gap-3 border-b border-gray-200 pb-4 text-sm text-gray-500 dark:border-gray-700 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
//             <div className="flex flex-wrap items-center gap-4">
//               <button
//                 onClick={() => setActiveTab("notices")}
//                 className={`border-b-2 pb-3 transition-colors ${
//                   activeTab === "notices"
//                     ? "border-blue-500 text-blue-600"
//                     : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
//                 }`}
//               >
//                 Notices ({announcements.length})
//               </button>
//               {/* Attachments tab removed: teacher dashboard shows only notices */}
//             </div>

//             {/* <div className="text-xs text-gray-500 dark:text-gray-300 sm:text-sm sm:text-right">
//               {announcements[0]
//                 ? new Date(announcements[0].postDate).toLocaleString()
//                 : ""}
//             </div> */}
//           </div>

//           <div className="min-h-[200px]">
//             <AnnouncementList announcements={filteredAnnouncements} />
//           </div>
//         </div>
//       </Card>

//       {/* Existing recent lists (restyled slightly) */}
//       <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
//         <div>
//           <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
//             Recent Courses
//           </h3>
//           <div className="space-y-4">
//             {courses.slice(0, 3).map((course) => (
//               <CourseCard key={course.id} course={course} />
//             ))}
//           </div>
//         </div>

//         <div>
//           <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
//             Recent Students
//           </h3>
//           <div className="space-y-4">
//             {students.slice(0, 5).map((student, index) => {
//               const studentUserId = resolveStudentUserId(student);
//               const key =
//                 studentUserId ??
//                 student.id ??
//                 student.StudentID ??
//                 student.studentId ??
//                 student.userId ??
//                 index;
//               const card = <StudentCard user={student} />;

//               if (!studentUserId) {
//                 return (
//                   <div key={String(key)} className="block">
//                     {card}
//                   </div>
//                 );
//               }

//               return (
//                 <Link
//                   key={String(key)}
//                   to={`/teacher/students/${studentUserId}`}
//                   className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900 rounded-lg"
//                 >
//                   {card}
//                 </Link>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       <div>
//         <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
//           Recent Materials
//         </h3>
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//           {materials.slice(0, 3).map((material) => (
//             <MaterialCard key={material.id} material={material} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  getTeacherCourses,
  getTeacherStudents,
} from "../../services/courseService";
import { getAllClassSchedules } from "../../services/classScheduleService";
import { getRecentMaterials } from "../../services/materialService";
import CourseCard from "../courses/CourseCard";
import StudentCard from "../users/UserCard";
import MaterialCard from "../materials/MaterialCard";
import Card from "../common/Card";
import Loader from "../common/Loader";
import StatsCard from "../common/StatsCard";
import AnnouncementList from "../announcements/AnnouncementList";
import { getAnnouncementsByTeacher } from "../../services/announcementService";
import { useTheme } from "../../contexts/ThemeContext";
import {
  FaUserGraduate,
  FaBookOpen,
  FaBell,
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaFileAlt,
  FaSearch,
  FaFilter,
  FaPlus,
  FaClock,
  FaChartLine,
  FaUsers
} from "react-icons/fa";

const resolveTeacherId = (user) => {
  if (!user || typeof user !== "object") {
    return null;
  }

  return (
    user.TeacherID ??
    user.teacherID ??
    user.teacherId ??
    user.UserID ??
    user.userID ??
    user.userId ??
    user.id ??
    null
  );
};

const resolveStudentUserId = (student) => {
  if (!student || typeof student !== "object") {
    return null;
  }

  const nestedUser =
    student.UserDetails ||
    student.userDetails ||
    student.User ||
    student.user ||
    {};

  return (
    student.UserID ??
    student.userID ??
    student.userId ??
    student.UserId ??
    nestedUser.UserID ??
    nestedUser.userID ??
    nestedUser.userId ??
    null
  );
};

const TeacherDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  // State management
  const [dashboardData, setDashboardData] = useState({
    courses: [],
    students: [],
    materials: [],
    schedules: [],
    announcements: []
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("notices");
  const [sortOrder, setSortOrder] = useState("desc");
  const [uiState, setUiState] = useState({
    showSearch: false,
    showSortOptions: false
  });
  
  const searchInputRef = useRef(null);
  const searchBoxRef = useRef(null);
  const optionsRef = useRef(null);

  // Active students = those whose enrollment IsActive is not explicitly false
  const activeStudents = dashboardData.students.filter(
    (s) => (s.isActive ?? s.IsActive ?? true) !== false
  );

  // Stats calculations
  const stats = [
    {
      title: "Total Students",
      value: dashboardData.students.length,
      change: "+8%",
      icon: FaUserGraduate,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      title: "Total Courses",
      value: dashboardData.courses.length,
      change: "+5%",
      icon: FaBookOpen,
      iconColor: "text-indigo-500",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20"
    },
    {
      title: "Announcements",
      value: dashboardData.announcements.length,
      change: "+12%",
      icon: FaBell,
      iconColor: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20"
    },
    {
      title: "Scheduled Classes",
      value: dashboardData.schedules.length,
      change: "+3%",
      icon: FaCalendarAlt,
      iconColor: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20"
    },
    {
      title: "Materials",
      value: dashboardData.materials.length,
      change: "+15%",
      icon: FaFileAlt,
      iconColor: "text-amber-500",
      bgColor: "bg-amber-50 dark:bg-amber-900/20"
    },
    {
      title: "Lessons",
      value: dashboardData.courses.reduce(
        (sum, c) => sum + (c.lessonsCount || c.lessons?.length || 0),
        0
      ),
      change: "+10%",
      icon: FaChartLine,
      iconColor: "text-rose-500",
      bgColor: "bg-rose-50 dark:bg-rose-900/20"
    }
  ];

  useEffect(() => {
    const teacherId = resolveTeacherId(user);

    if (!teacherId) {
      setDashboardData({
        courses: [],
        students: [],
        materials: [],
        schedules: [],
        announcements: []
      });
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [coursesData, studentsData, materialsData, schedulesData, announcementsData] =
          await Promise.all([
            getTeacherCourses(teacherId),
            getTeacherStudents(teacherId),
            getRecentMaterials(teacherId),
            getAllClassSchedules(),
            getAnnouncementsByTeacher(teacherId)
          ]);
        
        if (!isMounted) return;

        // Filter schedules to only those that belong to the teacher's courses
        let filteredSchedules = [];
        try {
          const courseIdSet = new Set(
            (coursesData || [])
              .map((c) => String(c?.id ?? c?.CourseID ?? c?.courseId ?? ""))
              .filter(Boolean)
          );
          filteredSchedules = (schedulesData || []).filter((s) =>
            courseIdSet.has(
              String(s?.courseId ?? s?.CourseID ?? s?.courseId ?? "")
            )
          );
        } catch (e) {
          filteredSchedules = [];
        }

        setDashboardData({
          courses: coursesData || [],
          students: studentsData || [],
          materials: materialsData || [],
          schedules: filteredSchedules,
          announcements: announcementsData || []
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        if (isMounted) {
          setDashboardData({
            courses: [],
            students: [],
            materials: [],
            schedules: [],
            announcements: []
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [user]);

  // Focus search input when opened
  useEffect(() => {
    if (uiState.showSearch && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [uiState.showSearch]);

  // Handle click outside for dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (uiState.showSearch && searchBoxRef.current && !searchBoxRef.current.contains(event.target)) {
        setUiState(prev => ({ ...prev, showSearch: false }));
      }
      if (uiState.showSortOptions && optionsRef.current && !optionsRef.current.contains(event.target)) {
        setUiState(prev => ({ ...prev, showSortOptions: false }));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [uiState.showSearch, uiState.showSortOptions]);

  // Filter and sort announcements
  const filteredAnnouncements = dashboardData.announcements
    .filter(announcement => {
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return (
        announcement.title?.toLowerCase().includes(query) ||
        announcement.content?.toLowerCase().includes(query) ||
        announcement.author?.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.postDate || a.createdAt || 0);
      const dateB = new Date(b.postDate || b.createdAt || 0);
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

  // Handle UI actions
  const toggleSearch = () => {
    setUiState(prev => ({ 
      ...prev, 
      showSearch: !prev.showSearch,
      showSortOptions: false 
    }));
  };

  const toggleSortOptions = () => {
    setUiState(prev => ({ 
      ...prev, 
      showSortOptions: !prev.showSortOptions,
      showSearch: false 
    }));
  };

  const handleSortChange = (order) => {
    setSortOrder(order);
    setUiState(prev => ({ ...prev, showSortOptions: false }));
  };

  // Prepare student data for StudentCard
  const prepareStudentData = (student) => {
    // Check if student data is nested in UserDetails/User
    const userDetails = student.UserDetails || student.userDetails || student.User || student.user || student;
    
    return {
      id: userDetails.id || userDetails.UserID || userDetails.userId,
      firstName: userDetails.firstName || userDetails.firstname || student.firstName || student.firstname || "Unknown",
      lastName: userDetails.lastName || userDetails.lastname || student.lastName || student.lastname || "",
      email: userDetails.email || student.email || "",
      avatar: userDetails.avatar || userDetails.profilePicture || student.avatar || student.profilePicture,
      // Add other fields that StudentCard might need
      userType: "Student",
      userTypeId: 3,
      ...userDetails
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header - Matching AdminDashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Teacher Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back, {user?.firstName || "Teacher"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
      </div>

      {/* Stats Grid - Same 4 column layout as AdminDashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.slice(0, 4).map((stat, index) => (
          <StatsCard
            key={stat.title}
            icon={<stat.icon className={`w-6 h-6 ${stat.iconColor}`} />}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            className={stat.bgColor}
          />
        ))}
      </div>

      {/* Announcements Card - Matching AdminDashboard design */}
      <Card className="overflow-hidden">
        <div className={`relative overflow-hidden ${
          theme === "dark" 
            ? "bg-gradient-to-r from-gray-900 to-gray-800" 
            : "bg-gradient-to-r from-gray-800 to-gray-700"
        }`}>
          <div className="absolute inset-0 bg-grid-white/5" />
          <div className="relative p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${
                  theme === "dark" ? "bg-white/10" : "bg-white/20"
                }`}>
                  <FaBell className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    My Announcements
                  </h2>
                  <p className="text-white/80 text-sm mt-1">
                    Latest updates and important notices
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Search Toggle */}
                <button
                  onClick={toggleSearch}
                  className={`p-2 rounded-lg transition-all ${
                    uiState.showSearch
                      ? "bg-white text-gray-800"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                  aria-label="Search announcements"
                >
                  <FaSearch className="w-4 h-4" />
                </button>

                {/* Sort Options */}
                <div className="relative">
                  <button
                    onClick={toggleSortOptions}
                    className={`p-2 rounded-lg transition-all ${
                      uiState.showSortOptions
                        ? "bg-white text-gray-800"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                    aria-label="Sort options"
                  >
                    <FaFilter className="w-4 h-4" />
                  </button>
                  
                  {uiState.showSortOptions && (
                    <div
                      ref={optionsRef}
                      className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10"
                    >
                      <div className="py-1">
                        <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Sort By
                        </div>
                        <button
                          onClick={() => handleSortChange("desc")}
                          className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                            sortOrder === "desc"
                              ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          }`}
                        >
                          Newest First
                        </button>
                        <button
                          onClick={() => handleSortChange("asc")}
                          className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                            sortOrder === "asc"
                              ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          }`}
                        >
                          Oldest First
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* New Announcement Button */}
                <button
                  onClick={() =>
                    navigate("/teacher/notices", { state: { openForm: true } })
                  }
                  className="flex items-center gap-2 px-3 py-2 bg-white text-blue-600 hover:bg-white/90 rounded-lg transition-colors"
                >
                  <FaPlus className="w-4 h-4" />
                  <span className="text-sm font-medium">New</span>
                </button>
              </div>
            </div>

            {/* Search Input */}
            {uiState.showSearch && (
              <div ref={searchBoxRef} className="mt-4">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search announcements by title, content, or author..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                      aria-label="Clear search"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          {/* Tabs - Matching AdminDashboard */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
            <button
              onClick={() => setActiveTab("notices")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "notices"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Announcements ({dashboardData.announcements.length})
            </button>
          </div>

          {/* Content */}
          <div className="min-h-[300px]">
            {filteredAnnouncements.length > 0 ? (
              <AnnouncementList 
                announcements={filteredAnnouncements} 
                limit={5}
              />
            ) : (
              <div className="text-center py-12">
                <div className={`inline-flex p-3 rounded-lg ${
                  theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                }`}>
                  <FaBell className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                  No announcements yet
                </h3>
                <p className="mt-1 text-gray-500 dark:text-gray-400">
                  Create your first announcement to share with students
                </p>
                <button
                  onClick={() =>
                    navigate("/teacher/notices", { state: { openForm: true } })
                  }
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaPlus className="w-4 h-4" />
                  Create Announcement
                </button>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Quick Access Grid - Matching AdminDashboard layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Courses */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Courses
            </h3>
            <Link
              to="/teacher/courses"
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            >
              View All →
            </Link>
          </div>
          
          {dashboardData.courses.length > 0 ? (
            <div className="space-y-3">
              {dashboardData.courses.slice(0, 5).map((course) => (
                <div
                  key={course.id}
                  onClick={() => navigate(`/teacher/courses/${course.id}`)}
                  className="p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {course.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {course.code || course.courseCode}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {course.subject || "General"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full">
                        {course.academicYear || "2024"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FaBookOpen className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto" />
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                No courses assigned yet
              </p>
            </div>
          )}
        </Card>

        {/* Recent Students - Using StudentCard properly */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Students
            </h3>
            <Link
              to="/teacher/students"
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            >
              View All →
            </Link>
          </div>
          
          {dashboardData.students.length > 0 ? (
            <div className="space-y-3">
              {dashboardData.students.slice(0, 5).map((student, index) => {
                const studentUserId = resolveStudentUserId(student);
                const preparedStudent = prepareStudentData(student);
                
                // Use StudentCard component with proper data
                return (
                  <div
                    key={preparedStudent.id || index}
                    onClick={() => navigate(`/teacher/students/${studentUserId}`)}
                    className="block"
                  >
                    <StudentCard 
                      user={preparedStudent}
                      showAvatar={true}
                      showEmail={true}
                      showRole={false}
                      compact={true}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <FaUsers className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto" />
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                No students enrolled yet
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Recent Materials Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Materials
          </h3>
          <Link
            to="/teacher/materials"
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          >
            View All →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dashboardData.materials.slice(0, 3).map((material) => (
            <MaterialCard key={material.id} material={material} />
          ))}
        </div>
      </div>

      {/* Quick Stats Footer - Matching AdminDashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {activeStudents.length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Active Students
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {dashboardData.courses.length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Active Courses
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {dashboardData.materials.length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Total Materials
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {dashboardData.schedules.length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Scheduled Classes
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;