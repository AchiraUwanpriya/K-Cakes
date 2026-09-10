// import { useState, useEffect } from "react";
// import { Link, useParams } from "react-router-dom";
// import { useAuth } from "../../contexts/AuthContext";
// import {
//   getTeacherCourses,
//   getCourseDetails,
//   createCourse,
// } from "../../services/courseService";
// import CourseList from "../../components/courses/CourseList";
// import CourseView from "../../components/courses/CourseView";
// import EmptyState from "../../components/common/EmptyState";
// import Loader from "../../components/common/Loader";

// // import Modal from "../../components/common/Modal";

// import Modal from "../../components/common/Modal2";

// import CourseForm from "../../components/courses/CourseForm";
// import Button from "../../components/common/Button";

// const TeacherCourses = () => {
//   const { user } = useAuth();
//   const { id } = useParams();
//   const [courses, setCourses] = useState([]);
//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const teacherId =
//     user?.id ??
//     user?.UserID ??
//     user?.userID ??
//     user?.teacherId ??
//     user?.TeacherId ??
//     null;

//   useEffect(() => {
//     const fetchCourses = async () => {
//       if (!teacherId) {
//         setCourses([]);
//         setLoading(false);
//         return;
//       }

//       setLoading(true);
//       try {
//         const data = await getTeacherCourses(teacherId);
//         setCourses(data);

//         if (id) {
//           const course = await getCourseDetails(id);
//           setSelectedCourse(course);
//         }
//       } catch (error) {
//         console.error("Error fetching courses:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourses();
//   }, [teacherId, id]);

//   if (loading) {
//     return <Loader className="py-12" />;
//   }

//   if (id && selectedCourse) {
//     return <CourseView course={selectedCourse} />;
//   }

//   return (
//     <div className="space-y-6">
//       <h1 className="text-xl sm:text-2xl font-sans tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-indigo-700 to-violet-700 dark:from-white dark:via-indigo-300 dark:to-violet-300">
//         My Courses
//       </h1>

//       {courses.length > 0 ? (
//         <CourseList courses={courses} />
//       ) : (
//         <EmptyState
//           title="No courses assigned"
//           description="You don't have any courses assigned to you yet."
//           action={
//             <Button variant="primary" onClick={() => setShowModal(true)}>
//               Request New Course
//             </Button>
//           }
//         />
//       )}

//       <Modal
//         isOpen={showModal}
//         onClose={() => setShowModal(false)}
//         title="Request New Course"
//       >
//         <CourseForm
//           onSubmit={async (data) => {
//             try {
//               const newCourse = await createCourse({
//                 ...data,
//                 teacherId,
//               });
//               setCourses((prev) => [...prev, newCourse]);
//               setShowModal(false);
//             } catch (err) {
//               console.error("Failed to create course", err);
//             }
//           }}
//           onCancel={() => setShowModal(false)}
//           hideAssignTeacher={true}
//         />
//       </Modal>
//     </div>
//   );
// };

// export default TeacherCourses;
  
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  getTeacherCourses,
  getTeacherCourseStudents,
  getTeacherCoursesWithStudents,
  getCourseStudents,
  getCourseDetails,
  createCourse,
} from "../../services/courseService";
import { getStudentsBySubject } from "../../services/subjectService";
import CourseList from "../../components/courses/CourseList";
import CourseView from "../../components/courses/CourseView";
import EmptyState from "../../components/common/EmptyState";
import Loader from "../../components/common/Loader";
import Modal from "../../components/common/Modal2";
import CourseForm from "../../components/courses/CourseForm";
import Button from "../../components/common/Button";
import { 
  PlusCircle, 
  BookOpen, 
  TrendingUp, 
  Users,
  ChevronRight,
  Sparkles
} from "lucide-react";

// Helper to fetch and count only students who are enrolled in the teacher's course list
const fetchTeacherCoursesEnrolledStudents = async (teacherId, courses) => {
  if (!Array.isArray(courses) || courses.length === 0) {
    return [];
  }

  // 1. Build authoritative sets of IDs and names for the teacher's course list
  const validCourseIdSet = new Set(
    courses
      .flatMap((c) => [c.id, c.CourseID, c.courseId, c.courseID, c.CourseId])
      .filter((v) => v !== null && v !== undefined)
      .map((v) => String(v).trim().toLowerCase())
  );

  const collectedStudents = [];

  // Strategy A: Fetch students specifically for each course in the teacher's course list
  const coursePromises = courses.map(async (course) => {
    const courseId = course?.id ?? course?.CourseID ?? course?.courseId;
    if (!courseId) return [];

    const studentsForCourse = [];

    // 1. Try teacher-scoped course students endpoint
    if (teacherId) {
      try {
        const res = await getTeacherCourseStudents(teacherId, courseId);
        if (Array.isArray(res?.students) && res.students.length > 0) {
          studentsForCourse.push(...res.students);
        }
      } catch (_) {}
    }

    // 2. Try general course students endpoint (/Courses/{courseId}/students)
    try {
      const legacy = await getCourseStudents(courseId);
      if (Array.isArray(legacy) && legacy.length > 0) {
        studentsForCourse.push(...legacy);
      }
    } catch (_) {}

    // 3. Try subject/class students if course has subjects
    let subIds = course.subjectIds ?? course.SubjectIDs ?? [];
    if (!Array.isArray(subIds)) subIds = [subIds].filter(Boolean);

    // If subjects weren't provided on summary course, fetch course details
    if (subIds.length === 0 && studentsForCourse.length === 0) {
      try {
        const details = await getCourseDetails(courseId);
        if (details) {
          const detailSubIds = details.subjectIds ?? details.SubjectIDs ?? [];
          if (Array.isArray(detailSubIds) && detailSubIds.length > 0) {
            subIds = detailSubIds;
          }
        }
      } catch (_) {}
    }

    if (subIds.length > 0) {
      try {
        const subRes = await Promise.allSettled(
          subIds.map((sid) => getStudentsBySubject(sid))
        );
        subRes.forEach((r) => {
          if (r.status === "fulfilled") {
            const list = Array.isArray(r.value)
              ? r.value
              : Array.isArray(r.value?.students)
              ? r.value.students
              : [];
            studentsForCourse.push(...list);
          }
        });
      } catch (_) {}
    }

    return studentsForCourse;
  });

  // Strategy B: Teacher's course-students grouped endpoint (/Teachers/{teacherId}/Courses/Students)
  const teacherGroupPromise = (async () => {
    if (!teacherId) return [];
    try {
      const grouped = await getTeacherCoursesWithStudents(teacherId);
      if (Array.isArray(grouped) && grouped.length > 0) {
        const matchedStudents = [];
        grouped.forEach(({ course, students }) => {
          const cid = course?.id ?? course?.CourseID ?? course?.courseId;
          if (cid && validCourseIdSet.has(String(cid).trim().toLowerCase())) {
            if (Array.isArray(students)) {
              matchedStudents.push(...students);
            }
          }
        });
        return matchedStudents;
      }
    } catch (_) {}
    return [];
  })();

  const [courseResults, teacherGroupResults] = await Promise.all([
    Promise.allSettled(coursePromises),
    teacherGroupPromise,
  ]);

  courseResults.forEach((r) => {
    if (r.status === "fulfilled" && Array.isArray(r.value)) {
      collectedStudents.push(...r.value);
    }
  });

  if (Array.isArray(teacherGroupResults)) {
    collectedStudents.push(...teacherGroupResults);
  }

  // Deduplicate students by unique student identifier
  const uniqueStudentsMap = new Map();
  for (const student of collectedStudents) {
    if (!student) continue;

    const studentKey =
      student.StudentID ??
      student.studentID ??
      student.studentId ??
      student.UserID ??
      student.userID ??
      student.userId ??
      student.id ??
      student.EnrollmentID ??
      student.enrollmentId ??
      null;

    const key = studentKey !== null ? String(studentKey).trim() : null;
    if (key && !uniqueStudentsMap.has(key)) {
      uniqueStudentsMap.set(key, student);
    }
  }

  return Array.from(uniqueStudentsMap.values());
};

const TeacherCourses = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    students: 0,
  });

  const teacherId =
    user?.TeacherID ??
    user?.teacherID ??
    user?.teacherId ??
    user?.TeacherId ??
    user?.UserID ??
    user?.userID ??
    user?.userId ??
    user?.id ??
    user?.Teacher?.TeacherID ??
    user?.Teacher?.id ??
    null;

  useEffect(() => {
    let isMounted = true;

    const fetchCourses = async () => {
      if (!teacherId) {
        setCourses([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await getTeacherCourses(teacherId);
        if (!isMounted) return;
        setCourses(data);

        // Calculate active courses
        const activeCourses = data.filter(
          (course) =>
            course.status === "active" ||
            course.isActive === true ||
            course.IsActive === true
        ).length;

        // Fetch students strictly enrolled in the courses that belong to this teacher
        const enrolledStudents = await fetchTeacherCoursesEnrolledStudents(teacherId, data);
        if (!isMounted) return;

        const totalStudents = enrolledStudents.length;
        
        setStats({
          total: data.length,
          active: activeCourses,
          students: totalStudents,
        });

        if (id) {
          const course = await getCourseDetails(id);
          if (isMounted) {
            setSelectedCourse(course);
          }
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCourses();

    return () => {
      isMounted = false;
    };
  }, [teacherId, id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
            <Sparkles className="w-6 h-6 text-indigo-500 animate-pulse absolute -top-2 -right-2" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            Loading your courses...
          </p>
        </div>
      </div>
    );
  }

  if (id && selectedCourse) {
    return <CourseView course={selectedCourse} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900/20 p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
          <div>
            <div className="flex items-center gap-2.5 sm:gap-3 mb-1.5 sm:mb-2">
              <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl shrink-0">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                My <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 dark:from-indigo-400 dark:via-purple-400 dark:to-violet-400">Courses</span>
              </h1>
            </div>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl">
              Manage your teaching materials, track student progress, and create new learning experiences.
            </p>
          </div>
          
          {/* <Button
            variant="primary"
            onClick={() => setShowModal(true)}
            className="group"
            size="lg"
          >
            <PlusCircle className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" />
            Request New Course
          </Button> */}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-3.5 sm:gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Total Courses</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
              <div className="p-2.5 sm:p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl shrink-0">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center text-xs sm:text-sm text-green-600 dark:text-green-400">
                <TrendingUp className="w-4 h-4 mr-1 shrink-0" />
                <span>{stats.active} active</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Active Courses</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{stats.active}</p>
              </div>
              <div className="p-2.5 sm:p-3 bg-green-50 dark:bg-green-900/30 rounded-xl shrink-0">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Ready for teaching
              </div>
            </div>
          </div>

          {/* <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Total Students</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{stats.students}</p>
              </div>
              <div className="p-2.5 sm:p-3 bg-purple-50 dark:bg-purple-900/30 rounded-xl shrink-0">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Across all courses
              </div>
            </div>
          </div> */}
        </div>

        {/* Courses Section */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 sm:gap-2.5">
                Your Course Portfolio
                <span className="px-2.5 py-0.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs font-semibold rounded-full">
                  {courses.length} {courses.length === 1 ? "course" : "courses"}
                </span>
              </h2>
            </div>
            
            {courses.length > 0 && (
              <Button
                variant="ghost"
                onClick={() => setShowModal(true)}
                className="group text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 inline-flex items-center text-sm font-medium"
              >
                <PlusCircle className="w-4 h-4 mr-1.5 group-hover:rotate-90 transition-transform shrink-0" />
                Add Course
              </Button>
            )}
          </div>

          {courses.length > 0 ? (
            <CourseList courses={courses} showCount={false} />
          ) : (
            <div className="py-12 sm:py-16">
              <EmptyState
                title="No courses yet"
                description="Start your teaching journey by creating your first course. Design engaging content and share your knowledge with students."
                icon={
                  <div className="relative">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
                      <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-full flex items-center justify-center">
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                  </div>
                }
                action={
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <Button
                      variant="primary"
                      onClick={() => setShowModal(true)}
                      size="lg"
                      className="group w-full sm:w-auto"
                    >
                      <PlusCircle className="w-5 h-5 mr-2 transition-transform group-hover:scale-110 shrink-0" />
                      Create Your First Course
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="group w-full sm:w-auto"
                    >
                      View Tutorial
                      <ChevronRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1 shrink-0" />
                    </Button>
                  </div>
                }
              />
            </div>
          )}
        </div>

        {/* Quick Tips Section */}
        {courses.length > 0 && (
          <div className="bg-gradient-to-r from-indigo-50/80 to-purple-50/80 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-indigo-100 dark:border-indigo-800">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="p-2.5 sm:p-3 bg-white dark:bg-gray-800 rounded-xl shadow-xs shrink-0 mt-0.5">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1.5 sm:mb-2 text-base sm:text-lg">
                  Teaching Tips
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 leading-relaxed">
                  Engage your students with interactive content and regular updates. Courses with weekly updates have 3x higher completion rates.
                </p>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-xs sm:text-sm font-medium shadow-xs border border-indigo-100/60 dark:border-gray-700/60 whitespace-nowrap">
                    <span>💡</span> Update weekly
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-xs sm:text-sm font-medium shadow-xs border border-indigo-100/60 dark:border-gray-700/60 whitespace-nowrap">
                    <span>🎯</span> Set clear goals
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-xs sm:text-sm font-medium shadow-xs border border-indigo-100/60 dark:border-gray-700/60 whitespace-nowrap">
                    <span>💬</span> Encourage discussion
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal for Creating New Course */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="p-1.5 sm:p-2 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-lg shrink-0">
              <PlusCircle className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white truncate">
                Request New Course
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                Fill in the details to create your new course
              </p>
            </div>
          </div>
        }
        size="lg"
      >
        <div className="p-1">
          <CourseForm
            onSubmit={async (data) => {
              try {
                const newCourse = await createCourse({
                  ...data,
                  teacherId,
                });
                setCourses((prev) => [...prev, newCourse]);
                setShowModal(false);
                
                // Update stats
                setStats(prev => ({
                  ...prev,
                  total: prev.total + 1,
                  active: prev.active + 1,
                }));
              } catch (err) {
                console.error("Failed to create course", err);
              }
            }}
            onCancel={() => setShowModal(false)}
            hideAssignTeacher={true}
          />
        </div>
      </Modal>
    </div>
  );
};

export default TeacherCourses;