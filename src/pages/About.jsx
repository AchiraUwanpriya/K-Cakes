import React, { useEffect, useState } from "react";
import {
  getPublicCourses,
  getPublicTeachers,
  INSTITUTE_INFO,
} from "../services/aboutService";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import { RULE_BOOK } from "../utils/ruleBookData";

const AboutTab = () => {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
            About <span className="text-rose-600 dark:text-rose-400">Us</span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-rose-500 to-indigo-500 mx-auto rounded-full"></div>
          <p className="text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
            Meet the visionary behind Sweet of K Cakes - where passion meets perfection in every creation
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 dark:border-gray-800 overflow-hidden transform transition-all duration-300 hover:shadow-3xl">
          <div className="flex flex-col lg:flex-row">
            {/* Image Section */}
            <div className="lg:w-2/5 p-8 lg:p-12 bg-gradient-to-br from-rose-100 to-indigo-100 dark:from-gray-800 dark:to-indigo-900/30">
              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800">
                  <img 
                    src="/admin.png" 
                    alt="Kaushalya Samarawera" 
                    className="w-full h-64 lg:h-96 object-cover transform transition-transform duration-500 hover:scale-105"
                  />
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-rose-400/20 dark:bg-rose-500/20 rounded-full"></div>
                <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-indigo-400/20 dark:bg-indigo-500/20 rounded-full"></div>
                
                {/* Floating Badge */}
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 shadow-lg rounded-full px-6 py-3 border border-rose-100 dark:border-gray-700">
                {/* <span className="font-semibold text-white-600 dark:text-white-400">
  Award-Winning 
</span> */}

                </div>
              </div>

              {/* Quick Info */}
              <div className="mt-16 space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Kaushalya Samarawera</h3>
                <p className="text-green-600 dark:text-green-400 font-bold">
                Managing Director
                </p>

                  <p className="text-gray-600 dark:text-gray-300">Sweet of K Cakes, Sri Lanka</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">9+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Years Experience</div>
                  </div>
                  <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">2015</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Established</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="lg:w-3/5 p-8 lg:p-12">
              {/* Title with Icon */}
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-rose-100 dark:bg-rose-900/30 rounded-xl">
                  <svg className="w-6 h-6 text-rose-600 dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Our Story & Vision</h2>
              </div>

              {/* Content */}
              <div className="space-y-6 text-gray-700 dark:text-gray-300">
                <div className="relative pl-6 border-l-2 border-rose-200 dark:border-rose-800">
                  <p className="text-lg leading-relaxed">
                    Kaushalya Samarawera is a distinguished cake artist, educator, and entrepreneur from Sri Lanka, recognized for her outstanding contribution to the baking and cake decorating industry.
                  </p>
                </div>

                <p>
                  As the Managing Director of <span className="font-semibold text-green-600 dark:text-green-400">Sweet of K Cakes</span> and the <span className="font-semibold text-green-600 dark:text-green-400">Sweet of K Cakes Academy of Cake Baking & Decorating</span>, she has been successfully shaping professionals since 2015.
                </p>

                <p>
                  With over <span className="font-semibold">9 years</span> of industry experience, Kaushalya has built a strong reputation as a creative cake designer, professional cake decorator, and passionate trainer. Her expertise spans wedding cakes, celebration cakes, sugar art, and advanced cake decoration techniques.
                </p>

                {/* Highlight Box */}
                <div className="bg-gradient-to-r from-rose-50 to-indigo-50 dark:from-gray-800 dark:to-indigo-900/20 rounded-xl p-6 border border-rose-100 dark:border-gray-700">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Achievements & Recognition
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-rose-400 rounded-full"></div>
                      RPL Assessor and Lead Trainer at RPL Clement Decorating School
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-rose-400 rounded-full"></div>
                      Multiple exhibition and competition awards including "Best in the Show"
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-rose-400 rounded-full"></div>
                      Birthday Cake Category Winner
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-rose-400 rounded-full"></div>
                      Outstanding Women Performer Award by Women Icon & Times Women
                    </li>
                  </ul>
                </div>

                <p>
                  Her dedication to quality, creativity, and education has made her a respected figure in the industry. Beyond business success, she is committed to empowering aspiring bakers by sharing her knowledge and helping them build successful careers.
                </p>

                <blockquote className="relative p-6 bg-gradient-to-r from-indigo-50 to-white dark:from-indigo-900/20 dark:to-gray-800/50 rounded-xl border-l-4 border-indigo-400 dark:border-indigo-500">
                  <div className="absolute top-0 left-0 -mt-3 -ml-3 w-6 h-6 bg-indigo-400 dark:bg-indigo-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>
                  <p className="text-lg font-medium text-gray-800 dark:text-gray-200 italic pl-4">
                    "Empowering aspiring bakers through knowledge and creativity"
                  </p>
                </blockquote>
              </div>

              {/* Footer Section */}
              <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-wrap gap-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 rounded-full text-sm font-medium">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Cake Artist
                  </div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                    Educator
                  </div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-sm font-medium">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm14 7h-4l-1.5 2h-3L6 11H2v3a2 2 0 002 2h12a2 2 0 002-2v-3z" clipRule="evenodd" />
                    </svg>
                    Entrepreneur
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Footer */}
        <div className="text-center mt-12 text-gray-500 dark:text-gray-400 text-sm">
          <p>Sweet of K Cakes Academy • Since 2015 • Colombo, Sri Lanka</p>
        </div>
      </div>
    </div>
  );
};

const CoursesTab = ({ onContact }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getPublicCourses();
        setCourses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load public courses", err);
        setError("Unable to load courses right now. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Our courses
        </h2>
        <p className="mt-1 text-gray-600 dark:text-gray-300">
          To join any of these courses, please contact us and our team will
          register you.
        </p>

        {loading && (
          <div className="py-16 flex justify-center">
            <Loader />
          </div>
        )}

        {!loading && error && (
          <p className="mt-8 text-sm font-medium text-red-600">{error}</p>
        )}

        {!loading && !error && courses.length === 0 && (
          <div className="mt-8">
            <EmptyState
              title="No courses yet"
              description="Please check back soon or contact us for details."
            />
          </div>
        )}

        {!loading && !error && courses.length > 0 && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <div
                key={course.id}
                className="flex flex-col bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm"
              >
                <span className="self-start px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300">
                  {course.level}
                </span>
                <h3 className="mt-3 text-lg font-bold text-gray-900 dark:text-white">
                  {course.name}
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  {course.description}
                </p>
                <dl className="mt-4 space-y-1 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-500 dark:text-gray-400">Duration</dt>
                    <dd className="font-medium text-gray-900 dark:text-white">
                      {course.duration}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-500 dark:text-gray-400">Schedule</dt>
                    <dd className="font-medium text-gray-900 dark:text-white text-right">
                      {course.schedule}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-500 dark:text-gray-400">Teacher</dt>
                    <dd className="font-medium text-gray-900 dark:text-white text-right">
                      {course.teacherName}
                    </dd>
                  </div>
                </dl>
                <button
                  type="button"
                  onClick={onContact}
                  className="mt-6 inline-flex justify-center items-center px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold transition-colors"
                >
                  Contact us to join
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const TeachersTab = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getPublicTeachers();
        setTeachers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load public teachers", err);
        setError("Unable to load teachers right now. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Meet our teachers
        </h2>
        <p className="mt-1 text-gray-600 dark:text-gray-300">
          Get to know the people who will be teaching you.
        </p>

        {loading && (
          <div className="py-16 flex justify-center">
            <Loader />
          </div>
        )}

        {!loading && error && (
          <p className="mt-8 text-sm font-medium text-red-600">{error}</p>
        )}

        {!loading && !error && teachers.length === 0 && (
          <div className="mt-8">
            <EmptyState
              title="No teachers to show yet"
              description="Please check back soon."
            />
          </div>
        )}

        {!loading && !error && teachers.length > 0 && (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {teachers.map((teacher) => (
              <div
                key={teacher.id}
                className="flex gap-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm"
              >
                {teacher.photo ? (
                  <img
                    src={teacher.photo}
                    alt={teacher.name}
                    className="h-24 w-24 flex-none rounded-2xl object-cover"
                  />
                ) : (
                  <div className="h-24 w-24 flex-none rounded-2xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-3xl font-bold text-rose-600 dark:text-rose-300">
                    {String(teacher.name || "?").charAt(0)}
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {teacher.name}
                  </h3>
                  <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">
                    {teacher.title}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {teacher.qualification}
                  </p>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    {teacher.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ContactTab = () => {
  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Contact us
        </h2>
        <p className="mt-1 text-gray-600 dark:text-gray-300 max-w-2xl">
          To join a course, please contact us and our team will register you.
          Once registered, you can log in and see your classes, attendance and
          payments.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {[
            { label: "Phone", value: INSTITUTE_INFO.phone },
            { label: "Email", value: INSTITUTE_INFO.email },
            { label: "Address", value: INSTITUTE_INFO.address },
            { label: "Opening hours", value: INSTITUTE_INFO.hours },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-rose-600 dark:text-rose-400">
                {item.label}
              </p>
              <p className="mt-1 font-medium text-gray-900 dark:text-white">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const RuleBookTab = () => {
  return(
    <div className="py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {RULE_BOOK.title}
            </h2>
            <p className="mt-1 text-gray-600 dark:text-gray-300 max-w-xl">
              {RULE_BOOK.intro}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {RULE_BOOK.pdfs.map((file) =>(
              <a
                key={file.href}
                href={file.href}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="inline-flex items-center px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold shadow-sm transition-colors"
              >
                {file.label}
              </a>
            ))}
          </div>
        </div>
        <div className="mt-6 space-y-3">
          {RULE_BOOK.sections.map((section, index) => (
            <details
              key={section.title}
              open={index === 0}
              className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm"
            >
              <summary className="cursor-pointer select-none px-5 py-4 font-semibold text-gray-900 dark:text-white flex items-center justify-between">
                {section.title}
                <span className="text-rose-600 dark:text-rose-400 transition-transform group-open:rotate-90">
                  &rsaquo;
                </span>
              </summary>
              <ol className="px-5 pb-5 list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                {section.rules.map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ol>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
};

const TABS = [
  { key: "about", label: "About" },
  { key: "courses", label: "Courses" },
  { key: "teachers", label: "Teachers" },
  { key: "rulebook", label: "Rule Book" },
  { key: "contact", label: "Contact" },
];

const About = () => {
  const [activeTab, setActiveTab] = useState("about");

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-950 dark:to-indigo-950">
      {/* Header + tabs */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            {INSTITUTE_INFO.name}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            {INSTITUTE_INFO.tagline} &bull; Since {INSTITUTE_INFO.since}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-rose-500 to-indigo-500 mx-auto rounded-full mt-4"></div>
        </div>

        <div className="mt-8 flex gap-2 overflow-x-auto border-b border-gray-200 dark:border-gray-700">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`whitespace-nowrap px-5 py-3 text-sm font-semibold border-b-2 -mb-px transition-colors ${
                activeTab === tab.key
                  ? "border-rose-600 text-rose-600 dark:border-rose-400 dark:text-rose-400"
                  : "border-transparent text-gray-600 hover:text-rose-600 dark:text-gray-300 dark:hover:text-rose-400"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "about" && <AboutTab />}
      {activeTab === "courses" && (
        <CoursesTab onContact={() => setActiveTab("contact")} />
      )}
      {activeTab === "teachers" && <TeachersTab />}
      {activeTab === "rulebook" && <RuleBookTab />}
      {activeTab === "contact" && <ContactTab />}
    </div>
  );
};

export default About;