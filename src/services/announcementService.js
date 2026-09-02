import axios from "axios";

const getCurrentTeacherId = () => {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    const user = JSON.parse(raw);
    const id =
      user?.TeacherID ??
      user?.teacherID ??
      user?.teacherId ??
      user?.UserID ??
      user?.userID ??
      user?.userId ??
      user?.id ??
      null;
    // Only enforce scoping if userType is teacher
    const userType = (user?.userType || user?.UserType || "")
      .toString()
      .toLowerCase();
    if (userType && userType !== "teacher" && user?.userTypeID !== 2)
      return null;
    return id != null ? String(id) : null;
  } catch (_) {
    return null;
  }
};

const mapAnnouncement = (announcement) => {
  if (!announcement || typeof announcement !== "object") {
    return null;
  }

  const course =
    announcement.Course ||
    announcement.course ||
    announcement.CourseDetails ||
    announcement.courseDetails ||
    {};

  const teacher =
    announcement.Teacher ||
    announcement.teacher ||
    announcement.TeacherDetails ||
    announcement.teacherDetails ||
    {};

  const resolvedId =
    announcement.AnnouncementID ??
    announcement.announcementID ??
    announcement.AnnouncementId ??
    announcement.announcementId ??
    announcement.id ??
    null;

  const courseId =
    announcement.CourseID ??
    announcement.courseID ??
    announcement.courseId ??
    course.CourseID ??
    course.courseID ??
    course.courseId ??
    course.id ??
    null;

  const teacherId =
    announcement.TeacherID ??
    announcement.teacherID ??
    announcement.teacherId ??
    teacher.TeacherID ??
    teacher.teacherID ??
    teacher.teacherId ??
    teacher.id ??
    null;

  const title =
    announcement.Title ??
    announcement.title ??
    announcement.subject ??
    announcement.heading ??
    "";

  const content =
    announcement.Content ??
    announcement.content ??
    announcement.body ??
    announcement.description ??
    "";

  const postDate =
    announcement.PostDate ??
    announcement.postDate ??
    announcement.CreatedAt ??
    announcement.createdAt ??
    announcement.timestamp ??
    new Date().toISOString();

  const expiryDate =
    announcement.ExpiryDate ??
    announcement.expiryDate ??
    announcement.ExpiresOn ??
    announcement.expiresOn ??
    null;

  const isImportant =
    announcement.IsImportant ??
    announcement.isImportant ??
    announcement.Important ??
    announcement.important ??
    false;

  const safePostDate = postDate ? (formatToApiDateTime(postDate) ?? postDate) : formatToApiDateTime(new Date());
  const safeExpiryDate = expiryDate ? (formatToApiDateTime(expiryDate) ?? expiryDate) : null;

  const announcementRecord = {
    id: resolvedId ?? `${courseId ?? "course"}-${safePostDate}`,
    AnnouncementID: resolvedId ?? null,
    announcementId: resolvedId ?? null,
    announcementID: resolvedId ?? null,
    courseId,
    CourseID: courseId,
    courseID: courseId,
    teacherId,
    TeacherID: teacherId,
    teacherID: teacherId,
    title,
    Title: title,
    content,
    Content: content,
    postDate: safePostDate,
    PostDate: safePostDate,
    expiryDate: safeExpiryDate,
    ExpiryDate: safeExpiryDate,
    isImportant: toBoolean(isImportant),
    IsImportant: toBoolean(isImportant),
    raw: announcement,
  };

  return announcementRecord;
};

const extractAnnouncements = (payload) => {
  const list = (() => {
    if (Array.isArray(payload)) {
      return payload;
    }

    if (payload && typeof payload === "object") {
      if (Array.isArray(payload.data)) {
        return payload.data;
      }
      if (Array.isArray(payload.items)) {
        return payload.items;
      }
      if (Array.isArray(payload.results)) {
        return payload.results;
      }
      if (Array.isArray(payload.announcements)) {
        return payload.announcements;
      }
      if (Array.isArray(payload.Announcements)) {
        return payload.Announcements;
      }
    }

    return [];
  })();

  return list.map(mapAnnouncement).filter(Boolean);
};

const fetchAnnouncements = async (url, config) => {
  const response = await axios.get(url, config);
  return extractAnnouncements(response.data);
};

const resolveIdentifier = (value) => {
  if (value === undefined || value === null) {
    return null;
  }

  return String(value).trim();
};

const isNotFound = (error) => error?.response?.status === 404;

const toNumberOrUndefined = (value) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const toBoolean = (value) => {
  if (typeof value === "string") {
    const lowered = value.trim().toLowerCase();
    if (lowered === "true") return true;
    if (lowered === "false") return false;
  }

  return Boolean(value);
};

export const formatToApiDateTime = (dateVal) => {
  if (!dateVal) return null;
  if (typeof dateVal === "string") {
    // If it's already YYYY-MM-DDTHH:mm:ss format
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(dateVal)) {
      return dateVal;
    }
    // If datetime-local: YYYY-MM-DDTHH:mm
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(dateVal)) {
      return `${dateVal}:00`;
    }
  }
  const d = new Date(dateVal);
  if (Number.isNaN(d.getTime())) {
    return typeof dateVal === "string" ? dateVal : null;
  }
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

export const getCourseAnnouncements = async (courseId) => {
  const resolvedId = resolveIdentifier(courseId);

  if (!resolvedId) {
    return [];
  }

  const candidateEndpoints = [
    `/Announcements/course/${resolvedId}`,
    `/Announcements/Course/${resolvedId}`,
    `/Announcements/by-course/${resolvedId}`,
  ];

  for (const endpoint of candidateEndpoints) {
    try {
      const result = await fetchAnnouncements(endpoint);
      if (Array.isArray(result) && result.length) {
        return result.filter(
          (announcement) =>
            String(announcement.courseId ?? announcement.CourseID) ===
            resolvedId
        );
      }
    } catch (error) {
      if (isNotFound(error)) {
        return [];
      }
      console.warn(`Course announcements endpoint failed (${endpoint})`, error);
    }
  }

  try {
    const result = await fetchAnnouncements(`/Announcements`, {
      params: { courseId: resolvedId },
    });
    if (Array.isArray(result) && result.length) {
      return result.filter(
        (announcement) =>
          String(announcement.courseId ?? announcement.CourseID) === resolvedId
      );
    }
  } catch (error) {
    if (isNotFound(error)) {
      return [];
    }
    console.error("Failed to load course announcements from API", error);
    throw error;
  }
  return [];
};

export const getAllAnnouncements = async () => {
  try {
    const announcements = await fetchAnnouncements(`/Announcements`);
    const currentTeacherId = getCurrentTeacherId();
    if (currentTeacherId) {
      return announcements.filter((a) => {
        const tId = a.TeacherID ?? a.teacherID ?? a.teacherId;
        return tId != null ? String(tId) === String(currentTeacherId) : false;
      });
    }
    return announcements;
  } catch (error) {
    if (isNotFound(error)) {
      return [];
    }
    console.error("Failed to load announcements from API", error);
    throw error;
  }
};

const mapAnnouncementPayload = ({
  courseId,
  teacherId,
  title,
  content,
  postDate,
  expiryDate,
  isImportant,
}) => {
  const payload = {
    CourseID: toNumberOrUndefined(courseId),
    TeacherID: toNumberOrUndefined(teacherId),
    Title: title,
    Content: content,
    PostDate: formatToApiDateTime(postDate) ?? formatToApiDateTime(new Date()),
    ExpiryDate: expiryDate ? formatToApiDateTime(expiryDate) : undefined,
    IsImportant: typeof isImportant === "boolean" ? isImportant : toBoolean(isImportant),
  };

  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined)
  );
};

export const createAnnouncement = async ({
  courseId,
  teacherId,
  title,
  content,
  postDate,
  expiryDate,
  isImportant,
}) => {
  try {
    const payload = mapAnnouncementPayload({
      courseId,
      teacherId,
      title,
      content,
      postDate,
      expiryDate,
      isImportant,
    });
    const response = await axios.post(`/Announcements`, payload);
    const mapped = mapAnnouncement(response.data) ?? response.data;

    if (mapped?.AnnouncementID != null) {
      try {
        const detailResponse = await axios.get(
          `/Announcements/${mapped.AnnouncementID}`
        );
        const refreshed = mapAnnouncement(detailResponse.data);
        if (refreshed) {
          return refreshed;
        }
      } catch (_) {
        // ignore refresh errors and fall back to initial mapped response
      }
    }

    return mapped;
  } catch (error) {
    console.error("Failed to create announcement via API", error);
    throw error;
  }
};

export const updateAnnouncement = async (announcementId, data = {}) => {
  const resolvedId = resolveIdentifier(
    announcementId ?? data.announcementID ?? data.announcementId ?? data.id
  );

  if (!resolvedId) {
    throw new Error("Announcement ID is required for update.");
  }

  const courseId = data.courseID ?? data.courseId ?? data.CourseID;
  const teacherId = data.teacherID ?? data.teacherId ?? data.TeacherID;
  const title = data.title ?? data.Title ?? "";
  const content = data.content ?? data.Content ?? "";
  const postDate = data.postDate ?? data.PostDate;
  const expiryDate = data.expiryDate ?? data.ExpiryDate;
  const isImportant = data.isImportant ?? data.IsImportant;

  const payload = {
    announcementID: Number(resolvedId),
    courseID: toNumberOrUndefined(courseId),
    teacherID: toNumberOrUndefined(teacherId),
    title: String(title),
    content: String(content),
    postDate: formatToApiDateTime(postDate) ?? formatToApiDateTime(new Date()),
    expiryDate: expiryDate ? formatToApiDateTime(expiryDate) : null,
    isImportant: toBoolean(isImportant),
  };

  try {
    const response = await axios.put(`/Announcements/${resolvedId}`, payload);
    const mapped =
      response?.data &&
      typeof response.data === "object" &&
      Object.keys(response.data).length > 0
        ? mapAnnouncement(response.data)
        : null;

    if (mapped) {
      return mapped;
    }

    try {
      const detailResponse = await axios.get(`/Announcements/${resolvedId}`);
      const refreshed = mapAnnouncement(detailResponse.data);
      if (refreshed) {
        return refreshed;
      }
    } catch (_) {
      // ignore refresh errors and fall back
    }

    return mapAnnouncement({
      ...payload,
      AnnouncementID: Number(resolvedId),
      announcementID: Number(resolvedId),
      id: Number(resolvedId),
    });
  } catch (error) {
    console.error("Failed to update announcement via API", error);
    throw error;
  }
};

export const getAnnouncementsByTeacher = async (teacherId) => {
  const resolvedId = resolveIdentifier(teacherId);

  if (!resolvedId) {
    return [];
  }

  const candidateEndpoints = [];

  for (const endpoint of candidateEndpoints) {
    try {
      const result = await fetchAnnouncements(endpoint);
      if (Array.isArray(result) && result.length) {
        return result.filter(
          (announcement) =>
            String(announcement.teacherId ?? announcement.TeacherID) ===
            resolvedId
        );
      }
    } catch (error) {
      if (isNotFound(error)) {
        return [];
      }
      console.warn(
        `Teacher announcements endpoint failed (${endpoint})`,
        error
      );
    }
  }

  try {
    const result = await fetchAnnouncements(`/Announcements`, {
      params: { teacherId: resolvedId },
    });
    if (Array.isArray(result) && result.length) {
      return result.filter(
        (announcement) =>
          String(announcement.teacherId ?? announcement.TeacherID) ===
          resolvedId
      );
    }
  } catch (error) {
    if (isNotFound(error)) {
      return [];
    }
    console.error("Failed to load teacher announcements from API", error);
    throw error;
  }
  return [];
};

export const getAnnouncementsForCourses = async (courseIds = []) => {
  if (!Array.isArray(courseIds) || courseIds.length === 0) {
    return await getAllAnnouncements();
  }

  const results = await Promise.all(
    courseIds.map((courseId) => getCourseAnnouncements(courseId))
  );

  const merged = results.flat();

  if (merged.length) {
    const seen = new Set();
    return merged.filter((announcement) => {
      if (seen.has(announcement.id)) {
        return false;
      }
      seen.add(announcement.id);
      return true;
    });
  }
  return [];
};

export const getAnnouncementsForStudent = async (studentId) => {
  const resolvedId = resolveIdentifier(studentId);

  if (!resolvedId) {
    return [];
  }

  // Prefer backend endpoint that returns announcements for student-enrolled courses
  try {
    const result = await fetchAnnouncements(
      `/Announcements/Student/${resolvedId}`
    );
    return result;
  } catch (error) {
    if (isNotFound(error)) {
      return [];
    }
    // Continue to alternative candidates below
  }

  const candidateEndpoints = [
    `/Announcements/student/${resolvedId}`,
    `/Announcements/Student/${resolvedId}`,
    `/Announcements/by-student/${resolvedId}`,
  ];

  for (const endpoint of candidateEndpoints) {
    try {
      return await fetchAnnouncements(endpoint);
    } catch (error) {
      if (isNotFound(error)) {
        return [];
      }
      console.warn(
        `Student announcements endpoint failed (${endpoint})`,
        error
      );
    }
  }

  try {
    return await fetchAnnouncements(`/Announcements`, {
      params: { studentId: resolvedId },
    });
  } catch (error) {
    if (isNotFound(error)) {
      return [];
    }
    console.error("Failed to load student announcements from API", error);
    throw error;
  }
};
