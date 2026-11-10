import { Description } from "@headlessui/react";
import axios from "axios";

export const mapWebsiteCourse = (c) => {
    if(!c || typeof c!=="object") return null;
    return{
        id:c.websiteCourseID ?? c.WebsiteCourseID ?? c.id ?? null,
        name: c.name ?? c.Name ?? "",
        level: c.level ?? c.Level ?? "",
        description: c.description ?? c.Description ?? "",
        duration: c.duration ?? c.Duration ?? "",
        schedule: c.schedule ?? c.Schedule ?? "",
        teacherName: c.teacherName ?? c.TeacherName ?? "",
        displayOrder: c.displayOrder ?? DisplayOrder ?? 0,
        isActive: c.isActive ?? c.IsActive ?? true,
    };
};

const toPayload = (c) => ({
    Name: (c.name || "").trim(),
    Level: (c.level || "").trim(),
    Description : (c.description || "").trim(),
    Duration: (c.duration || "").trim(),
    Schedule: (c.schedule || "").trim(),
    TeacherName: (c.teacherName || "").trim(),
    DisplayOrder: Number(c.displayOrder) || 0,
    IsActive: c.isActive !== false,
});

const toList = (data) => 
(Array.isArray(data) ? data : []).map(mapWebsiteCourse).filter(Boolean);

export const getWebsiteCourse = async() => {
    const response = await axios.get("/WebsiteCourses");
    return toList(response.data);
};

export const getAllWebsiteCourse = async() => {
    const response = await axios.get("/WebsiteCourses/All");
    return toList(response.data);
};

export const createWebsiteCourse = async(course) => {
    const response = await axios.post("/WebsiteCourses", toPayload(course));
    return mapWebsiteCourse(response.data);
};

export const updateWebsiteCourse = async(id, course) => {
    const response = await axios.put(`/WebsiteCourses/${id}`,{
        WebsiteCourseID: Number(id),
        ...toPayload(course),
    });
    return mapWebsiteCourse(response.data);
};

export const deleteWebsiteCourse = async(id) => {
    await axios.delete(`/WebisteCourses/${id}`);
};