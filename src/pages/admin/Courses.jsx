// import { useState, useEffect, useMemo } from "react";
// import { useLocation } from "react-router-dom";
// import { getAllCourses, createCourse } from "../../services/courseService";
// import SubjectForm from "../../components/admin/SubjectForm";
// import { createSubject } from "../../services/subjectService";
// import CourseList from "../../components/courses/CourseList";
// import Modal from "../../components/common/Modal2";
// import CourseForm from "../../components/courses/CourseForm";
// import TeacherPicker from "../../components/common/TeacherPicker";
// import Button from "../../components/common/Button";
// import Loader from "../../components/common/Loader";
// import EmptyState from "../../components/common/EmptyState";

// const AdminCourses = () => {
//   const location = useLocation();
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false); // Course form modal
//   const [showTeacherModal, setShowTeacherModal] = useState(false); // select teacher first
//   const [selectedTeacherForNewCourse, setSelectedTeacherForNewCourse] = useState("");
//   const [showSubjectModal, setShowSubjectModal] = useState(false); // Subject form modal
//   // createdSubject stores an already-persisted subject (with id) when available.
//   const [createdSubject, setCreatedSubject] = useState(null);
//   // tempSubjectPayload holds the subject data submitted in step 1 but not yet persisted.
//   const [tempSubjectPayload, setTempSubjectPayload] = useState(null);
//   const [savingCourse, setSavingCourse] = useState(false);
//   const [savingSubject, setSavingSubject] = useState(false);
//   const [activeTab, setActiveTab] = useState(() =>
//     location.state?.tab === "inactive" ? "inactive" : "active"
//   );

//   const locationTab = location.state?.tab;

//   useEffect(() => {
//     if (!locationTab) return;
//     const normalized = locationTab === "inactive" ? "inactive" : "active";
//     setActiveTab(normalized);
//   }, [location.key, locationTab]);

//   const { activeCourses, inactiveCourses } = useMemo(() => {
//     const activeList = [];
//     const inactiveList = [];

//     courses.forEach((course) => {
//       if (!course) return;

//       const normalizedStatus =
//         typeof course.status === "string"
//           ? course.status.trim().toLowerCase()
//           : typeof course.Status === "string"
//           ? course.Status.trim().toLowerCase()
//           : null;

//       const rawActive =
//         course.isActive ??
//         course.IsActive ??
//         course.is_active ??
//         course.Is_active ??
//         (normalizedStatus === null
//           ? undefined
//           : normalizedStatus !== "inactive");

//       const isActive =
//         rawActive === undefined || rawActive === null
//           ? normalizedStatus === null
//             ? true
//             : normalizedStatus !== "inactive"
//           : Boolean(rawActive);

//       if (isActive) {
//         activeList.push(course);
//       } else {
//         inactiveList.push(course);
//       }
//     });

//     return { activeCourses: activeList, inactiveCourses: inactiveList };
//   }, [courses]);

//   const displayedCourses =
//     activeTab === "inactive" ? inactiveCourses : activeCourses;

//   const tabs = [
//     { id: "active", name: "Active", count: activeCourses.length },
//     { id: "inactive", name: "Inactive", count: inactiveCourses.length },
//   ];

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const data = await getAllCourses();
//         setCourses(data);
//       } catch (error) {
//         console.error("Error fetching courses:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourses();
//   }, [location.key]);

//   const handleCourseSubmit = async (formValues) => {
//     // Persist the subject first (if we only have a temp payload), then create the course.
//     // If course creation fails, attempt to delete the newly created subject (rollback).
//     setSavingCourse(true);
//     let persistedSubject = null;
//     try {
//       if (tempSubjectPayload && !tempSubjectPayload.id) {
//         setSavingSubject(true);
//         persistedSubject = await createSubject(tempSubjectPayload);
//         setSavingSubject(false);
//       } else if (createdSubject && createdSubject.id) {
//         persistedSubject = createdSubject;
//       }

//       // Prefer the subject we just persisted (if any). Fall back to any value the user entered.
//       const subjectIdToUse =
//         persistedSubject?.id ??
//         persistedSubject?.SubjectID ??
//         persistedSubject?.subjectId ??
//         formValues.subjectId ??
//         undefined;

//       // Prefer SubjectIDs array if provided by the form. Fall back to single subjectId
//       const payload = {
//         ...formValues,
//         subjectId: subjectIdToUse,
//         SubjectIDs:
//           Array.isArray(formValues?.SubjectIDs) && formValues.SubjectIDs.length
//             ? formValues.SubjectIDs
//             : subjectIdToUse !== undefined && subjectIdToUse !== null
//             ? [subjectIdToUse]
//             : undefined,
//       };

//       const created = await createCourse(payload);

//       setCourses((prev) => [...prev, created]);
//       setShowModal(false);
//       setCreatedSubject(null);
//       setTempSubjectPayload(null);
//     } catch (err) {
//       console.error(
//         "Error creating course (subject persisted may be rolled back):",
//         err
//       );
//       // rollback subject if it was persisted above
//       try {
//         if (persistedSubject && persistedSubject.id) {
//           const subjectService = await import("../../services/subjectService");
//           await subjectService.deleteSubject(persistedSubject.id);
//         }
//       } catch (delErr) {
//         console.warn("Failed to rollback created subject:", delErr);
//       }
//     } finally {
//       setSavingCourse(false);
//       setSavingSubject(false);
//     }
//   };

//   const handleSubjectSubmit = async (subjectData) => {
//     // Do NOT persist subject immediately. Keep payload in temp state and open the course form.
//     setTempSubjectPayload(subjectData);
//     setCreatedSubject(null);
//     setShowSubjectModal(false);
//     setShowModal(true);
//   };

//   if (loading) {
//     return <Loader className="py-12" />;
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
//           Courses
//         </h1>
//         <Button
//           onClick={() => {
//             setCreatedSubject(null);
//             // open teacher selection first
//             setSelectedTeacherForNewCourse("");
//             setShowTeacherModal(true);
//           }}
//           disabled={savingCourse}
//           className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
//         >
//           {savingCourse ? (
//             "Saving..."
//           ) : (
//             <>
//               <span className="font-semibold">Add Course</span>
//             </>
//           )}
//         </Button>
//       </div>

//       <div className="space-y-4">
//         <div className="border-b border-gray-200 dark:border-gray-700">
//           <nav
//             className="-mb-px flex space-x-6"
//             aria-label="Course status filters"
//           >
//             {tabs.map((tab) => {
//               const isCurrent = activeTab === tab.id;
//               const tabClassName = isCurrent
//                 ? "border-blue-500 text-blue-600 dark:text-blue-300"
//                 : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200";
//               const badgeClassName = isCurrent
//                 ? "inline-flex min-w-[1.75rem] justify-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
//                 : "inline-flex min-w-[1.75rem] justify-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600 dark:bg-gray-800/60 dark:text-gray-300";

//               return (
//                 <button
//                   key={tab.id}
//                   type="button"
//                   onClick={() => setActiveTab(tab.id)}
//                   className={`flex items-center gap-2 border-b-2 px-1 pb-3 text-sm font-medium focus:outline-none transition-colors ${tabClassName}`}
//                 >
//                   <span>{tab.name}</span>
//                   <span className={badgeClassName}>{tab.count}</span>
//                 </button>
//               );
//             })}
//           </nav>
//         </div>

//         <CourseList
//           courses={displayedCourses}
//           basePath="/admin/courses"
//           emptyState={
//             <EmptyState
//               title={
//                 activeTab === "active"
//                   ? "No active courses"
//                   : "No inactive courses"
//               }
//               description={
//                 activeTab === "active"
//                   ? "Create a course to make it available to students."
//                   : "Deactivated courses will be listed here."
//               }
//             />
//           }
//         />
//       </div>

//       {/* Teacher selection modal (step 1) */}
//       <Modal
//         isOpen={showTeacherModal}
//         onClose={() => setShowTeacherModal(false)}
//         title="Assign Teacher"
//       >
//         <div className="space-y-4">
//           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select a teacher</label>
//           <TeacherPicker
//             value={selectedTeacherForNewCourse}
//             onChange={(val) => setSelectedTeacherForNewCourse(val ?? "")}
//             showRefresh={true}
//           />

//           <div className="flex justify-end gap-3 pt-4">
//             <Button
//               type="button"
//               variant="secondary"
//               onClick={() => setShowTeacherModal(false)}
//               disabled={savingCourse}
//             >
//               Cancel
//             </Button>
//             <Button
//               type="button"
//               variant="primary"
//               onClick={() => {
//                 // require selection before proceeding
//                 if (!selectedTeacherForNewCourse) return;
//                 setShowTeacherModal(false);
//                 // open Course modal and pass selected teacher via initialData
//                 setShowModal(true);
//               }}
//             >
//               Next
//             </Button>
//           </div>
//         </div>
//       </Modal>

//       {/* Course form modal (single-step) */}
//       <Modal
//         isOpen={showModal}
//         onClose={() => {
//           setShowModal(false);
//           setCreatedSubject(null);
//         }}
//         title="Add Course"
//       >
//         <CourseForm
//           step={1}
//           onSubmit={handleCourseSubmit}
//           onCancel={() => {
//             setShowModal(false);
//             setCreatedSubject(null);
//           }}
//           loading={savingCourse}
//           initialData={{
//             subjectId:
//               createdSubject?.id ??
//               createdSubject?.SubjectID ??
//               createdSubject?.subjectId ??
//               "",
//             teacherId: selectedTeacherForNewCourse || "",
//           }}
//           hideAssignTeacher={true}
//         />
//       </Modal>
//     </div>
//   );
// };

// export default AdminCourses;
import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { getAllCourses, createCourse } from "../../services/courseService";
import SubjectForm from "../../components/admin/SubjectForm";
import { createSubject } from "../../services/subjectService";
import CourseList from "../../components/courses/CourseList";
import Modal from "../../components/common/Modal2";
import CourseForm from "../../components/courses/CourseForm";
import TeacherPicker from "../../components/common/TeacherPicker";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import { 
  FiBook, 
  FiUsers, 
  FiCalendar, 
  FiPlus, 
  FiFilter,
  FiTrendingUp,
  FiClock,
  FiChevronRight
} from "react-icons/fi";
import { TbBooks, TbCertificate } from "react-icons/tb";

const AdminCourses = () => {
  const location = useLocation();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [selectedTeacherForNewCourse, setSelectedTeacherForNewCourse] = useState("");
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [createdSubject, setCreatedSubject] = useState(null);
  const [tempSubjectPayload, setTempSubjectPayload] = useState(null);
  const [savingCourse, setSavingCourse] = useState(false);
  const [savingSubject, setSavingSubject] = useState(false);
  const [activeTab, setActiveTab] = useState(() =>
    location.state?.tab === "inactive" ? "inactive" : "active"
  );

  const locationTab = location.state?.tab;

  useEffect(() => {
    if (!locationTab) return;
    const normalized = locationTab === "inactive" ? "inactive" : "active";
    setActiveTab(normalized);
  }, [location.key, locationTab]);

  // Calculate course statistics
  const courseStats = useMemo(() => {
    const total = courses.length;
    const active = courses.filter(course => {
      const normalizedStatus = typeof course.status === "string"
        ? course.status.trim().toLowerCase()
        : typeof course.Status === "string"
        ? course.Status.trim().toLowerCase()
        : null;
      
      const rawActive = course.isActive ?? course.IsActive ?? course.is_active ?? course.Is_active ??
        (normalizedStatus === null ? undefined : normalizedStatus !== "inactive");
      
      return rawActive === undefined || rawActive === null
        ? (normalizedStatus === null ? true : normalizedStatus !== "inactive")
        : Boolean(rawActive);
    }).length;
    
    const inactive = total - active;
    const withSubjects = courses.filter(c => 
      (c.SubjectIDs && c.SubjectIDs.length > 0) || 
      c.subjects?.length > 0 || 
      c.subjectId
    ).length;
    
    return { total, active, inactive, withSubjects };
  }, [courses]);

  const { activeCourses, inactiveCourses } = useMemo(() => {
    const activeList = [];
    const inactiveList = [];

    courses.forEach((course) => {
      if (!course) return;

      const normalizedStatus =
        typeof course.status === "string"
          ? course.status.trim().toLowerCase()
          : typeof course.Status === "string"
          ? course.Status.trim().toLowerCase()
          : null;

      const rawActive =
        course.isActive ??
        course.IsActive ??
        course.is_active ??
        course.Is_active ??
        (normalizedStatus === null
          ? undefined
          : normalizedStatus !== "inactive");

      const isActive =
        rawActive === undefined || rawActive === null
          ? normalizedStatus === null
            ? true
            : normalizedStatus !== "inactive"
          : Boolean(rawActive);

      if (isActive) {
        activeList.push(course);
      } else {
        inactiveList.push(course);
      }
    });

    return { activeCourses: activeList, inactiveCourses: inactiveList };
  }, [courses]);

  const displayedCourses =
    activeTab === "inactive" ? inactiveCourses : activeCourses;

  const tabs = [
    { id: "active", name: "Active", count: activeCourses.length, icon: FiTrendingUp },
    { id: "inactive", name: "Inactive", count: inactiveCourses.length, icon: FiClock },
  ];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await getAllCourses();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [location.key]);

  const handleCourseSubmit = async (formValues) => {
    setSavingCourse(true);
    let persistedSubject = null;
    try {
      if (tempSubjectPayload && !tempSubjectPayload.id) {
        setSavingSubject(true);
        persistedSubject = await createSubject(tempSubjectPayload);
        setSavingSubject(false);
      } else if (createdSubject && createdSubject.id) {
        persistedSubject = createdSubject;
      }

      const subjectIdToUse =
        persistedSubject?.id ??
        persistedSubject?.SubjectID ??
        persistedSubject?.subjectId ??
        formValues.subjectId ??
        undefined;

      const payload = {
        ...formValues,
        subjectId: subjectIdToUse,
        SubjectIDs:
          Array.isArray(formValues?.SubjectIDs) && formValues.SubjectIDs.length
            ? formValues.SubjectIDs
            : subjectIdToUse !== undefined && subjectIdToUse !== null
            ? [subjectIdToUse]
            : undefined,
      };

      const created = await createCourse(payload);
      setCourses((prev) => [...prev, created]);
      setShowModal(false);
      setCreatedSubject(null);
      setTempSubjectPayload(null);
      setSelectedTeacherForNewCourse("");
    } catch (err) {
      console.error("Error creating course:", err);
      try {
        if (persistedSubject && persistedSubject.id) {
          const subjectService = await import("../../services/subjectService");
          await subjectService.deleteSubject(persistedSubject.id);
        }
      } catch (delErr) {
        console.warn("Failed to rollback created subject:", delErr);
      }
    } finally {
      setSavingCourse(false);
      setSavingSubject(false);
    }
  };

  const handleSubjectSubmit = async (subjectData) => {
    setTempSubjectPayload(subjectData);
    setCreatedSubject(null);
    setShowSubjectModal(false);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Loader className="py-20" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Course Management
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Manage all courses, assign teachers, and track course performance
              </p>
            </div>
            <Button
              onClick={() => {
                setCreatedSubject(null);
                setSelectedTeacherForNewCourse("");
                setShowTeacherModal(true);
              }}
              disabled={savingCourse}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 group"
            >
              {savingCourse ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </span>
              ) : (
                <>
                  <FiPlus className="text-lg group-hover:rotate-90 transition-transform" />
                  <span className="font-semibold">Add New Course</span>
                </>
              )}
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-5 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Total Courses</p>
                  <p className="text-3xl font-bold mt-2">{courseStats.total}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <TbBooks className="text-2xl" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Active Courses</p>
                  <p className="text-3xl font-bold mt-2">{courseStats.active}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <FiTrendingUp className="text-2xl" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-5 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Courses with Subjects</p>
                  <p className="text-3xl font-bold mt-2">{courseStats.withSubjects}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <TbCertificate className="text-2xl" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-500 to-gray-600 rounded-2xl p-5 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Inactive Courses</p>
                  <p className="text-3xl font-bold mt-2">{courseStats.inactive}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <FiClock className="text-2xl" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Tabs Section */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-1 px-6" aria-label="Course status filters">
              {tabs.map((tab) => {
                const isCurrent = activeTab === tab.id;
                const Icon = tab.icon;
                
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200
                      ${isCurrent 
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }
                      first:rounded-tl-2xl last:rounded-tr-2xl
                    `}
                  >
                    <Icon className={`text-lg ${isCurrent ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                    <span>{tab.name}</span>
                    <span className={`
                      ml-2 px-2 py-0.5 text-xs font-semibold rounded-full transition-all
                      ${isCurrent 
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' 
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700/60 dark:text-gray-300'
                      }
                    `}>
                      {tab.count}
                    </span>
                    {isCurrent && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Course List Section */}
          <div className="p-6">
            <CourseList
              courses={displayedCourses}
              basePath="/admin/courses"
              emptyState={
                <EmptyState
                  title={
                    activeTab === "active"
                      ? "No active courses found"
                      : "No inactive courses found"
                  }
                  description={
                    activeTab === "active"
                      ? "Create a course to make it available to students. Click 'Add New Course' to get started."
                      : "Deactivated courses will appear here."
                  }
                  icon={activeTab === "active" ? FiBook : FiClock}
                  action={
                    activeTab === "active" ? (
                      <Button
                        onClick={() => setShowTeacherModal(true)}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                      >
                        <FiPlus className="mr-2" />
                        Create Your First Course
                      </Button>
                    ) : null
                  }
                />
              }
            />
          </div>
        </div>

        {/* Teacher Selection Modal */}
        <Modal
          isOpen={showTeacherModal}
          onClose={() => {
            if (!savingCourse) {
              setShowTeacherModal(false);
              setSelectedTeacherForNewCourse("");
            }
          }}
          title={
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                <FiUsers className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  Assign Teacher to Course
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Select a teacher to be assigned to the new course
                </p>
              </div>
            </div>
          }
        >
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong className="font-semibold">Tip:</strong> Select a teacher who will be responsible for this course. You can change this later in the course settings.
              </p>
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Select Teacher *
              </label>
              <TeacherPicker
                value={selectedTeacherForNewCourse}
                onChange={(val) => setSelectedTeacherForNewCourse(val ?? "")}
                showRefresh={true}
                className="border-2 border-blue-100 dark:border-blue-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowTeacherModal(false);
                  setSelectedTeacherForNewCourse("");
                }}
                disabled={savingCourse}
                className="px-6"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={() => {
                  if (!selectedTeacherForNewCourse) {
                    return;
                  }
                  setShowTeacherModal(false);
                  setShowModal(true);
                }}
                disabled={!selectedTeacherForNewCourse}
                className="px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
              >
                <span className="flex items-center gap-2">
                  Continue
                  <FiChevronRight />
                </span>
              </Button>
            </div>
          </div>
        </Modal>

        {/* Course Form Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => {
            if (!savingCourse) {
              setShowModal(false);
              setCreatedSubject(null);
            }
          }}
          title={
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                <TbBooks className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  {selectedTeacherForNewCourse ? `Create New Course` : "Add Course"}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Fill in the course details below
                </p>
              </div>
            </div>
          }
          size="lg"
        >
          <CourseForm
            step={1}
            onSubmit={handleCourseSubmit}
            onCancel={() => {
              setShowModal(false);
              setCreatedSubject(null);
            }}
            loading={savingCourse}
            initialData={{
              subjectId:
                createdSubject?.id ??
                createdSubject?.SubjectID ??
                createdSubject?.subjectId ??
                "",
              teacherId: selectedTeacherForNewCourse || "",
            }}
            hideAssignTeacher={true}
          />
        </Modal>
      </div>
    </div>
  );
};

export default AdminCourses;