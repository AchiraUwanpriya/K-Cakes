import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Card from "../../components/common/Card";
import Modal from "../../components/common/Modal";
import AnnouncementForm from "../../components/announcements/AnnouncementForm";
import AnnouncementList from "../../components/announcements/AnnouncementList";
import Button from "../../components/common/Button";
import {
  createAnnouncement,
  updateAnnouncement,
  getAnnouncementsByTeacher,
} from "../../services/announcementService";
import { getTeacherCourses } from "../../services/courseService";

const TeacherNoticesPage = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();
  const [editingAnnouncement, setEditingAnnouncement] = useState(() => {
    try {
      return location?.state?.editAnnouncement || null;
    } catch (_) {
      return null;
    }
  });
  const [isModalOpen, setIsModalOpen] = useState(() => {
    try {
      return Boolean(
        location &&
          location.state &&
          (location.state.openForm || location.state.editAnnouncement)
      );
    } catch (e) {
      return false;
    }
  });
  const [submitting, setSubmitting] = useState(false);

  const teacherId = useMemo(() => {
    if (!user) return "";
    const candidates = [
      user?.TeacherID,
      user?.teacherID,
      user?.teacherId,
      user?.UserID,
      user?.userID,
      user?.userId,
      user?.id,
    ];
    const found = candidates.find(
      (value) => value !== undefined && value !== null && value !== ""
    );
    return found != null ? String(found) : "";
  }, [user]);

  const defaultCourseId = useMemo(
    () => (courses[0]?.id ? String(courses[0].id) : ""),
    [courses]
  );
  const [selectedCourseId, setSelectedCourseId] = useState("");

  useEffect(() => {
    if (!teacherId) {
      setLoading(false);
      return;
    }
    const load = async () => {
      setLoading(true);
      try {
        const [cs, anns] = await Promise.all([
          getTeacherCourses(teacherId),
          getAnnouncementsByTeacher(teacherId),
        ]);
        setCourses(cs);
        setAnnouncements(anns);
        setError("");

        if (location?.state?.editAnnouncement) {
          const toEdit = location.state.editAnnouncement;
          setEditingAnnouncement(toEdit);
          const cId =
            toEdit.courseId ??
            toEdit.CourseID ??
            toEdit.courseID ??
            toEdit.raw?.courseID ??
            toEdit.raw?.CourseID ??
            "";
          if (cId) setSelectedCourseId(String(cId));
          setIsModalOpen(true);
        }
      } catch (err) {
        console.error("Failed to load teacher notices", err);
        setCourses([]);
        setAnnouncements([]);
        const message =
          err?.response?.data?.message || err?.message || "Network error";
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [teacherId, location]);

  useEffect(() => {
    // initialize selected course once courses are loaded if not editing
    if (!selectedCourseId && defaultCourseId && !editingAnnouncement) {
      setSelectedCourseId(defaultCourseId);
    }
  }, [defaultCourseId, selectedCourseId, editingAnnouncement]);

  const handleEdit = (announcement) => {
    setEditingAnnouncement(announcement);
    const courseId =
      announcement.courseId ??
      announcement.CourseID ??
      announcement.courseID ??
      announcement.raw?.courseID ??
      announcement.raw?.CourseID ??
      "";
    if (courseId) {
      setSelectedCourseId(String(courseId));
    }
    setIsModalOpen(true);
  };

  const handleOpenCreateModal = () => {
    setEditingAnnouncement(null);
    if (defaultCourseId) {
      setSelectedCourseId(defaultCourseId);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAnnouncement(null);
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      const courseId =
        selectedCourseId ||
        editingAnnouncement?.courseId ||
        editingAnnouncement?.CourseID ||
        defaultCourseId ||
        (courses[0]?.id ?? "");

      if (!courseId) {
        alert("Please select a course to post the notice.");
        return;
      }
      if (!teacherId) {
        alert(
          "Unable to determine the logged in teacher. Please sign in again."
        );
        return;
      }

      if (editingAnnouncement) {
        // UPDATE EXISTING NOTICE
        const announcementId =
          editingAnnouncement.announcementID ??
          editingAnnouncement.AnnouncementID ??
          editingAnnouncement.AnnouncementId ??
          editingAnnouncement.announcementId ??
          editingAnnouncement.id;

        const updated = await updateAnnouncement(announcementId, {
          announcementID: Number(announcementId),
          courseID: Number(courseId),
          teacherID: Number(teacherId),
          title: data.title,
          content: data.content,
          postDate: data.postDate || undefined,
          expiryDate: data.expiryDate || undefined,
          isImportant:
            data.isImportant === true ||
            data.isImportant === "true" ||
            data.isImportant === 1,
        });

        if (!updated) {
          alert("Failed to update the announcement. Please try again.");
          return;
        }

        setAnnouncements((prev) =>
          prev.map((a) => {
            const currentId =
              a.announcementID ?? a.AnnouncementID ?? a.id;
            const targetId =
              updated.announcementID ?? updated.AnnouncementID ?? updated.id;
            return String(currentId) === String(targetId) ||
              String(a.id) === String(updated.id)
              ? { ...a, ...updated }
              : a;
          })
        );
        setIsModalOpen(false);
        setEditingAnnouncement(null);
      } else {
        // CREATE NEW NOTICE
        const created = await createAnnouncement({
          courseId: Number(courseId),
          teacherId: Number(teacherId),
          title: data.title,
          content: data.content,
          postDate: data.postDate || undefined,
          expiryDate: data.expiryDate || undefined,
          isImportant:
            data.isImportant === true ||
            data.isImportant === "true" ||
            data.isImportant === 1,
        });
        if (!created) {
          alert("Failed to save the announcement. Please try again.");
          return;
        }
        setAnnouncements((prev) => [created, ...prev]);
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error("Failed to save announcement", err);
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.title ||
        err?.message ||
        "An error occurred while saving the announcement.";
      alert(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Notices
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Manage course notices and announcements for students
          </p>
        </div>
        <Button variant="primary" onClick={handleOpenCreateModal}>
          <svg
            className="w-4 h-4 mr-1.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          New Notice
        </Button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingAnnouncement ? "Edit Notice" : "New Notice"}
        size="lg"
        contentClassName="bg-gray-50 dark:bg-gray-900/40 p-4 sm:p-6 rounded-lg"
      >
        <div className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Course <span className="text-red-500">*</span>
            </label>
            <select
              className="px-3 py-2 text-sm block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white bg-white"
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              name="courseId"
              id="courseId"
            >
              <option value="">Select a course</option>
              {courses.map((c) => (
                <option key={c.id} value={String(c.id)}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>

          <AnnouncementForm
            onSubmit={onSubmit}
            loading={submitting}
            initialData={editingAnnouncement || {}}
            isEditing={Boolean(editingAnnouncement)}
            onCancel={handleCloseModal}
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
            announcements={[...announcements]
              .filter(Boolean)
              .sort((a, b) => new Date(b.postDate) - new Date(a.postDate))}
            onEdit={handleEdit}
            showDates={true}
          />
        )}
      </Card>
    </div>
  );
};

export default TeacherNoticesPage;
