import { useEffect, useMemo, useState } from "react";
import Card from "../../components/common/Card";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import StatusTabs from "../../components/common/StatusTabs";
import EmptyState from "../../components/common/EmptyState";
import {
  getAllWebsiteCourses,
  createWebsiteCourse,
  updateWebsiteCourse,
  deleteWebsiteCourse,
} from "../../services/websiteCourseService";

const EMPTY_FORM = {
  name: "",
  level: "",
  description: "",
  duration: "",
  schedule: "",
  teacherName: "",
  displayOrder: 0,
  isActive: true,
};

const LEVELS = ["Beginner", "Intermediate", "Advanced", "All levels"];

const inputClass =
  "px-3 py-2 text-sm block w-full rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white bg-white";
const labelClass =
  "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

const getMessage = (err, fallback) =>
  err?.response?.data?.message ||
  err?.response?.data?.Message ||
  (typeof err?.response?.data === "string" ? err.response.data : "") ||
  err?.message ||
  fallback;

const WebsiteCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [tab, setTab] = useState("active");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getAllWebsiteCourses();
      setCourses(data);
      setError("");
    } catch (err) {
      console.error("Failed to load website courses", err);
      setError(getMessage(err, "Network error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const { activeItems, hiddenItems } = useMemo(() => {
    const sorted = [...courses].sort(
      (a, b) =>
        (a.displayOrder || 0) - (b.displayOrder || 0) ||
        Number(a.id) - Number(b.id)
    );
    return {
      activeItems: sorted.filter((c) => c.isActive),
      hiddenItems: sorted.filter((c) => !c.isActive),
    };
  }, [courses]);

  const shown = tab === "active" ? activeItems : hiddenItems;

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setIsModalOpen(true);
  };

  const openEdit = (course) => {
    setEditing(course);
    setForm({ ...EMPTY_FORM, ...course });
    setFormError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setIsModalOpen(false);
    setEditing(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setFormError("Course name is required.");
      return;
    }
    if (!form.description.trim()) {
      setFormError("Please add a short description.");
      return;
    }
    try {
      setSaving(true);
      setFormError("");
      if (editing) {
        const updated = await updateWebsiteCourse(editing.id, form);
        setCourses((prev) =>
          prev.map((c) => (String(c.id) === String(editing.id) ? updated : c))
        );
        setSuccess("Course updated.");
      } else {
        const created = await createWebsiteCourse(form);
        setCourses((prev) => [...prev, created]);
        setSuccess("Course added to the website.");
      }
      setIsModalOpen(false);
      setEditing(null);
    } catch (err) {
      console.error("Failed to save website course", err);
      setFormError(getMessage(err, "Could not save the course."));
    } finally {
      setSaving(false);
    }
  };

  const toggleVisible = async (course) => {
    try {
      const updated = await updateWebsiteCourse(course.id, {
        ...course,
        isActive: !course.isActive,
      });
      setCourses((prev) =>
        prev.map((c) => (String(c.id) === String(course.id) ? updated : c))
      );
      setSuccess(
        course.isActive
          ? "Course hidden from the website."
          : "Course is now shown on the website."
      );
    } catch (err) {
      console.error("Failed to update course", err);
      setError(getMessage(err, "Could not update the course."));
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      setDeleting(true);
      await deleteWebsiteCourse(toDelete.id);
      setCourses((prev) =>
        prev.filter((c) => String(c.id) !== String(toDelete.id))
      );
      setSuccess("Course deleted.");
      setToDelete(null);
    } catch (err) {
      console.error("Failed to delete course", err);
      setError(getMessage(err, "Could not delete the course."));
      setToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Website Courses
          </h1>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            The courses shown on the Courses tab of the About us page
          </p>
        </div>
        <Button variant="primary" onClick={openCreate}>
          Add Course
        </Button>
      </div>

      {success && (
        <div
          className="flex items-start justify-between gap-3 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300"
          role="status"
        >
          <span>{success}</span>
          <button
            type="button"
            onClick={() => setSuccess("")}
            className="opacity-60 hover:opacity-100"
            aria-label="Dismiss"
          >
            &times;
          </button>
        </div>
      )}

      <Card className="p-6">
        {loading ? (
          <div className="text-sm text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-sm text-red-600">
            {error}.{" "}
            <button
              type="button"
              onClick={load}
              className="font-medium underline"
            >
              Try again
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <StatusTabs
              active={tab}
              onChange={setTab}
              tabs={[
                {
                  id: "active",
                  label: "Shown",
                  dot: "bg-emerald-500",
                  count: activeItems.length,
                },
                {
                  id: "hidden",
                  label: "Hidden",
                  dot: "bg-gray-400",
                  count: hiddenItems.length,
                },
              ]}
            />

            {shown.length === 0 ? (
              <EmptyState
                title={
                  tab === "active" ? "No courses on the website" : "No hidden courses"
                }
                description={
                  tab === "active"
                    ? "Use Add Course to show a course on the About us page."
                    : "Courses you hide will be listed here."
                }
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {shown.map((course) => (
                  <div
                    key={course.id}
                    className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900/60"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white break-words">
                        {course.name}
                      </h3>
                      {course.level && (
                        <span className="shrink-0 rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-semibold text-rose-700 dark:bg-rose-900/30 dark:text-rose-300">
                          {course.level}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line break-words">
                      {course.description}
                    </p>
                    <dl className="mt-3 space-y-1 text-sm">
                      {course.duration && (
                        <div className="flex justify-between gap-4">
                          <dt className="text-gray-500 dark:text-gray-400">Duration</dt>
                          <dd className="font-medium text-gray-900 dark:text-white text-right">
                            {course.duration}
                          </dd>
                        </div>
                      )}
                      {course.schedule && (
                        <div className="flex justify-between gap-4">
                          <dt className="text-gray-500 dark:text-gray-400">Schedule</dt>
                          <dd className="font-medium text-gray-900 dark:text-white text-right">
                            {course.schedule}
                          </dd>
                        </div>
                      )}
                      {course.teacherName && (
                        <div className="flex justify-between gap-4">
                          <dt className="text-gray-500 dark:text-gray-400">Teacher</dt>
                          <dd className="font-medium text-gray-900 dark:text-white text-right">
                            {course.teacherName}
                          </dd>
                        </div>
                      )}
                    </dl>
                    <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-3 dark:border-gray-700/60">
                      <Button size="sm" variant="secondary" onClick={() => openEdit(course)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => toggleVisible(course)}>
                        {course.isActive ? "Hide" : "Show"}
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => setToDelete(course)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editing ? "Edit Course" : "Add Course"}
        size="lg"
        contentClassName="bg-gray-50 dark:bg-gray-900/40 p-3 sm:p-5 rounded-xl"
      >
        <form onSubmit={handleSave} className="space-y-4 w-full">
          <div>
            <label className={labelClass} htmlFor="wc-name">
              Course name <span className="text-red-500">*</span>
            </label>
            <input
              id="wc-name"
              type="text"
              maxLength={150}
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              className={inputClass}
              placeholder="e.g. Cake Decorating Basics"
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="wc-desc">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="wc-desc"
              rows={4}
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              className={inputClass}
              placeholder="What students learn in this course"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass} htmlFor="wc-level">Level</label>
              <input
                id="wc-level"
                type="text"
                list="wc-levels"
                maxLength={50}
                value={form.level}
                onChange={(e) => setField("level", e.target.value)}
                className={inputClass}
                placeholder="Beginner"
              />
              <datalist id="wc-levels">
                {LEVELS.map((l) => (
                  <option key={l} value={l} />
                ))}
              </datalist>
            </div>
            <div>
              <label className={labelClass} htmlFor="wc-duration">Duration</label>
              <input
                id="wc-duration"
                type="text"
                maxLength={100}
                value={form.duration}
                onChange={(e) => setField("duration", e.target.value)}
                className={inputClass}
                placeholder="e.g. 3 months"
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="wc-schedule">Schedule</label>
              <input
                id="wc-schedule"
                type="text"
                maxLength={200}
                value={form.schedule}
                onChange={(e) => setField("schedule", e.target.value)}
                className={inputClass}
                placeholder="e.g. Saturdays, 9.00 am - 12.00 pm"
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="wc-teacher">Teacher (optional)</label>
              <input
                id="wc-teacher"
                type="text"
                maxLength={150}
                value={form.teacherName}
                onChange={(e) => setField("teacherName", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="wc-order">Display order</label>
              <input
                id="wc-order"
                type="number"
                min="0"
                value={form.displayOrder}
                onChange={(e) => setField("displayOrder", e.target.value)}
                className={inputClass}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Smaller numbers appear first.
              </p>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={form.isActive !== false}
              onChange={(e) => setField("isActive", e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            Show this course on the website
          </label>

          {formError && (
            <p className="text-sm text-red-600" role="alert">
              {formError}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <Button variant="secondary" onClick={closeModal} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? "Saving..." : editing ? "Save Changes" : "Add Course"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={Boolean(toDelete)}
        onClose={() => (deleting ? null : setToDelete(null))}
        title="Delete course?"
        size="sm"
      >
        <p className="text-sm text-gray-600 dark:text-gray-300">
          "{toDelete?.name}" will be removed from the website. This cannot be
          undone. If you only want to take it off the page for now, use Hide
          instead.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setToDelete(null)} disabled={deleting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete} disabled={deleting}>
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default WebsiteCoursesPage;