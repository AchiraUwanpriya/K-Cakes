export const INSTITUTE_INFO = {
    name: "Sweet of K Cakes Academy",
    tagline: "Cake Baking & Decorating Academy",
    since: "2015",
    location: "Colombo, Sri Lanka",
    phone: "077 123 4567",
    email: "institutemail@gmail.com",
    address: "street address, Colombo",
    hours: "opening hours",
};

const PUBLIC_COURSES = [
    {
    id: 1,
    name: "[Course name 1]",
    level: "Beginner",
    description: "Short description of what students learn in this course.",
    duration: "[Duration]",
    schedule: "[Days and time]",
    teacherName: "Kaushalya Samarawera",
  },
  {
    id: 2,
    name: "[Course name 2]",
    level: "Intermediate",
    description: "Short description of what students learn in this course.",
    duration: "[Duration]",
    schedule: "[Days and time]",
    teacherName: "Kaushalya Samarawera",
  },
  {
    id: 3,
    name: "[Course name 3]",
    level: "Advanced",
    description: "Short description of what students learn in this course.",
    duration: "[Duration]",
    schedule: "[Days and time]",
    teacherName: "[Teacher name]",
  },
]

const PUBLIC_TEACHERS = [
  {
    id: 1,
    name: "Kaushalya Samarawera",
    title: "Managing Director & Lead Trainer",
    qualification: "RPL Assessor and Lead Trainer",
    bio: "Cake artist, educator and entrepreneur with over 9 years of industry experience, shaping professionals since 2015.",
    photo: "/admin.png",
  },
  {
    id: 2,
    name: "[Teacher name]",
    title: "[Title]",
    qualification: "[Qualification]",
    bio: "A short bio about the teacher and their approach to teaching.",
    photo: "",
  },
];

export const getPublicCourses = async () => {
  return PUBLIC_COURSES;
};

export const getPublicTeachers = async () => {
  return PUBLIC_TEACHERS;
};