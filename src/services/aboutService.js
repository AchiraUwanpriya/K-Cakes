// Public (no login) data for the website-style pages.
import { getWebsiteCourses } from "./websiteCourseService";

export const INSTITUTE_INFO = {
  name: "Sweet R Cakes Academy",
  tagline: "Cake Baking & Decorating Academy",
  since: "2015",
  location: "Colombo, Sri Lanka",
  // Dummy contact details for now - replace with the real ones
  phone: "+94 77 123 4567",
  email: "info@sweetrcakes.lk",
  address: "No. 25, Sample Road, Colombo 07, Sri Lanka",
  hours: "[Opening hours]",
};

// The Courses tab is filled in by the admin (Website Courses page)
export const getPublicCourses = async () => {
  return getWebsiteCourses();
};