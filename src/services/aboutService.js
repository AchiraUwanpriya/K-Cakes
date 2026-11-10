// Public (no login) data for the website-style pages.
import { getWebsiteCourses } from "./websiteCourseService";

export const INSTITUTE_INFO = {
  name: "Sweet R Cakes Academy",
  tagline: "Cake Baking & Decorating Academy",
  since: "2015",
  location: "Colombo, Sri Lanka",
  phone: "[Phone number]",
  email: "[Email address]",
  address: "[Street address], Colombo",
  hours: "[Opening hours]",
};

// The Courses tab is filled in by the admin (Website Courses page)
export const getPublicCourses = async () => {
  return getWebsiteCourses();
};