// import { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../contexts/AuthContext";
// import { getAllUsers } from "../../services/userService";
// import { getAllStudents } from "../../services/studentService";
// import { getAllCourses } from "../../services/courseService";
// import { getAllTeachers } from "../../services/teacherService";
// import { getAllAnnouncements } from "../../services/announcementService";
// import Card from "../common/Card";
// import EmptyState from "../common/EmptyState";
// import Loader from "../common/Loader";
// import Avatar from "../common/Avatar";
// import StatsCard from "../common/StatsCard";
// import AnnouncementList from "../announcements/AnnouncementList";
// import { useTheme } from "../../contexts/ThemeContext";
// import {
//   FaGraduationCap,
//   FaBookOpen,
//   FaChalkboardTeacher,
//   FaBan,
// } from "react-icons/fa";

// const AdminDashboard = () => {
//   const { user } = useAuth();
//   const [users, setUsers] = useState([]);
//   const [students, setStudents] = useState([]);
//   const [courses, setCourses] = useState([]);
//   const [teachers, setTeachers] = useState([]);
//   const [announcements, setAnnouncements] = useState([]);
//   const [loading, setLoading] = useState(true);
//   // UI state for header actions (search & sort)
//   const [showSearch, setShowSearch] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showOptions, setShowOptions] = useState(false);
//   const [sortOrder, setSortOrder] = useState("desc");
//   const searchInputRef = useRef(null);
//   const searchBoxRef = useRef(null);
//   const optionsRef = useRef(null);
//   const { theme } = useTheme();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [
//           usersData,
//           studentsData,
//           coursesData,
//           teachersData,
//           announcementsData,
//         ] = await Promise.all([
//           getAllUsers(),
//           getAllStudents(),
//           getAllCourses(),
//           getAllTeachers(),
//           getAllAnnouncements(),
//         ]);
//         setUsers(Array.isArray(usersData) ? usersData.filter(Boolean) : []);

//         setStudents(
//           Array.isArray(studentsData) ? studentsData.filter(Boolean) : []
//         );
//         setCourses(Array.isArray(coursesData) ? coursesData : []);
//         setTeachers(Array.isArray(teachersData) ? teachersData : []);
//         setAnnouncements(
//           Array.isArray(announcementsData) ? announcementsData : []
//         );
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setUsers([]);
//         setStudents([]);
//         setCourses([]);
//         setTeachers([]);
//         setAnnouncements([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

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

//   // Helper to format/display user role in a friendly way
//   const formatRole = (u) => {
//     if (!u) return "-";
//     const rawType =
//       u.userType ??
//       u.UserType ??
//       u.userTypeName ??
//       u.UserTypeName ??
//       u.role ??
//       u.Role ??
//       "";
//     const rawId =
//       u.userTypeId ??
//       u.userTypeID ??
//       u.UserTypeID ??
//       u.UserTypeID ??
//       u.userTypeId ??
//       null;

//     const idVal = rawId !== undefined && rawId !== null ? Number(rawId) : NaN;
//     const idMap = { 1: "Admin", 2: "Teacher", 3: "Student" };
//     if (!Number.isNaN(idVal) && idMap[idVal]) return idMap[idVal];

//     const s = String(rawType || "").trim();
//     if (!s) return "-";

//     const lowered = s.toLowerCase();
//     if (lowered === "1" || lowered === "admin" || lowered.includes("admin"))
//       return "Admin";
//     if (lowered === "2" || lowered === "teacher" || lowered.includes("teach"))
//       return "Teacher";
//     if (lowered === "3" || lowered === "student" || lowered.includes("stud"))
//       return "Student";

//     // Fallback: capitalize first letter
//     return s.charAt(0).toUpperCase() + s.slice(1);
//   };

//   // Choose a react-icon element based on stat type and value
//   const getStatIcon = (type, value) => {
//     const v = Number(value) || 0;
//     const size = 28;
//     switch (type) {
//       case "students":
//         if (v === 0) return <FaBan size={size} className="text-gray-400" />;
//         if (v < 10)
//           return <FaGraduationCap size={size} className="text-yellow-500" />;
//         return <FaGraduationCap size={size} className="text-green-500" />;
//       case "courses":
//         if (v === 0) return <FaBan size={size} className="text-gray-400" />;
//         if (v < 5)
//           return <FaBookOpen size={size} className="text-indigo-500" />;
//         return <FaBookOpen size={size} className="text-blue-600" />;
//       case "teachers":
//         if (v === 0) return <FaBan size={size} className="text-gray-400" />;
//         if (v < 5)
//           return <FaChalkboardTeacher size={size} className="text-amber-500" />;
//         return <FaChalkboardTeacher size={size} className="text-purple-600" />;
//       default:
//         return <FaBookOpen size={size} className="text-gray-600" />;
//     }
//   };

//   if (loading) {
//     return <Loader className="py-12" />;
//   }

//   return (
//     <div className="space-y-8">
//       {/* Stats header */}
//       <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
//         <StatsCard
//           icon={getStatIcon("students", students.length)}
//           title="Total Students"
//           value={students.length}
//         />
//         <StatsCard
//           icon={getStatIcon("courses", courses.length)}
//           title="Total Courses"
//           value={courses.length}
//         />
//         <StatsCard
//           icon={getStatIcon("teachers", teachers.length)}
//           title="Total Teachers"
//           value={teachers.length}
//         />
//         {/* <StatsCard icon="💵" title="Fees Collection" value={`Rs.${0}`} /> */}
//       </div>

//       {/* Notices & Announcements panel (teacher-style) */}
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
//               <h3 className="text-lg font-semibold sm:text-xl">
//                 Notices & Announcements
//               </h3>
//               <p className="text-sm opacity-80">
//                 (Stay updated with the latest information)
//               </p>
//             </div>
//           </div>
//           <div className="flex flex-wrap items-center gap-2 sm:gap-3">
//             <button
//               className="relative rounded-full bg-white/20 p-2"
//               onClick={() => {
//                 // focus the notices area; no-op for now but keeps behavior consistent
//                 setShowSearch(false);
//                 setShowOptions(false);
//               }}
//               title="View notices"
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
//               className="rounded-full bg-white/20 p-2"
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
//               className="rounded-full bg-white/20 p-2"
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

//         <div className="p-5 sm:p-6">
//           <div className="mb-5 border-b">
//             <nav className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
//               <div className="border-b-2 border-blue-500 pb-3 text-blue-600">
//                 Notices ({announcements.length})
//               </div>
//             </nav>
//           </div>

//           <div className="min-h-[200px]">
//             {announcements.length ? (
//               <AnnouncementList announcements={filteredAnnouncements} />
//             ) : (
//               <EmptyState
//                 title="No notices available"
//                 description="Check back later for updates"
//               />
//             )}
//           </div>
//         </div>
//       </Card>

//       {/* Recent Users & Courses (kept for quick access) */}
//       <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
//         <div>
//           <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
//             Recent Users
//           </h3>
//           {users.length > 0 ? (
//             <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
//               <ul className="divide-y divide-gray-200 dark:divide-gray-700 stagger-children">
//                 {users.slice(0, 5).map((user) => (
//                   <li key={user.id}>
//                     <div
//                       onClick={() => navigate(`/admin/users/${user.id}`)}
//                       role="button"
//                       tabIndex={0}
//                       onKeyDown={(e) => {
//                         if (e.key === "Enter" || e.key === " ") {
//                           navigate(`/admin/users/${user.id}`);
//                         }
//                       }}
//                       className="px-4 py-4 flex items-center sm:px-6 transition-base hover-lift cursor-pointer"
//                     >
//                       <div className="min-w-0 flex-1 flex items-center">
//                         <div className="flex-shrink-0">
//                           <Avatar
//                             name={`${user.firstName} ${user.lastName}`}
//                             size="sm"
//                             user={user}
//                           />
//                         </div>
//                         <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
//                           <div>
//                             <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 truncate">
//                               {user.firstName} {user.lastName}
//                             </p>
//                             <p className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
//                               <span className="truncate">{user.email}</span>
//                             </p>
//                           </div>
//                           <div className="hidden md:block">
//                             <div>
//                               <p className="text-sm text-gray-900 dark:text-white">
//                                 Role: {formatRole(user)}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ) : (
//             <EmptyState
//               title="No users found"
//               description="There are currently no users in the system."
//             />
//           )}
//         </div>

//         <div>
//           <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
//             Recent Courses
//           </h3>
//           {courses.length > 0 ? (
//             <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
//               <ul className="divide-y divide-gray-200 dark:divide-gray-700 stagger-children">
//                 {courses.slice(0, 5).map((course) => (
//                   <li key={course.id}>
//                     <div
//                       onClick={() => navigate(`/admin/courses/${course.id}`)}
//                       role="button"
//                       tabIndex={0}
//                       onKeyDown={(e) => {
//                         if (e.key === "Enter" || e.key === " ") {
//                           navigate(`/admin/courses/${course.id}`);
//                         }
//                       }}
//                       className="px-4 py-4 sm:px-6 transition-base hover-lift cursor-pointer"
//                     >
//                       <div className="flex items-center justify-between">
//                         <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 truncate">
//                           {course.name}
//                         </p>
//                         <div className="ml-2 flex-shrink-0 flex">
//                           <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
//                             {course.code}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="mt-2 sm:flex sm:justify-between">
//                         <div className="sm:flex">
//                           <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
//                             {course.subject}
//                           </p>
//                         </div>
//                         <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
//                           <p>{course.academicYear}</p>
//                         </div>
//                       </div>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ) : (
//             <EmptyState
//               title="No courses found"
//               description="There are currently no courses in the system."
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getAllUsers } from "../../services/userService";
import { getAllStudents } from "../../services/studentService";
import { getAllCourses } from "../../services/courseService";
import { getAllTeachers } from "../../services/teacherService";
import { getAllAnnouncements } from "../../services/announcementService";
import Card from "../common/Card";
import EmptyState from "../common/EmptyState";
import Loader from "../common/Loader";
import Avatar from "../common/Avatar";
import StatsCard from "../common/StatsCard";
import AnnouncementList from "../announcements/AnnouncementList";
import { useTheme } from "../../contexts/ThemeContext";
import {
  FaGraduationCap,
  FaBookOpen,
  FaChalkboardTeacher,
  FaUsers,
  FaBullhorn,
  FaSearch,
  FaFilter,
  FaBell,
  FaCalendarAlt
} from "react-icons/fa";

// Constants for better maintainability
const STATS_CONFIG = {
  students: {
    title: "Total Students",
    color: "blue",
    icon: FaGraduationCap
  },
  courses: {
    title: "Total Courses",
    color: "indigo",
    icon: FaBookOpen
  },
  teachers: {
    title: "Total Teachers",
    color: "purple",
    icon: FaChalkboardTeacher
  },
  users: {
    title: "Total Users",
    color: "green",
    icon: FaUsers
  }
};

const SORT_OPTIONS = [
  { value: "desc", label: "Newest First" },
  { value: "asc", label: "Oldest First" }
];

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  // State management
  const [dashboardData, setDashboardData] = useState({
    users: [],
    students: [],
    courses: [],
    teachers: [],
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

  const [readAnnouncements, setReadAnnouncements] = useState([]);

  // Get key helper
  const getReadAnnouncementsKey = (userId) => `admin_read_announcements_${userId || 'default'}`;

  // Load read announcements from localStorage once user is loaded
  useEffect(() => {
    if (user) {
      const key = getReadAnnouncementsKey(user.id || user.UserID || user.userId);
      try {
        const stored = localStorage.getItem(key);
        if (stored) {
          setReadAnnouncements(JSON.parse(stored));
        } else {
          setReadAnnouncements([]);
        }
      } catch (e) {
        console.error("Error reading read announcements from localStorage", e);
      }
    }
  }, [user]);

  // Mark all announcements as read
  const markAllAsRead = () => {
    const key = getReadAnnouncementsKey(user?.id || user?.UserID || user?.userId);
    const allIds = dashboardData.announcements.map((a) => a.id);
    
    const newReadSet = new Set([...readAnnouncements, ...allIds]);
    const newReadArray = Array.from(newReadSet);
    
    setReadAnnouncements(newReadArray);
    try {
      localStorage.setItem(key, JSON.stringify(newReadArray));
    } catch (e) {
      console.error("Error saving read announcements to localStorage", e);
    }
  };

  // Mark a single announcement as read
  const handleMarkAsRead = (announcementId) => {
    const key = getReadAnnouncementsKey(user?.id || user?.UserID || user?.userId);
    if (!readAnnouncements.includes(announcementId)) {
      const newReadArray = [...readAnnouncements, announcementId];
      setReadAnnouncements(newReadArray);
      try {
        localStorage.setItem(key, JSON.stringify(newReadArray));
      } catch (e) {
        console.error("Error saving read announcements to localStorage", e);
      }
    }
  };

  // Calculate unread count
  const unreadAnnouncements = dashboardData.announcements.filter(
    (announcement) => !readAnnouncements.includes(announcement.id)
  );
  const unreadCount = unreadAnnouncements.length;

  const handleBellClick = () => {
    markAllAsRead();
    setActiveTab("notices");
    const noticesElement = document.getElementById("notices-section");
    if (noticesElement) {
      noticesElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [usersData, studentsData, coursesData, teachersData, announcementsData] = 
          await Promise.all([
            getAllUsers(),
            getAllStudents(),
            getAllCourses(),
            getAllTeachers(),
            getAllAnnouncements()
          ]);

        setDashboardData({
          users: Array.isArray(usersData) ? usersData.filter(Boolean) : [],
          students: Array.isArray(studentsData) ? studentsData.filter(Boolean) : [],
          courses: Array.isArray(coursesData) ? coursesData : [],
          teachers: Array.isArray(teachersData) ? teachersData : [],
          announcements: Array.isArray(announcementsData) ? announcementsData : []
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Reset all data on error
        setDashboardData({
          users: [],
          students: [],
          courses: [],
          teachers: [],
          announcements: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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

  // Statistics calculations
  const stats = [
    {
      ...STATS_CONFIG.students,
      value: dashboardData.students.length,
      change: "+12%",
      iconColor: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      ...STATS_CONFIG.courses,
      value: dashboardData.courses.length,
      change: "+5%",
      iconColor: "text-indigo-500",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20"
    },
    {
      ...STATS_CONFIG.teachers,
      value: dashboardData.teachers.length,
      change: "+8%",
      iconColor: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20"
    },
    {
      ...STATS_CONFIG.users,
      value: dashboardData.users.length,
      change: "+15%",
      iconColor: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20"
    }
  ];

  // Format user role
  const formatUserRole = (user) => {
    if (!user) return "-";
    
    const role = user.userType || user.role || user.UserType || "";
    const roleId = user.userTypeId || user.userTypeID;
    
    // Check by ID first
    if (roleId) {
      const idMap = { 1: "Admin", 2: "Teacher", 3: "Student" };
      if (idMap[roleId]) return idMap[roleId];
    }
    
    // Check by string value
    const roleStr = role.toString().toLowerCase();
    if (roleStr.includes("admin")) return "Admin";
    if (roleStr.includes("teach")) return "Teacher";
    if (roleStr.includes("stud")) return "Student";
    
    // Capitalize first letter as fallback
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  // Handle UI actions
  const toggleSearch = () => {
    setUiState(prev => ({ 
      ...prev, 
      showSearch: !prev.showSearch,
      showSortOptions: false 
    }));
    if (!uiState.showSearch && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back, {user?.firstName || "Admin"}
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard
            key={stat.title}
            icon={<stat.icon className={`w-6 h-6 ${stat.iconColor}`} />}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            className={stat.bgColor}
            loading={loading}
          />
        ))}
      </div>

      {/* Announcements Card */}
      <Card id="notices-section" className="overflow-hidden">
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
                  <FaBullhorn className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Announcements
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
                        {SORT_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => handleSortChange(option.value)}
                            className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                              sortOrder === option.value
                                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Notifications Badge */}
                <button
                  onClick={handleBellClick}
                  className="relative p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
                  aria-label="Mark all announcements as read and view them"
                >
                  <FaBell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
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
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
            <button
              onClick={() => setActiveTab("notices")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "notices"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Notices ({dashboardData.announcements.length})
            </button>
            <button
              onClick={() => setActiveTab("recent")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "recent"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Recent Activity
            </button>
          </div>

          {/* Content */}
          {activeTab === "notices" ? (
            <div className="min-h-[300px]">
              {filteredAnnouncements.length > 0 ? (
                <AnnouncementList 
                  announcements={filteredAnnouncements} 
                  unreadIds={unreadAnnouncements.map((a) => a.id)}
                  onMarkAsRead={handleMarkAsRead}
                  limit={5}
                />
              ) : (
                <EmptyState
                  icon={FaBullhorn}
                  title={searchQuery ? "No matching announcements" : "No announcements yet"}
                  description={
                    searchQuery 
                      ? "Try adjusting your search terms"
                      : "Create your first announcement to get started"
                  }
                />
              )}
            </div>
          ) : (
            <div className="text-gray-500 dark:text-gray-400 text-center py-12">
              Recent activity will appear here
            </div>
          )}
        </div>
      </Card>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Users
            </h3>
            <button
              onClick={() => navigate("/admin/users")}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            >
              View All →
            </button>
          </div>
          
          {dashboardData.users.length > 0 ? (
            <div className="space-y-3">
              {dashboardData.users.slice(0, 5).map((userItem) => (
                <div
                  key={userItem.id}
                  onClick={() => navigate(`/admin/users/${userItem.id}`)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors group"
                >
                  <Avatar
                    name={`${userItem.firstName} ${userItem.lastName}`}
                    src={userItem.avatar}
                    size="md"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {userItem.firstName} {userItem.lastName}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {userItem.email}
                      </span>
                      <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                        {formatUserRole(userItem)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No users found"
              description="Add users to get started"
            />
          )}
        </Card>

        {/* Recent Courses */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Courses
            </h3>
            <button
              onClick={() => navigate("/admin/courses")}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            >
              View All →
            </button>
          </div>
          
          {dashboardData.courses.length > 0 ? (
            <div className="space-y-3">
              {dashboardData.courses.slice(0, 5).map((course) => (
                <div
                  key={course.id}
                  onClick={() => navigate(`/admin/courses/${course.id}`)}
                  className="p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {course.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {course.code}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {course.subject}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full">
                        {course.academicYear}
                      </span>
                      <FaCalendarAlt className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No courses found"
              description="Create courses to organize your curriculum"
            />
          )}
        </Card>
      </div>

      {/* Quick Stats Footer */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {dashboardData.students.length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Active Students
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {dashboardData.teachers.length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Active Teachers
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
            {dashboardData.announcements.length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Total Announcements
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;