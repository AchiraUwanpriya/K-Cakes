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
  getCourseDetails,
  createCourse,
} from "../../services/courseService";
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
    user?.id ??
    user?.UserID ??
    user?.userID ??
    user?.teacherId ??
    user?.TeacherId ??
    null;

  useEffect(() => {
    const fetchCourses = async () => {
      if (!teacherId) {
        setCourses([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await getTeacherCourses(teacherId);
        setCourses(data);

        // Calculate stats
        const activeCourses = data.filter(course => course.status === 'active').length;
        const totalStudents = data.reduce((sum, course) => sum + (course.enrolledStudents || 0), 0);
        
        setStats({
          total: data.length,
          active: activeCourses,
          students: totalStudents,
        });

        if (id) {
          const course = await getCourseDetails(id);
          setSelectedCourse(course);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900/20 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl">
                <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                My <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 dark:from-indigo-400 dark:via-purple-400 dark:to-violet-400">Courses</span>
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Total Courses</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>{stats.active} active</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Active Courses</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.active}</p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Ready for teaching
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Total Students</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.students}</p>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-xl">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Across all courses
              </div>
            </div>
          </div>
        </div>

        {/* Courses Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              Your Course Portfolio
              <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium rounded-full">
                {courses.length} courses
              </span>
            </h2>
            
            {courses.length > 0 && (
              <Button
                variant="ghost"
                onClick={() => setShowModal(true)}
                className="group text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
              >
                <PlusCircle className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" />
                Add Course
              </Button>
            )}
          </div>

          {courses.length > 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <CourseList courses={courses} />
            </div>
          ) : (
            <div className="py-16">
              <EmptyState
                title="No courses yet"
                description="Start your teaching journey by creating your first course. Design engaging content and share your knowledge with students."
                icon={
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-full flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                  </div>
                }
                action={
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="primary"
                      onClick={() => setShowModal(true)}
                      size="lg"
                      className="group"
                    >
                      <PlusCircle className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" />
                      Create Your First Course
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="group"
                    >
                      View Tutorial
                      <ChevronRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                }
              />
            </div>
          )}
        </div>

        {/* Quick Tips Section */}
        {courses.length > 0 && (
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-800">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Teaching Tips
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Engage your students with interactive content and regular updates. Courses with weekly updates have 3x higher completion rates.
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="px-3 py-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full">
                    💡 Update weekly
                  </span>
                  <span className="px-3 py-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full">
                    🎯 Set clear goals
                  </span>
                  <span className="px-3 py-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full">
                    💬 Encourage discussion
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
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-lg">
              <PlusCircle className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Request New Course
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
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