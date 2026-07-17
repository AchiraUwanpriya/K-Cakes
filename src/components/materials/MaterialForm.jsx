import { useForm } from "react-hook-form";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../common/Button";
import { useState, useEffect } from "react";
import { uploadMaterial } from "../../services/materialService";
import {
  getTeacherCourses,
  getCourseDetails,
} from "../../services/courseService";

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

const MaterialForm = ({ courseId, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(courseId ?? null);

  const [subjects, setSubjects] = useState([]); // NEW
  const [loadingSubjects, setLoadingSubjects] = useState(false); // NEW
  const [selectedSubject, setSelectedSubject] = useState(""); // NEW

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      // If a courseId was provided by parent, no need to load teacher courses
      if (courseId) return;

      const teacherId = resolveTeacherId(user);
      if (!teacherId) return;

      try {
        setLoadingCourses(true);
        const list = await getTeacherCourses(teacherId);
        if (!mounted) return;
        setCourses(list || []);
        if (!selectedCourse && Array.isArray(list) && list.length) {
          const first = String(
            list[0].id ??
              list[0].CourseID ??
              list[0].CourseId ??
              list[0].courseId ??
              ""
          );
          setSelectedCourse(first || null);
        }
      } catch (err) {
        console.error("Failed to load teacher courses", err);
        setCourses([]);
      } finally {
        if (mounted) setLoadingCourses(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, user]);

  // Load subjects when course changes
  useEffect(() => {
    let mounted = true;

    const loadSubjects = async () => {
      const courseToUse = courseId ?? selectedCourse;
      if (!courseToUse) {
        setSubjects([]);
        setSelectedSubject("");
        return;
      }

      try {
        setLoadingSubjects(true);
        const courseDetails = await getCourseDetails(courseToUse);
        if (!mounted) return;

        let courseSubjects = [];

        // Prefer explicit courseSubjects array of objects when available
        const rawCourseSubjects =
          courseDetails.courseSubjects ||
          courseDetails.CourseSubjects ||
          courseDetails.subjectDetails ||
          courseDetails.SubjectDetails ||
          null;

        if (Array.isArray(rawCourseSubjects) && rawCourseSubjects.length) {
          courseSubjects = rawCourseSubjects
            .map((entry) => {
              if (!entry || typeof entry !== "object") return null;
              const id =
                entry.subjectID ??
                entry.subjectId ??
                entry.SubjectID ??
                entry.id ??
                entry.Id ??
                null;
              const name =
                entry.subjectName ??
                entry.SubjectName ??
                entry.name ??
                entry.Name ??
                "";
              return id !== null
                ? {
                    id,
                    name: String(name || "").trim(),
                    monthlyFee:
                      entry.monthlyFee ?? entry.MonthlyFee ?? entry.monthly_fee ?? null,
                    totalFee:
                      entry.totalFee ?? entry.TotalFee ?? entry.total_fee ?? null,
                  }
                : null;
            })
            .filter(Boolean);
        }

        // Fallback: pair subjectIds and subjects arrays
        if (!courseSubjects.length) {
          const ids =
            courseDetails.subjectIds ??
            courseDetails.SubjectIDs ??
            courseDetails.SubjectIds ??
            courseDetails.subjectIDs ??
            [];
          const names = courseDetails.subjects ?? courseDetails.Subjects ?? [];

          courseSubjects = (Array.isArray(ids) ? ids : [])
            .map((id, index) => {
              const nameCandidate = names[index];
              let label = "";
              if (typeof nameCandidate === "string") label = nameCandidate.trim();
              else if (nameCandidate && typeof nameCandidate === "object")
                label =
                  nameCandidate.subjectName ??
                  nameCandidate.SubjectName ??
                  nameCandidate.name ??
                  nameCandidate.Name ??
                  "";

              if (!label) label = `Class ${id}`;
              return { id, name: String(label) };
            })
            .filter((s) => s && s.id !== null && s.id !== undefined);

          // If ids are missing but names array contains objects with ids
          if (!courseSubjects.length && Array.isArray(names) && names.length) {
            courseSubjects = names
              .map((entry) => {
                if (!entry) return null;
                if (typeof entry === "string") return { id: entry, name: entry };
                if (typeof entry === "object") {
                  const id =
                    entry.subjectID ?? entry.subjectId ?? entry.SubjectID ?? entry.id ?? entry.Id ?? null;
                  const name = entry.subjectName ?? entry.SubjectName ?? entry.name ?? entry.Name ?? "";
                  return id !== null ? { id, name: String(name) } : null;
                }
                return null;
              })
              .filter(Boolean);
          }
        }

        setSubjects(courseSubjects || []);
        setSelectedSubject("");
      } catch (err) {
        console.error("Failed to load subjects for course", err);
        setSubjects([]);
        setSelectedSubject("");
      } finally {
        if (mounted) setLoadingSubjects(false);
      }
    };

    loadSubjects();

    return () => {
      mounted = false;
    };
  }, [courseId, selectedCourse]);

  const onSubmit = async (data) => {
    if (files.length === 0) {
      setError("Please select at least one file");
      return;
    }

    const teacherId = resolveTeacherId(user);

    if (!teacherId) {
      setError("Unable to determine teacher profile. Please re-login.");
      return;
    }

    const chosenCourseId = courseId ?? selectedCourse;

    if (!chosenCourseId) {
      setError("Please select a course to attach this material to.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const resolveSubjectSelection = () => {
        if (!selectedSubject) {
          return { id: null, name: "" };
        }

        const selectedEntry = subjects.find(
          (subject) => String(subject.id) === String(selectedSubject)
        );

        const rawId = selectedSubject;
        const numericCandidate = Number(rawId);
        const resolvedId = Number.isNaN(numericCandidate)
          ? rawId
          : numericCandidate;

        return {
          id: resolvedId,
          name: selectedEntry?.name ?? "",
        };
      };

      const { id: resolvedSubjectId, name: resolvedSubjectName } =
        resolveSubjectSelection();

      const numericCourseId = Number(chosenCourseId);
      const resolvedCourseId = Number.isNaN(numericCourseId)
        ? chosenCourseId
        : numericCourseId;
      const numericTeacherId = Number(teacherId);
      const resolvedTeacherId = Number.isNaN(numericTeacherId)
        ? teacherId
        : numericTeacherId;

      const resolvedMaterials = [];
      const failedFiles = [];
      let lastError = null;

      for (const file of files) {
        try {
          let fallbackFileUrl;
          const getFallbackFileUrl = () => {
            if (!fallbackFileUrl) {
              fallbackFileUrl = URL.createObjectURL(file);
            }
            return fallbackFileUrl;
          };

          const fileTitle = data.title 
            ? (files.length > 1 ? `${data.title} - ${file.name}` : data.title) 
            : file.name.substring(0, file.name.lastIndexOf('.')) || file.name;

          const apiPayload = {
            Title: fileTitle,
            Description: data.description || "",
            CourseID: resolvedCourseId,
            TeacherID: resolvedTeacherId,
            FileType: file.type || file.name?.split?.(".").pop() || "",
            FilePath: file.name,
            IsVisible: true,
          };

          if (
            resolvedSubjectId !== null &&
            resolvedSubjectId !== undefined &&
            resolvedSubjectId !== ""
          ) {
            apiPayload.SubjectID = resolvedSubjectId;
          }

          if (resolvedSubjectName) {
            apiPayload.SubjectName = resolvedSubjectName;
          }

          const createdMaterial = await uploadMaterial(apiPayload, file);

          const finalSubjectId =
            createdMaterial?.subjectId ??
            createdMaterial?.SubjectID ??
            createdMaterial?.SubjectId ??
            createdMaterial?.subjectID ??
            resolvedSubjectId ??
            null;
          const finalSubjectName = (
            createdMaterial?.subjectName ??
            createdMaterial?.SubjectName ??
            createdMaterial?.subjectTitle ??
            createdMaterial?.SubjectTitle ??
            resolvedSubjectName ??
            ""
          ).toString();

          const materialResult = createdMaterial
            ? {
                ...createdMaterial,
                filePath:
                  createdMaterial.filePath ??
                  createdMaterial.FilePath ??
                  getFallbackFileUrl(),
                uploadDate:
                  createdMaterial.uploadDate ??
                  createdMaterial.UploadDate ??
                  new Date().toISOString(),
                courseId:
                  createdMaterial.courseId ??
                  createdMaterial.CourseID ??
                  resolvedCourseId,
                teacherId:
                  createdMaterial.teacherId ??
                  createdMaterial.TeacherID ??
                  resolvedTeacherId,
                subjectId: finalSubjectId,
                SubjectID: finalSubjectId,
                subjectName: finalSubjectName,
                SubjectName: finalSubjectName,
              }
            : {
                id: Math.random().toString(36).substring(7),
                title: fileTitle,
                description: data.description || "",
                fileType: file.type,
                fileName: file.name,
                filePath: getFallbackFileUrl(),
                uploadDate: new Date().toISOString(),
                courseId: resolvedCourseId,
                teacherId: resolvedTeacherId,
                subjectId: resolvedSubjectId ?? null,
                SubjectID: resolvedSubjectId ?? null,
                subjectName: resolvedSubjectName ?? "",
                SubjectName: resolvedSubjectName ?? "",
              };

          resolvedMaterials.push(materialResult);

          // Emit a global event so parent/other views can refresh using per-subject API
          try {
            const dispatchedCourseId =
              materialResult?.courseId ??
              materialResult?.CourseID ??
              resolvedCourseId;
            const dispatchedSubjectId =
              materialResult?.subjectId ??
              materialResult?.SubjectID ??
              resolvedSubjectId ??
              null;

            if (typeof window !== "undefined" && window && window.dispatchEvent) {
              const ev = new CustomEvent("studyMaterial:uploaded", {
                detail: {
                  courseId: dispatchedCourseId,
                  subjectId: dispatchedSubjectId,
                },
              });
              window.dispatchEvent(ev);
            }
          } catch (e) {
            // non-fatal if event can't be dispatched
          }
        } catch (fileErr) {
          console.error(`Failed to upload file ${file.name}`, fileErr);
          failedFiles.push(file);
          lastError = fileErr;
        }
      }

      if (resolvedMaterials.length > 0) {
        onSuccess(resolvedMaterials);
      }

      if (failedFiles.length > 0) {
        setFiles(failedFiles);
        setError(
          failedFiles.length === files.length
            ? "Failed to upload materials. Please try again."
            : `Uploaded ${resolvedMaterials.length} file(s), but failed to upload ${failedFiles.length} file(s).`
        );
      } else {
        reset({ title: "", description: "" });
        setFiles([]);
        setSelectedSubject("");
      }
    } catch (err) {
      setError("Failed to upload materials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      setFiles((prevFiles) => {
        const combined = [...prevFiles];
        selectedFiles.forEach((f) => {
          if (!combined.some((c) => c.name === f.name && c.size === f.size)) {
            combined.push(f);
          }
        });
        return combined;
      });
      e.target.value = "";
    }
  };

  const removeFile = (indexToRemove) => {
    setFiles((prevFiles) => prevFiles.filter((_, idx) => idx !== indexToRemove));
  };

  const handleCancel = () => {
    reset({ title: "", description: "" });
    setFiles([]);
    setError("");
    if (typeof onCancel === "function") {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-3">
        {/* Course selector - shown when parent didn't provide a courseId */}
        {!courseId && (
          <div>
            <label
              htmlFor="course"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Course
            </label>
            {loadingCourses ? (
              <p className="mt-1 text-sm text-gray-500">Loading courses…</p>
            ) : courses && courses.length ? (
              <select
                id="course"
                value={selectedCourse ?? ""}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">-- Select a course --</option>
                {courses.map((c) => {
                  const cid = String(
                    c.id ?? c.CourseID ?? c.CourseId ?? c.courseId ?? ""
                  );
                  const label =
                    c.name ||
                    c.CourseName ||
                    c.title ||
                    c.courseName ||
                    `Course ${cid}`;
                  return (
                    <option key={cid} value={cid}>
                      {label}
                    </option>
                  );
                })}
              </select>
            ) : (
              <p className="mt-1 text-sm text-gray-500">
                No courses found for your account.
              </p>
            )}
          </div>
        )}
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Title
        </label>
        <input
          id="title"
          type="text"
          {...register("title")}
          className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          {...register("description")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div className="space-y-3">
        <label
          htmlFor="classes"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Classes
        </label>
        {loadingSubjects ? (
          <p className="mt-1 text-sm text-gray-500">Loading classes…</p>
        ) : subjects && subjects.length ? (
          <select
            id="classes"
            value={selectedSubject ?? ""}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">-- Select a class --</option>
            {subjects.map((subject) => {
              const subjectId = String(subject.id);
              const subjectLabel = subject.name;

              return (
                <option key={subjectId} value={subjectId}>
                  {subjectLabel}
                </option>
              );
            })}
          </select>
        ) : (
          <p className="mt-1 text-sm text-gray-500">
            No classes found for this course.
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="file"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          File
        </label>
        <input
          id="file"
          type="file"
          multiple
          onChange={handleFileChange}
          className="mt-1 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-indigo-50 file:text-indigo-700
            hover:file:bg-indigo-100
            dark:file:bg-indigo-900 dark:file:text-indigo-100
            dark:hover:file:bg-indigo-800"
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Selected files ({files.length}):
          </p>
          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {files.map((f, index) => (
              <div
                key={`${f.name}-${index}`}
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600"
              >
                <div className="flex items-center space-x-2 truncate">
                  <span className="text-xs font-semibold px-1.5 py-0.5 bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 rounded">
                    {f.name.split(".").pop()?.toUpperCase() || "FILE"}
                  </span>
                  <span className="text-sm text-gray-700 dark:text-gray-300 truncate font-medium">
                    {f.name}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-400">
                    ({Math.round(f.size / 1024)} KB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none transition-colors"
                  title="Remove file"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-2">
        <Button
          type="button"
          onClick={handleCancel}
          variant="secondary"
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? "Uploading..." : "Upload Material"}
        </Button>
      </div>
    </form>
  );
};

export default MaterialForm;
