import { useEffect, useState } from "react";
import Modal from "../../components/common/Modal2";
import Button from "../../components/common/Button";
import {
  getAllSubjectsIncludingInactive,
  createSubject,
  deactivateSubject,
  reactivateSubject,
} from "../../services/subjectService";
import {
  FiTrash2,
  FiPlus,
  FiBookOpen,
  FiClock,
  FiDollarSign,
  FiCalendar,
  FiRefreshCw,
  FiAlertCircle,
  FiX,
  FiCheck,
} from "react-icons/fi";
import { TbBooks } from "react-icons/tb";
import SubjectForm from "../../components/admin/SubjectForm";

// Self-contained toast that auto-dismisses — re-mounts on every new `key`
const InlineToast = ({ message, type, onDismiss }) => {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3500);
    return () => clearTimeout(t);
  }, [onDismiss]);

  const styles = {
    success: "bg-green-100 text-green-800 border-green-300",
    error: "bg-red-100 text-red-800 border-red-300",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-300",
    info: "bg-blue-100 text-blue-800 border-blue-300",
  };

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border text-sm font-medium animate-slide-up ${
        styles[type] || styles.info
      }`}
      style={{ maxWidth: 360, minWidth: 220 }}
    >
      <span className="flex-1">{message}</span>
      <button
        onClick={onDismiss}
        className="opacity-60 hover:opacity-100 transition-opacity ml-1 flex-shrink-0"
        aria-label="Close notification"
      >
        <FiX className="text-base" />
      </button>
    </div>
  );
};

const ClassPage = () => {
  const [allSubjects, setAllSubjects] = useState([]);
  const [activeTab, setActiveTab] = useState("active");
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [processingIds, setProcessingIds] = useState(new Set());
  const [toast, setToast] = useState(null); // { msg, type, key }
  // Custom confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState({ open: false, subject: null });

  // Derived lists
  const activeSubjects = allSubjects.filter((s) => s.isActive !== false);
  const inactiveSubjects = allSubjects.filter((s) => s.isActive === false);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      const all = await getAllSubjectsIncludingInactive();
      const formatted = Array.isArray(all)
        ? all.map((item) => ({
            id: item?.id ?? item?.subjectID ?? item?.SubjectID ?? null,
            name: item?.name ?? item?.subjectName ?? item?.SubjectName ?? "",
            code: item?.subjectCode ?? item?.code ?? "",
            description: item?.description ?? item?.Description ?? "",
            totalFee: item?.totalFee ?? item?.fee ?? null,
            duration_In_Months: item?.duration_In_Months ?? item?.duration ?? null,
            monthlyFee: item?.monthlyFee ?? item?.monthly ?? null,
            isActive: item?.isActive !== undefined ? item.isActive : true,
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
      setAllSubjects(formatted);
    } catch (err) {
      console.error("Failed to load subjects", err);
      showToast("Failed to load classes", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubjects();
  }, []);

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
        isActive: true,
        courses: created?.courses || [],
      };
      setAllSubjects((s) => [newSubject, ...(s || [])]);
      setShowCreate(false);
      showToast("Class created successfully!", "success");
    } catch (err) {
      console.error(err);
      showToast(err.message || "Failed to create class", "error");
    } finally {
      setSaving(false);
    }
  };

  // Opens the custom confirm dialog
  const handleDeactivateClick = (subject) => {
    setConfirmDialog({ open: true, subject });
  };

  // Confirmed — proceed with deactivation
  const handleDeactivateConfirm = async () => {
    const subject = confirmDialog.subject;
    setConfirmDialog({ open: false, subject: null });
    if (!subject) return;

    const { id, name } = subject;
    try {
      setProcessingIds((prev) => new Set(prev).add(String(id)));
      await deactivateSubject(id, subject);
      setAllSubjects((s) =>
        s.map((x) => (String(x.id) === String(id) ? { ...x, isActive: false } : x))
      );
      showToast(`"${name}" has been deactivated`, "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to deactivate class. " + (err?.message || ""), "error");
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(String(id));
        return next;
      });
    }
  };

  const handleReactivate = async (subject) => {
    const { id, name } = subject;
    try {
      setProcessingIds((prev) => new Set(prev).add(String(id)));
      await reactivateSubject(id, subject);
      setAllSubjects((s) =>
        s.map((x) => (String(x.id) === String(id) ? { ...x, isActive: true } : x))
      );
      showToast(`"${name}" has been reactivated!`, "success");
      setActiveTab("active");
    } catch (err) {
      console.error(err);
      showToast("Failed to reactivate class. " + (err?.message || ""), "error");
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(String(id));
        return next;
      });
    }
  };

  const formatCurrency = (amount) => {
    try {
      return new Intl.NumberFormat("en-LK", {
        style: "currency",
        currency: "LKR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
        .format(amount)
        .replace("\u00A0", " ");
    } catch (e) {
      return `LKR ${amount}`;
    }
  };

  const showToast = (message, type) => {
    // Use a unique key each time so the component re-mounts and the timer resets
    setToast({ msg: message, type, key: Date.now() });
  };

  const currentSubjects = activeTab === "active" ? activeSubjects : inactiveSubjects;

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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Classes</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{allSubjects.length}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <TbBooks className="text-2xl text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Active Classes</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{activeSubjects.length}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <FiBookOpen className="text-2xl text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Inactive Classes</p>
                <p className="text-2xl font-bold text-red-500 dark:text-red-400 mt-1">{inactiveSubjects.length}</p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <FiAlertCircle className="text-2xl text-red-500 dark:text-red-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 bg-white dark:bg-gray-800 rounded-xl p-1 shadow-sm border border-gray-100 dark:border-gray-700 w-fit">
          <button
            id="tab-active"
            onClick={() => setActiveTab("active")}
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
              activeTab === "active"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <FiBookOpen className="text-base" />
            Active
            <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
              activeTab === "active"
                ? "bg-white/20 text-white"
                : "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
            }`}>
              {activeSubjects.length}
            </span>
          </button>

          <button
            id="tab-inactive"
            onClick={() => setActiveTab("inactive")}
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
              activeTab === "inactive"
                ? "bg-red-500 text-white shadow-md"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <FiAlertCircle className="text-base" />
            Inactive
            {inactiveSubjects.length > 0 && (
              <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === "inactive"
                  ? "bg-white/20 text-white"
                  : "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400"
              }`}>
                {inactiveSubjects.length}
              </span>
            )}
          </button>
        </div>

        {/* Inactive notice banner */}
        {activeTab === "inactive" && inactiveSubjects.length > 0 && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl">
            <FiAlertCircle className="text-amber-500 text-xl flex-shrink-0" />
            <p className="text-sm text-amber-700 dark:text-amber-300">
              These classes have been deactivated. Click <strong>Reactivate</strong> on any card to make it active again.
            </p>
          </div>
        )}

        {/* Cards Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading classes...</p>
            </div>
          </div>
        ) : currentSubjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentSubjects.map((s) => (
              <div
                key={String(s.id)}
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 hover:-translate-y-1"
              >
                {/* Inactive ribbon */}
                {s.isActive === false && (
                  <div className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-4 py-1.5 flex items-center gap-2">
                    <FiAlertCircle className="text-sm" />
                    INACTIVE CLASS
                  </div>
                )}

                {/* Card Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                          {s.code || "—"}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{s.name}</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                        {s.description || "No description available"}
                      </p>
                    </div>

                    {/* Deactivate / Reactivate icon button */}
                    {s.isActive !== false ? (
                      <button
                        id={`deactivate-${s.id}`}
                        onClick={() => handleDeactivateClick(s)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-60"
                        title="Deactivate class"
                        disabled={processingIds.has(String(s.id))}
                      >
                        {processingIds.has(String(s.id)) ? (
                          <div className="w-4 h-4 border-2 border-transparent rounded-full animate-spin" style={{ borderTopColor: "currentColor" }} />
                        ) : (
                          <FiTrash2 className="text-lg" />
                        )}
                      </button>
                    ) : (
                      <button
                        id={`reactivate-icon-${s.id}`}
                        onClick={() => handleReactivate(s)}
                        className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors disabled:opacity-60"
                        title="Reactivate class"
                        disabled={processingIds.has(String(s.id))}
                      >
                        {processingIds.has(String(s.id)) ? (
                          <div className="w-4 h-4 border-2 border-transparent rounded-full animate-spin" style={{ borderTopColor: "currentColor" }} />
                        ) : (
                          <FiRefreshCw className="text-lg" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <FiDollarSign /><span>Total Fee</span>
                      </div>
                      <div className="text-lg font-semibold text-gray-800 dark:text-white">
                        {s.totalFee ? formatCurrency(s.totalFee) : "Free"}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <FiClock /><span>Duration</span>
                      </div>
                      <div className="text-lg font-semibold text-gray-800 dark:text-white">
                        {s.duration_In_Months || 0} months
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <FiCalendar /><span>Monthly</span>
                      </div>
                      <div className="text-lg font-semibold text-gray-800 dark:text-white">
                        {s.monthlyFee ? formatCurrency(s.monthlyFee) : "—"}
                      </div>
                    </div>
                  </div>

                  {/* Reactivate CTA button (inactive tab only) */}
                  {s.isActive === false && (
                    <button
                      id={`reactivate-cta-${s.id}`}
                      onClick={() => handleReactivate(s)}
                      disabled={processingIds.has(String(s.id))}
                      className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-sm font-semibold rounded-lg shadow transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {processingIds.has(String(s.id)) ? (
                        <>
                          <div className="w-4 h-4 border-2 border-transparent border-t-white rounded-full animate-spin" />
                          Reactivating...
                        </>
                      ) : (
                        <>
                          <FiRefreshCw className="text-base" />
                          Reactivate Class
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
            {activeTab === "inactive" ? (
              <>
                <FiRefreshCw className="text-5xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Inactive Classes</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  All classes are currently active. Deactivated classes will appear here.
                </p>
              </>
            ) : (
              <>
                <TbBooks className="text-5xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Classes Found</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  Get started by creating your first class
                </p>
                <Button
                  onClick={() => setShowCreate(true)}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                >
                  <FiPlus className="mr-2" />
                  Create First Class
                </Button>
              </>
            )}
          </div>
        )}

        {/* ── Custom Confirm Dialog ── */}
        {confirmDialog.open && confirmDialog.subject && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 border border-gray-200 dark:border-gray-700 animate-fade-in">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                  <FiTrash2 className="text-2xl text-red-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white">Deactivate Class?</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">This class will be moved to the Inactive tab</p>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                You are about to deactivate{" "}
                <span className="font-semibold text-gray-800 dark:text-white">
                  "{confirmDialog.subject.name}"
                </span>
                . It will not be deleted — you can reactivate it anytime from the <strong>Inactive</strong> tab.
              </p>

              <div className="flex gap-3 justify-end">
                <button
                  id="confirm-cancel"
                  onClick={() => setConfirmDialog({ open: false, subject: null })}
                  className="px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium text-sm transition-colors flex items-center gap-2"
                >
                  <FiX /> Cancel
                </button>
                <button
                  id="confirm-deactivate"
                  onClick={handleDeactivateConfirm}
                  className="px-5 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium text-sm transition-colors flex items-center gap-2 shadow"
                >
                  <FiCheck /> Yes, Deactivate
                </button>
              </div>
            </div>
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
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Add New Class</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Fill in the details to create a new class</p>
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

        {/* Self-controlled inline toast notification */}
        {toast && (
          <InlineToast
            key={toast.key}
            message={toast.msg}
            type={toast.type}
            onDismiss={() => setToast(null)}
          />
        )}
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.15s ease-out;
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ClassPage;