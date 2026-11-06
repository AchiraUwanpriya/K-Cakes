import { useEffect, useMemo, useState } from "react";
import Card from "../../components/common/Card";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import CustomSelect from "../../components/common/CustomSelect";
import AnnouncementForm from "../../components/announcements/AnnouncementForm";
import AnnouncementList from "../../components/announcements/AnnouncementList";
import {
  createAnnouncement,
  updateAnnouncement,
  getAllAnnouncements,
} from "../../services/announcementService";
import { getAllCourses } from "../../services/courseService";
import { getAllSubjects } from "../../services/subjectService";

const TARGETS = [
  { value: "all", label: "All students" },
  { value: "course", label: "A course" },
  { value: "class", label: "A class" },
];

const AdminNoticesPage = () => {
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [target, setTarget] = useState("all");
  const [courseId, setCourseId] = useState("");
  const [subjectId, setSubjectId] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [cs, subs, anns] = await Promise.all([
          getAllCourses().catch(() => []),
          getAllSubjects().catch(() => []),
          getAllAnnouncements(),
        ]);
        setCourses(Array.isArray(cs) ? cs : []);
        setSubjects(Array.isArray(subs) ? subs : []);
        setAnnouncements(Array.isArray(anns) ? anns : []);
        setError("");
      } catch (err) {
        console.error("Failed to load notices", err);
        setError(
          err?.response?.data?.message || err?.message || "Network error"
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const courseOptions = useMemo(
    () =>
      courses.map((c) => ({
        value: String(c.id),
        label: c.code ? `${c.name} (${c.code})` : String(c.name || c.id),
      })),
    [courses]
  );

  const subjectOptions = useMemo(
    () =>
      subjects
        .filter((s) => s && s.isActive !== false)
        .map((s) => ({
          value: String(s.id),
          label: s.courseName ? `${s.name} - ${s.courseName}` : String(s.name),
        })),
    [subjects]
  );

  // Add the class name so the notice card can show it
  const listItems = useMemo(() => {
    return [...announcements]
      .filter(Boolean)
      .map((a) => {
        if (!a.subjectId) return a;
        const sub = subjects.find((s) => String(s.id) === String(a.subjectId));
        return sub ? { ...a, subjectName: sub.name } : a;
      })
      .sort((a, b) => new Date(b.postDate) - new Date(a.postDate));
  }, [announcements, subjects]);

  const resetTarget = () => {
    setTarget("all");
    setCourseId("");
    setSubjectId("");
  };

  const handleOpenCreate = () => {
    setEditing(null);
    resetTarget();
    setIsModalOpen(true);
  };

  const handleEdit = (announcement) => {
    setEditing(announcement);
    if (announcement.isForAllStudents) {
      setTarget("all");
      setCourseId("");
      setSubjectId("");
    } else if (announcement.subjectId) {
      setTarget("class");
      setSubjectId(String(announcement.subjectId));
      setCourseId(announcement.courseId ? String(announcement.courseId) : "");
    } else {
      setTarget("course");
      setCourseId(announcement.courseId ? String(announcement.courseId) : "");
      setSubjectId("");
    }
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditing(null);
  };

  const describeTarget = () => {
    if (target === "all") return "all students";
    if (target === "course") {
      const c = courseOptions.find((o) => o.value === courseId);
      return c ? c.label : "the selected course";
    }
    const s = subjectOptions.find((o) => o.value === subjectId);
    return s ? s.label : "the selected class";
  };

  const onSubmit = async (data) => {
    // Work out who the notice goes to
    let targetFields = {};
    if (target === "all") {
      targetFields = { isForAllStudents: true };
    } else if (target === "course") {
      if (!courseId) {
        alert("Please select a course.");
        return;
      }
      targetFields = { isForAllStudents: false, courseId: Number(courseId) };
    } else {
      if (!subjectId) {
        alert("Please select a class.");
        return;
      }
      const sub = subjects.find((s) => String(s.id) === String(subjectId));
      const subCourseId = sub?.courseId ?? courseId;
      if (!subCourseId) {
        alert("This class is not linked to a course.");
        return;
      }
      targetFields = {
        isForAllStudents: false,
        courseId: Number(subCourseId),
        subjectId: Number(subjectId),
      };
    }

    const common = {
      title: data.title,
      content: data.content,
      postDate: data.postDate || undefined,
      expiryDate: data.expiryDate || undefined,
      isImportant:
        data.isImportant === true ||
        data.isImportant === "true" ||
        data.isImportant === 1,
      ...targetFields,
    };

    try {
      setSubmitting(true);
      if (editing) {
        const announcementId =
          editing.announcementID ?? editing.AnnouncementID ?? editing.id;
        const updated = await updateAnnouncement(announcementId, {
          ...common,
          announcementID: Number(announcementId),
          // keep the original author (teacher) if a teacher wrote it
          teacherID: editing.teacherId ?? editing.TeacherID ?? undefined,
        });
        if (!updated) {
          alert("Failed to update the notice. Please try again.");
          return;
        }
        setAnnouncements((prev) =>
          prev.map((a) =>
            String(a.id) === String(editing.id) ? { ...a, ...updated } : a
          )
        );
        setSuccess(`Notice updated (${describeTarget()}).`);
      } else {
        const created = await createAnnouncement(common);
        if (!created) {
          alert("Failed to send the notice. Please try again.");
          return;
        }
        setAnnouncements((prev) => [created, ...prev]);
        setSuccess(`Notice sent to ${describeTarget()}.`);
      }
      handleClose();
    } catch (err) {
      console.error("Failed to save notice", err);
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.Message ||
        (typeof err?.response?.data === "string" ? err.response.data : "") ||
        err?.message ||
        "An error occurred while saving the notice.";
      alert(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Notices
          </h1>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            Send a notice to all students, a course, or a single class
          </p>
        </div>
        <Button variant="primary" onClick={handleOpenCreate}>
          New Notice
        </Button>
      </div>

      {success && (
        <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300">
          {success}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        title={editing ? "Edit Notice" : "New Notice"}
        size="lg"
        contentClassName="bg-gray-50 dark:bg-gray-900/40 p-3 sm:p-5 rounded-xl"
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Send to <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {TARGETS.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setTarget(t.value)}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                    target === t.value
                      ? "border-indigo-600 bg-indigo-600 text-white"
                      : "border-gray-200 bg-white text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {target === "course" && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Course <span className="text-red-500">*</span>
              </label>
              <CustomSelect
                name="courseId"
                value={courseId}
                onChange={(val) => setCourseId(val)}
                options={courseOptions}
                placeholder="Select a course"
                searchPlaceholder="Search course..."
              />
            </div>
          )}

          {target === "class" && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Class <span className="text-red-500">*</span>
              </label>
              <CustomSelect
                name="subjectId"
                value={subjectId}
                onChange={(val) => setSubjectId(val)}
                options={subjectOptions}
                placeholder="Select a class"
                searchPlaceholder="Search class..."
              />
            </div>
          )}

          <AnnouncementForm
            onSubmit={onSubmit}
            loading={submitting}
            initialData={editing || {}}
            isEditing={Boolean(editing)}
            onCancel={handleClose}
          />
        </div>
      </Modal>

      <Card className="p-6">
        {loading ? (
          <div className="text-sm text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-sm text-red-600">
            {error}. Please verify the backend service is reachable.
          </div>
        ) : (
          <AnnouncementList
            announcements={listItems}
            onEdit={handleEdit}
            showDates={true}
          />
        )}
      </Card>
    </div>
  );
};

export default AdminNoticesPage;