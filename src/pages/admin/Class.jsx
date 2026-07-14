// import { useEffect, useState } from "react";
// import Modal from "../../components/common/Modal2";
// import Button from "../../components/common/Button";
// import Toast from "../../components/common/Toast";
// import {
//   getAllSubjects,
//   createSubject,
//   deleteSubject,
// } from "../../services/subjectService";
// import { FiTrash2, FiPlus } from "react-icons/fi";

// const ClassPage = () => {
//   const [subjects, setSubjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showCreate, setShowCreate] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [toast, setToast] = useState({ msg: "", type: "success" });

//   const [form, setForm] = useState({
//     subjectName: "",
//     subjectCode: "",
//     description: "",
//     totalFee: "",
//     duration_In_Months: "",
//     monthlyFee: "",
//   });

//   useEffect(() => {
//     let mounted = true;
//     const load = async () => {
//       try {
//         setLoading(true);
//         const all = await getAllSubjects();
//         if (!mounted) return;
//         setSubjects(all || []);
//       } catch (err) {
//         console.error("Failed to load subjects", err);
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     };
//     load();
//     return () => (mounted = false);
//   }, []);

//   const handleChange = (key, value) => {
//     setForm((f) => ({ ...f, [key]: value }));
//   };

//   const handleCreate = async () => {
//     try {
//       setSaving(true);
//       const payload = {
//         subjectName: form.subjectName,
//         subjectCode: form.subjectCode,
//         description: form.description,
//         totalFee: form.totalFee ? Number(form.totalFee) : undefined,
//         duration_In_Months: form.duration_In_Months
//           ? Number(form.duration_In_Months)
//           : undefined,
//         monthlyFee: form.monthlyFee ? Number(form.monthlyFee) : undefined,
//       };
//       const created = await createSubject(payload);
//       setSubjects((s) => [created, ...(s || [])]);
//       setShowCreate(false);
//       setForm({
//         subjectName: "",
//         subjectCode: "",
//         description: "",
//         totalFee: "",
//         duration_In_Months: "",
//         monthlyFee: "",
//       });
//       setToast({ msg: "Class created", type: "success" });
//     } catch (err) {
//       console.error(err);
//       setToast({ msg: "Failed to create class", type: "error" });
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this class?")) return;
//     try {
//       await deleteSubject(id);
//       setSubjects((s) => (s || []).filter((x) => String(x.id) !== String(id)));
//       setToast({ msg: "Class deleted", type: "success" });
//     } catch (err) {
//       console.error(err);
//       setToast({ msg: "Failed to delete class", type: "error" });
//     }
//   };

//   return (
//     <div className="p-6">
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-2xl font-semibold">Class</h2>
//         <div className="flex items-center gap-2">
//           <Button onClick={() => setShowCreate(true)}>
//             <span className="inline-flex items-center gap-2">
//               <FiPlus /> Add Class
//             </span>
//           </Button>
//         </div>
//       </div>

//       {loading ? (
//         <div className="text-sm text-gray-500">Loading classes…</div>
//       ) : subjects && subjects.length ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           {subjects.map((s) => (
//             <div key={String(s.id)} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
//               <div className="flex items-start justify-between">
//                 <div>
//                   <h3 className="font-semibold text-lg">{s.name || s.subjectName}</h3>
//                   <div className="text-sm text-gray-500">{s.subjectCode || s.subjectCode}</div>
//                 </div>
//                 <button
//                   onClick={() => handleDelete(s.id)}
//                   className="text-red-500 hover:text-red-600 p-2 rounded"
//                   title="Delete class"
//                 >
//                   <FiTrash2 />
//                 </button>
//               </div>
//               <p className="mt-3 text-sm text-gray-600">{s.description}</p>
//               <div className="mt-3 text-sm text-gray-700 flex gap-3">
//                 <div>
//                   <strong>Total:</strong> {s.totalFee ?? "-"}
//                 </div>
//                 <div>
//                   <strong>Duration:</strong> {s.duration_In_Months ?? "-"} months
//                 </div>
//                 <div>
//                   <strong>Monthly:</strong> {s.monthlyFee ?? "-"}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="text-sm text-gray-500">No classes found.</div>
//       )}

//       <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Add Class">
//         <div className="space-y-3">
//           <label className="block">
//             <div className="text-sm font-medium mb-1">Name</div>
//             <input
//               value={form.subjectName}
//               onChange={(e) => handleChange("subjectName", e.target.value)}
//               className="w-full rounded border px-3 py-2"
//             />
//           </label>

//           <label className="block">
//             <div className="text-sm font-medium mb-1">Code</div>
//             <input
//               value={form.subjectCode}
//               onChange={(e) => handleChange("subjectCode", e.target.value)}
//               className="w-full rounded border px-3 py-2"
//             />
//           </label>

//           <label className="block">
//             <div className="text-sm font-medium mb-1">Description</div>
//             <textarea
//               value={form.description}
//               onChange={(e) => handleChange("description", e.target.value)}
//               className="w-full rounded border px-3 py-2"
//             />
//           </label>

//           <div className="flex gap-2">
//             <label className="flex-1">
//               <div className="text-sm font-medium mb-1">Total Fee</div>
//               <input
//                 value={form.totalFee}
//                 onChange={(e) => handleChange("totalFee", e.target.value)}
//                 className="w-full rounded border px-3 py-2"
//               />
//             </label>
//             <label className="w-40">
//               <div className="text-sm font-medium mb-1">Duration (months)</div>
//               <input
//                 value={form.duration_In_Months}
//                 onChange={(e) => handleChange("duration_In_Months", e.target.value)}
//                 className="w-full rounded border px-3 py-2"
//               />
//             </label>
//             <label className="w-40">
//               <div className="text-sm font-medium mb-1">Monthly Fee</div>
//               <input
//                 value={form.monthlyFee}
//                 onChange={(e) => handleChange("monthlyFee", e.target.value)}
//                 className="w-full rounded border px-3 py-2"
//               />
//             </label>
//           </div>

//           <div className="flex justify-end gap-2 mt-2">
//             <Button variant="secondary" onClick={() => setShowCreate(false)} disabled={saving}>
//               Cancel
//             </Button>
//             <Button variant="primary" onClick={handleCreate} disabled={saving}>
//               {saving ? "Saving..." : "Create"}
//             </Button>
//           </div>
//         </div>
//       </Modal>

//       <Toast message={toast.msg} type={toast.type} onClose={() => setToast({ msg: "", type: "success" })} />
//     </div>
//   );
// };

// export default ClassPage;
import { useEffect, useState } from "react";
import Modal from "../../components/common/Modal2";
import Button from "../../components/common/Button";
import Toast from "../../components/common/Toast";
import {
  getAllSubjects,
  createSubject,
  deleteSubject,
} from "../../services/subjectService";
import { FiTrash2, FiPlus, FiEdit, FiBookOpen, FiClock, FiDollarSign, FiCalendar } from "react-icons/fi";
import { TbBooks } from "react-icons/tb";
import SubjectForm from "../../components/admin/SubjectForm";

const ClassPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingIds, setDeletingIds] = useState(new Set());
  const [toast, setToast] = useState({ msg: "", type: "success", visible: false });

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const all = await getAllSubjects();
        if (!mounted) return;
        // Normalize returned items (getAllSubjects may already return mapped objects)
        const formattedSubjects = Array.isArray(all)
          ? all.map((item) => ({
              id: item?.id ?? item?.subjectID ?? item?.SubjectID ?? item?.SubjectId ?? null,
              name: item?.name ?? item?.subjectName ?? item?.SubjectName ?? "",
              code: item?.subjectCode ?? item?.code ?? "",
              description: item?.description ?? item?.Description ?? "",
              totalFee: item?.totalFee ?? item?.fee ?? null,
              duration_In_Months: item?.duration_In_Months ?? item?.duration ?? null,
              monthlyFee: item?.monthlyFee ?? item?.monthly ?? null,
              courses:
                item?.courses ||
                item?.courseSubjects?.map((cs) => ({
                  courseName: cs?.course?.courseName ?? cs?.courseName ?? "",
                  courseCode: cs?.course?.courseCode ?? cs?.courseCode ?? "",
                  isActive: cs?.isActive ?? false,
                  teacher:
                    ((cs?.course?.teacher?.user?.firstName || "") +
                      (cs?.course?.teacher?.user?.lastName
                        ? " " + cs?.course?.teacher?.user?.lastName
                        : "")) || "",
                })) || [],
            }))
          : [];
        setSubjects(formattedSubjects);
      } catch (err) {
        console.error("Failed to load subjects", err);
        setToast({
          msg: "Failed to load classes",
          type: "error",
          visible: true,
        });
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => (mounted = false);
  }, []);

  // Handler used by SubjectForm: receives payload prepared by SubjectForm
  const handleCreateFromForm = async (payload) => {
    try {
      setSaving(true);
      const created = await createSubject(payload);
      const newSubject = {
        id: created?.id ?? created?.subjectID ?? created?.SubjectID ?? null,
        name: created?.name ?? created?.subjectName ?? "",
        code: created?.subjectCode ?? created?.code ?? "",
        description: created?.description ?? "",
        totalFee: created?.totalFee ?? created?.fee ?? 0,
        duration_In_Months: created?.duration_In_Months ?? created?.duration ?? 0,
        monthlyFee: created?.monthlyFee ?? created?.monthly ?? 0,
        courses: created?.courses || [],
      };
      setSubjects((s) => [newSubject, ...(s || [])]);
      setShowCreate(false);
      showToast("Class created successfully!", "success");
    } catch (err) {
      console.error(err);
      showToast(err.message || "Failed to create class", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    const subject = (subjects || []).find((s) => String(s.id) === String(id));
    // If subject has associated courses, prevent deletion
    if (subject && Array.isArray(subject.courses) && subject.courses.length > 0) {
      showToast(
        `Cannot delete "${subject.name || subject.subjectName || subject.code || id}" because it is assigned to ${subject.courses.length} course(s).`,
        "error"
      );
      return;
    }

    if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) return;
    try {
      // mark deleting
      setDeletingIds(prev => new Set(prev).add(String(id)));
      await deleteSubject(id);
      setSubjects((s) => (s || []).filter((x) => String(x.id) !== String(id)));
      showToast("Class deleted successfully", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to delete class. It might be in use.", "error");
    } finally {
      setDeletingIds(prev => {
        const next = new Set(prev);
        next.delete(String(id));
        return next;
      });
    }
  };

  const formatCurrency = (amount) => {
    // Format as Sri Lankan Rupees with LKR prefix
    try {
      return new Intl.NumberFormat('en-LK', {
        style: 'currency',
        currency: 'LKR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
        .format(amount)
        // ensure prefix uses 'LKR' (some environments may use symbol), normalize spacing
        .replace('\u00A0', ' ');
    } catch (e) {
      return `LKR ${amount}`;
    }
  };

  const showToast = (message, type) => {
    setToast({ msg: message, type: type, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
              Class Management
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage all classes and their details in one place
            </p>
          </div>
          <Button 
            onClick={() => setShowCreate(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
          >
            <FiPlus className="text-lg" />
            <span className="font-semibold">Add New Class</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Classes</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                  {subjects.length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <TbBooks className="text-2xl text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
          {/* Active Courses card removed as requested */}
        </div>

        {/* Class Cards Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading classes...</p>
            </div>
          </div>
        ) : subjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((s) => (
              <div 
                key={String(s.id)} 
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 hover:-translate-y-1"
              >
                {/* Card Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-full">
                          {s.code}
                        </span>
                        {/* <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium rounded-full">
                          {s.courses?.length || 0} courses
                        </span> */}
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                        {s.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                        {s.description || "No description available"}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(s.id, s.name)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-60"
                      title="Delete class"
                      disabled={deletingIds.has(String(s.id))}
                      aria-busy={deletingIds.has(String(s.id))}
                    >
                      {deletingIds.has(String(s.id)) ? (
                        <div className="w-4 h-4 border-2 border-transparent border-t-current rounded-full animate-spin" style={{borderTopColor: 'currentColor'}} />
                      ) : (
                        <FiTrash2 className="text-lg" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  {/* Fee Details */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <FiDollarSign />
                        <span>Total Fee</span>
                      </div>
                      <div className="text-lg font-semibold text-gray-800 dark:text-white">
                        {s.totalFee ? formatCurrency(s.totalFee) : "Free"}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <FiClock />
                        <span>Duration</span>
                      </div>
                      <div className="text-lg font-semibold text-gray-800 dark:text-white">
                        {s.duration_In_Months || 0} months
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <FiCalendar />
                        <span>Monthly</span>
                      </div>
                      <div className="text-lg font-semibold text-gray-800 dark:text-white">
                        {s.monthlyFee ? formatCurrency(s.monthlyFee) : "-"}
                      </div>
                    </div>
                  </div>

                  {/* Associated Courses */}
                  {/* {s.courses && s.courses.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Associated Courses
                      </h4>
                      <div className="space-y-2">
                        {s.courses.slice(0, 2).map((course, index) => (
                          <div 
                            key={index}
                            className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                          >
                            <div>
                              <p className="text-sm font-medium text-gray-800 dark:text-white">
                                {course.courseName}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {course.teacher}
                              </p>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              course.isActive 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                            }`}>
                              {course.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        ))}
                        {s.courses.length > 2 && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                            +{s.courses.length - 2} more courses
                          </p>
                        )}
                      </div>
                    </div>
                  )} */}
                </div>

                {/* Card Footer */}
                {/* <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium flex items-center gap-1 transition-colors">
                      <FiEdit className="text-sm" />
                      Edit Details
                    </button>
                    <button className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 font-medium transition-colors">
                      View Details →
                    </button>
                  </div>
                </div> */}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
            <TbBooks className="text-5xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No Classes Found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Get started by creating your first class to organize courses and subjects
            </p>
            <Button 
              onClick={() => setShowCreate(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
            >
              <FiPlus className="mr-2" />
              Create First Class
            </Button>
          </div>
        )}

        {/* Create Class Modal */}
        <Modal 
          isOpen={showCreate} 
          onClose={() => !saving && setShowCreate(false)}
          title={
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <FiPlus className="text-blue-600 dark:text-blue-400 text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  Add New Class
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Fill in the details to create a new class
                </p>
              </div>
            </div>
          }
          size="lg"
        >
          <div className="space-y-4">
            <SubjectForm
              onSubmit={handleCreateFromForm}
              onCancel={() => setShowCreate(false)}
              loading={saving}
            />
          </div>
        </Modal>

        {/* Toast Notification */}
        <Toast 
          message={toast.msg} 
          type={toast.type} 
          visible={toast.visible}
          onClose={() => setToast(prev => ({ ...prev, visible: false }))}
          position="bottom-right"
        />
      </div>

      {/* Add custom styles for line clamping */}
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default ClassPage;