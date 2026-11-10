import axios from "axios";

// Maps what the API returns to the shape the pages use
export const mapWebsiteCourse = (c) => {
  if (!c || typeof c !== "object") return null;
  return {
    id: c.websiteCourseID ?? c.WebsiteCourseID ?? c.id ?? null,
    name: c.name ?? c.Name ?? "",
    level: c.level ?? c.Level ?? "",
    description: c.description ?? c.Description ?? "",
    duration: c.duration ?? c.Duration ?? "",
    schedule: c.schedule ?? c.Schedule ?? "",
    teacherName: c.teacherName ?? c.TeacherName ?? "",
    weeklyFee: c.weeklyFee ?? c.WeeklyFee ?? null,
    displayOrder: c.displayOrder ?? c.DisplayOrder ?? 0,
    isActive: c.isActive ?? c.IsActive ?? true,
  };
};

const toPayload = (c) => ({
  Name: (c.name || "").trim(),
  Level: (c.level || "").trim(),
  Description: (c.description || "").trim(),
  Duration: (c.duration || "").trim(),
  Schedule: (c.schedule || "").trim(),
  TeacherName: (c.teacherName || "").trim(),
  WeeklyFee:
    c.weeklyFee === "" || c.weeklyFee == null ? null : Number(c.weeklyFee),
  DisplayOrder: Number(c.displayOrder) || 0,
  IsActive: c.isActive !== false,
});

// e.g. "LKR 2,500 / week" - empty when no fee was entered
export const formatWeeklyFee = (fee) => {
  const n = Number(fee);
  if (fee === null || fee === undefined || fee === "" || !(n > 0)) return "";
  return `LKR ${n.toLocaleString(undefined, {
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })} / week`;
};

const toList = (data) =>
  (Array.isArray(data) ? data : []).map(mapWebsiteCourse).filter(Boolean);

// Public: only the courses marked as shown on the website
export const getWebsiteCourses = async () => {
  const response = await axios.get("/WebsiteCourses");
  return toList(response.data);
};

// Admin: every course, shown and hidden
export const getAllWebsiteCourses = async () => {
  const response = await axios.get("/WebsiteCourses/All");
  return toList(response.data);
};

export const createWebsiteCourse = async (course) => {
  const response = await axios.post("/WebsiteCourses", toPayload(course));
  return mapWebsiteCourse(response.data);
};

export const updateWebsiteCourse = async (id, course) => {
  const response = await axios.put(`/WebsiteCourses/${id}`, {
    WebsiteCourseID: Number(id),
    ...toPayload(course),
  });
  return mapWebsiteCourse(response.data);
};

export const deleteWebsiteCourse = async (id) => {
  await axios.delete(`/WebsiteCourses/${id}`);
};