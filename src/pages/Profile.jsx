// import { useState, useEffect } from "react";
// import { useAuth } from "../contexts/AuthContext";
// import Avatar from "../components/common/Avatar";
// import { getUserBasicInfo } from "../services/userService";
// import StudentQRPass from "../components/attendance/StudentQRPass";

// // Simple inline SVG icons (no external deps)
// const Icon = ({ name, className = "w-5 h-5" }) => {
//   switch (name) {
//     case "user":
//       return (
//         <svg
//           className={className}
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={1.5}
//             d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
//           />
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={1.5}
//             d="M4.5 20.25a8.25 8.25 0 1115 0v.75H4.5v-.75z"
//           />
//         </svg>
//       );
//     case "mail":
//       return (
//         <svg
//           className={className}
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={1.5}
//             d="M21.75 7.5v9a2.25 2.25 0 01-2.25 2.25h-15A2.25 2.25 0 012.25 16.5v-9A2.25 2.25 0 014.5 5.25h15A2.25 2.25 0 0121.75 7.5z"
//           />
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={1.5}
//             d="M3 7.5l8.25 5.25L19.5 7.5"
//           />
//         </svg>
//       );
//     case "badge":
//       return (
//         <svg
//           className={className}
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={1.5}
//             d="M9 12l2 2 4-4"
//           />
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={1.5}
//             d="M7.5 4.5h9a2.25 2.25 0 012.25 2.25v10.5A2.25 2.25 0 0116.5 19.5h-9A2.25 2.25 0 015.25 17.25V6.75A2.25 2.25 0 017.5 4.5z"
//           />
//         </svg>
//       );
//     case "phone":
//       return (
//         <svg
//           className={className}
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={1.5}
//             d="M2.25 6.75A2.25 2.25 0 014.5 4.5h3a2.25 2.25 0 012.25 2.25v1.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 12v0c0 4.556 3.694 8.25 8.25 8.25v0a2.25 2.25 0 002.25-2.25v-1.5A2.25 2.25 0 0012.75 14.25H11.25A2.25 2.25 0 019 12v0"
//           />
//         </svg>
//       );
//     case "school":
//       return (
//         <svg
//           className={className}
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={1.5}
//             d="M12 3l8.25 4.5L12 12 3.75 7.5 12 3z"
//           />
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={1.5}
//             d="M3.75 12L12 16.5 20.25 12"
//           />
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={1.5}
//             d="M12 12v9"
//           />
//         </svg>
//       );
//     case "download":
//       return (
//         <svg
//           className={className}
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
//           />
//         </svg>
//       );
//     default:
//       return null;
//   }
// };

// const Profile = () => {
//   const { user } = useAuth();

//   const role = user?.userType || user?.role || "student";
//   const [fetchedUserData, setFetchedUserData] = useState(null);
//   const [isLoadingUserData, setIsLoadingUserData] = useState(false);
//   const [userDataError, setUserDataError] = useState("");

//   const displayRole =
//     role === "admin"
//       ? "Administrator"
//       : role === "teacher"
//       ? "Teacher"
//       : "Student";

//   const toTitleCase = (value) =>
//     String(value || "")
//       .trim()
//       .replace(
//         /\w\S*/g,
//         (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
//       );

//   const email =
//     fetchedUserData?.Email ||
//     fetchedUserData?.email ||
//     user?.email ||
//     user?.Email ||
//     user?.username ||
//     "-";
//   const emailLocal = email && email !== "-" ? String(email).split("@")[0] : "";

//   const apiFullNameRaw =
//     fetchedUserData?.FullName ??
//     fetchedUserData?.fullName ??
//     fetchedUserData?.Name ??
//     fetchedUserData?.name ??
//     "";
//   const apiFullName = String(apiFullNameRaw || "").trim();

//   const fallbackNameFromProfile = [user?.firstName, user?.lastName]
//     .filter(Boolean)
//     .join(" ");
//   const fallbackFullName = (
//     fallbackNameFromProfile ||
//     user?.fullName ||
//     user?.name ||
//     ""
//   ).trim();

//   const baseFullName = (
//     apiFullName ||
//     fallbackFullName ||
//     emailLocal ||
//     user?.username ||
//     user?.userName ||
//     ""
//   ).trim();

//   const normalizedFullName = baseFullName
//     ? apiFullName
//       ? apiFullName
//       : toTitleCase(baseFullName)
//     : "";

//   const displayName = normalizedFullName || "User";
//   const phone =
//     fetchedUserData?.Phone ??
//     fetchedUserData?.phone ??
//     fetchedUserData?.ContactNumber ??
//     fetchedUserData?.contactNumber ??
//     user?.phone ??
//     user?.PhoneNumber ??
//     user?.phoneNumber ??
//     user?.mobile ??
//     "-";

//   const fields = (() => {
//     const base = [
//       {
//         key: "Full Name",
//         value: normalizedFullName || "-",
//         icon: "user",
//       },
//       { key: "Email", value: email || "-", icon: "mail" },
//     ];

//     if (role === "admin") {
//       return [
//         ...base,
//         { key: "Role", value: "Administrator", icon: "badge" },
//         {
//           key: "Department",
//           value: user?.department || "Administration",
//           icon: "school",
//         },
//       ];
//     }

//     if (role === "teacher") {
//       return [...base, { key: "Role", value: "Teacher", icon: "badge" }];
//     }

//     return [...base, { key: "Role", value: "Student", icon: "badge" }];
//   })();

//   useEffect(() => {
//     let cancelled = false;

//     const fetchUserData = async () => {
//       const userId =
//         user?.UserID ??
//         user?.userID ??
//         user?.userId ??
//         user?.id ??
//         user?.Id ??
//         user?.StudentID ??
//         user?.studentID ??
//         user?.studentId ??
//         null;

//       if (!userId) {
//         console.warn("No user ID available to fetch user data");
//         return;
//       }

//       try {
//         setIsLoadingUserData(true);
//         setUserDataError("");

//         const userData = await getUserBasicInfo(userId);

//         if (!cancelled) {
//           setFetchedUserData(userData);
//         }
//       } catch (error) {
//         console.error("Failed to fetch user data:", error);
//         if (!cancelled) {
//           setUserDataError(error.message || "Failed to load user information");
//         }
//       } finally {
//         if (!cancelled) {
//           setIsLoadingUserData(false);
//         }
//       }
//     };

//     fetchUserData();

//     return () => {
//       cancelled = true;
//     };
//   }, [user]);

//   return (
//     <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/20 dark:from-gray-900 dark:via-blue-950/20 dark:to-indigo-950/10 py-8 sm:py-8 px-3 sm:px-4 lg:px-8 font-sans">
//       {/* soft blobs */}
//       <div className="pointer-events-none absolute inset-0 opacity-60">
//         <div className="absolute -top-24 -left-24 h-64 w-64 sm:h-72 sm:w-72 rounded-full bg-blue-200/40 blur-3xl dark:bg-blue-900/30" />
//         <div className="absolute -bottom-24 -right-24 h-72 w-72 sm:h-80 sm:w-80 rounded-full bg-indigo-200/40 blur-3xl dark:bg-indigo-900/30" />
//       </div>

//       <div className="relative max-w-5xl mx-auto">
//         {/* Header Section */}
//         <div className="text-center mb-6 sm:mb-8">
//           <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight bg-gradient-to-r from-gray-800 via-blue-700 to-indigo-600 dark:from-white dark:via-blue-200 dark:to-indigo-300 bg-clip-text text-transparent mb-2">
//             Profile
//           </h1>
//           <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
//             Manage your account information and access credentials.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
//           {/* Left Column - Profile Card & QR */}
//           <div className="lg:col-span-3 space-y-4 sm:space-y-5">
//             {/* Profile Card */}
//             <div className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/60 dark:border-gray-800/70 p-5 sm:p-6 text-center">
//               <div className="flex justify-center mb-4 sm:mb-5">
//                 <div className="relative inline-block">
//                   <Avatar
//                     key={`avatar-${user?.UserID || user?.id}-${
//                       user?.ProfilePictureVersion ||
//                       user?.profilePictureVersion ||
//                       ""
//                     }`}
//                     name={displayName}
//                     user={user}
//                     src={user?.ProfilePicture || user?.profilePicture}
//                     size="xl"
//                     className="h-20 w-20 sm:h-24 sm:w-24 ring-4 ring-white/80 dark:ring-gray-800/80 shadow-2xl bg-gradient-to-br from-blue-500 to-indigo-600"
//                   />
//                   <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-[10px] sm:text-[12px] font-semibold px-2.5 py-1 rounded-full shadow-md whitespace-nowrap">
//                     {displayRole}
//                   </div>
//                 </div>
//               </div>

//               <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-1 truncate">
//                 {displayName}
//               </h2>
//               <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 break-all">
//                 {email}
//               </p>
//               {isLoadingUserData && (
//                 <p className="text-[11px] sm:text-xs text-blue-600 dark:text-blue-300 mb-2">
//                   Refreshing profile details...
//                 </p>
//               )}
//               {userDataError && (
//                 <p className="text-[11px] sm:text-xs text-red-600 dark:text-red-400 mb-2">
//                   {userDataError}
//                 </p>
//               )}

//               <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-3 sm:p-4 border border-blue-100 dark:border-blue-800/40">
//                 <div className="flex items-center justify-center gap-2 text-[11px] sm:text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">
//                   <Icon name="badge" className="w-4 h-4" />
//                   <span className="tracking-[0.14em] uppercase">
//                     Account Status
//                   </span>
//                 </div>
//                 <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
//                   Active
//                 </span>
//               </div>
//             </div>

//             {/* QR Code Section (use centralized student attendance QR) */}
//             {role === "student" && (
//               <div className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/60 dark:border-gray-800/70 p-5 sm:p-6">
//                 <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 text-center">
//                   Student QR Code
//                 </h3>
//                 <StudentQRPass
//                   showTitle={false}
//                   className="bg-transparent dark:bg-transparent shadow-none p-0 space-y-3"
//                 />
//               </div>
//             )}
//           </div>

//           {/* Right Column - Information */}
//           <div className="lg:col-span-3">
//             <div className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/60 dark:border-gray-800/70 p-5 sm:p-6 md:p-7 h-full">
//               <div className="flex items-center gap-3 mb-5 sm:mb-6">
//                 <div className="p-2.5 bg-blue-100/80 dark:bg-blue-900/40 rounded-xl">
//                   <Icon
//                     name="user"
//                     className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400"
//                   />
//                 </div>
//                 <div>
//                   <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
//                     Personal Information
//                   </h3>
//                   <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">
//                     Basic account details linked to your profile.
//                   </p>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
//                 {fields.map((field, index) => (
//                   <div
//                     key={field.key}
//                     className="group bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-900 dark:to-blue-900/10 rounded-2xl p-4 sm:p-5 border border-gray-100/70 dark:border-gray-800/70 hover:border-blue-200 dark:hover:border-blue-700/70 transition-all duration-300 hover:shadow-md"
//                   >
//                     <div className="flex items-start gap-3 sm:gap-4">
//                       <div className="p-2.5 sm:p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
//                         <Icon
//                           name={field.icon}
//                           className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400"
//                         />
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <h4 className="text-[11px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-[0.12em] mb-1">
//                           {field.key}
//                         </h4>
//                         <p className="text-xs sm:text-base font-medium text-gray-900 dark:text-white break-words">
//                           {String(field.value)}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Additional Info Section */}
//               <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-gray-200/80 dark:border-gray-800/80">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
//                   <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-2xl p-4 sm:p-5 border border-green-100/80 dark:border-green-800/60">
//                     <div className="flex items-center gap-2.5 sm:gap-3 mb-2.5">
//                       <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
//                         <svg
//                           className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
//                           />
//                         </svg>
//                       </div>
//                       <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
//                         Account Security
//                       </h4>
//                     </div>
//                     <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
//                       Your account is secured with industry-standard encryption
//                       and regular security updates.
//                     </p>
//                   </div>

//                   <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/10 dark:to-violet-900/10 rounded-2xl p-4 sm:p-5 border border-purple-100/80 dark:border-purple-800/60">
//                     <div className="flex items-center gap-2.5 sm:gap-3 mb-2.5">
//                       <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
//                         <svg
//                           className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                           />
//                         </svg>
//                       </div>
//                       <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
//                         Last Updated
//                       </h4>
//                     </div>
//                     <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
//                       Profile information is synchronized in real-time across
//                       all your devices.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // export default Profile;
// import { useState, useEffect } from "react";
// import { useAuth } from "../contexts/AuthContext";
// import Avatar from "../components/common/Avatar";
// import { getUserBasicInfo } from "../services/userService";
// import StudentQRPass from "../components/attendance/StudentQRPass";

// // Simple inline SVG icons (no external deps)
// const Icon = ({ name, className = "w-5 h-5" }) => {
//   switch (name) {
//     case "user":
//       return (
//         <svg
//           className={className}
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={1.5}
//             d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
//           />
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={1.5}
//             d="M4.5 20.25a8.25 8.25 0 1115 0v.75H4.5v-.75z"
//           />
//         </svg>
//       );
//     case "mail":
//       return (
//         <svg
//           className={className}
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={1.5}
//             d="M21.75 7.5v9a2.25 2.25 0 01-2.25 2.25h-15A2.25 2.25 0 012.25 16.5v-9A2.25 2.25 0 014.5 5.25h15A2.25 2.25 0 0121.75 7.5z"
//           />
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={1.5}
//             d="M3 7.5l8.25 5.25L19.5 7.5"
//           />
//         </svg>
//       );
//     case "badge":
//       return (
//         <svg
//           className={className}
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={1.5}
//             d="M9 12l2 2 4-4"
//           />
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={1.5}
//             d="M7.5 4.5h9a2.25 2.25 0 012.25 2.25v10.5A2.25 2.25 0 0116.5 19.5h-9A2.25 2.25 0 015.25 17.25V6.75A2.25 2.25 0 017.5 4.5z"
//           />
//         </svg>
//       );
//     case "phone":
//       return (
//         <svg
//           className={className}
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={1.5}
//             d="M2.25 6.75A2.25 2.25 0 014.5 4.5h3a2.25 2.25 0 012.25 2.25v1.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 12v0c0 4.556 3.694 8.25 8.25 8.25v0a2.25 2.25 0 002.25-2.25v-1.5A2.25 2.25 0 0012.75 14.25H11.25A2.25 2.25 0 019 12v0"
//           />
//         </svg>
//       );
//     case "school":
//       return (
//         <svg
//           className={className}
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={1.5}
//             d="M12 3l8.25 4.5L12 12 3.75 7.5 12 3z"
//           />
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={1.5}
//             d="M3.75 12L12 16.5 20.25 12"
//           />
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={1.5}
//             d="M12 12v9"
//           />
//         </svg>
//       );
//     case "shield":
//       return (
//         <svg
//           className={className}
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={1.5}
//             d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
//           />
//         </svg>
//       );
//     case "sync":
//       return (
//         <svg
//           className={className}
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={1.5}
//             d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
//           />
//         </svg>
//       );
//     default:
//       return null;
//   }
// };

// const Profile = () => {
//   const { user } = useAuth();

//   const role = user?.userType || user?.role || "student";
//   const [fetchedUserData, setFetchedUserData] = useState(null);
//   const [isLoadingUserData, setIsLoadingUserData] = useState(false);
//   const [userDataError, setUserDataError] = useState("");

//   const displayRole =
//     role === "admin"
//       ? "Administrator"
//       : role === "teacher"
//       ? "Teacher"
//       : "Student";

//   const toTitleCase = (value) =>
//     String(value || "")
//       .trim()
//       .replace(
//         /\w\S*/g,
//         (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
//       );

//   const email =
//     fetchedUserData?.Email ||
//     fetchedUserData?.email ||
//     user?.email ||
//     user?.Email ||
//     user?.username ||
//     "-";
//   const emailLocal = email && email !== "-" ? String(email).split("@")[0] : "";

//   const apiFullNameRaw =
//     fetchedUserData?.FullName ??
//     fetchedUserData?.fullName ??
//     fetchedUserData?.Name ??
//     fetchedUserData?.name ??
//     "";
//   const apiFullName = String(apiFullNameRaw || "").trim();

//   const fallbackNameFromProfile = [user?.firstName, user?.lastName]
//     .filter(Boolean)
//     .join(" ");
//   const fallbackFullName = (
//     fallbackNameFromProfile ||
//     user?.fullName ||
//     user?.name ||
//     ""
//   ).trim();

//   const baseFullName = (
//     apiFullName ||
//     fallbackFullName ||
//     emailLocal ||
//     user?.username ||
//     user?.userName ||
//     ""
//   ).trim();

//   const normalizedFullName = baseFullName
//     ? apiFullName
//       ? apiFullName
//       : toTitleCase(baseFullName)
//     : "";

//   const displayName = normalizedFullName || "User";
//   const phone =
//     fetchedUserData?.Phone ??
//     fetchedUserData?.phone ??
//     fetchedUserData?.ContactNumber ??
//     fetchedUserData?.contactNumber ??
//     user?.phone ??
//     user?.PhoneNumber ??
//     user?.phoneNumber ??
//     user?.mobile ??
//     "-";

//   const fields = (() => {
//     const base = [
//       {
//         key: "Full Name",
//         value: normalizedFullName || "-",
//         icon: "user",
//       },
//       { key: "Email", value: email || "-", icon: "mail" },
//     ];

//     if (role === "admin") {
//       return [
//         ...base,
//         { key: "Role", value: "Administrator", icon: "badge" },
//         {
//           key: "Department",
//           value: user?.department || "Administration",
//           icon: "school",
//         },
//       ];
//     }

//     if (role === "teacher") {
//       return [...base, { key: "Role", value: "Teacher", icon: "badge" }];
//     }

//     return [...base, { key: "Role", value: "Student", icon: "badge" }];
//   })();

//   useEffect(() => {
//     let cancelled = false;

//     const fetchUserData = async () => {
//       const userId =
//         user?.UserID ??
//         user?.userID ??
//         user?.userId ??
//         user?.id ??
//         user?.Id ??
//         user?.StudentID ??
//         user?.studentID ??
//         user?.studentId ??
//         null;

//       if (!userId) {
//         console.warn("No user ID available to fetch user data");
//         return;
//       }

//       try {
//         setIsLoadingUserData(true);
//         setUserDataError("");

//         const userData = await getUserBasicInfo(userId);

//         if (!cancelled) {
//           setFetchedUserData(userData);
//         }
//       } catch (error) {
//         console.error("Failed to fetch user data:", error);
//         if (!cancelled) {
//           setUserDataError(error.message || "Failed to load user information");
//         }
//       } finally {
//         if (!cancelled) {
//           setIsLoadingUserData(false);
//         }
//       }
//     };

//     fetchUserData();

//     return () => {
//       cancelled = true;
//     };
//   }, [user]);

//   return (
//     <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/20 dark:from-gray-900 dark:via-blue-950/20 dark:to-indigo-950/10 py-8 sm:py-8 px-3 sm:px-4 lg:px-8 font-sans">
//       {/* soft blobs */}
//       <div className="pointer-events-none absolute inset-0 opacity-60">
//         <div className="absolute -top-24 -left-24 h-64 w-64 sm:h-72 sm:w-72 rounded-full bg-blue-200/40 blur-3xl dark:bg-blue-900/30" />
//         <div className="absolute -bottom-24 -right-24 h-72 w-72 sm:h-80 sm:w-80 rounded-full bg-indigo-200/40 blur-3xl dark:bg-indigo-900/30" />
//       </div>

//       <div className="relative max-w-6xl mx-auto">
//         {/* Header Section */}
//         <div className="text-center mb-6 sm:mb-8">
//           <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight bg-gradient-to-r from-gray-800 via-blue-700 to-indigo-600 dark:from-white dark:via-blue-200 dark:to-indigo-300 bg-clip-text text-transparent mb-2">
//             Profile
//           </h1>
//           <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
//             Manage your account information and access credentials.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
//           {/* Left Column - Profile Card & QR */}
//           <div className="lg:col-span-1 space-y-4 sm:space-y-5">
//             {/* Profile Card - Significantly Larger */}
//             <div className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/60 dark:border-gray-800/70 p-5 sm:p-6 text-center">
//               <div className="flex justify-center mb-4 sm:mb-5">
//                 <div className="relative inline-block">
//                   {/* LARGER AVATAR - Increased from h-24/w-24 to h-40/w-40 */}
//                   <div className="relative">
//                     <Avatar
//                       key={`avatar-${user?.UserID || user?.id}-${
//                         user?.ProfilePictureVersion ||
//                         user?.profilePictureVersion ||
//                         ""
//                       }`}
//                       name={displayName}
//                       user={user}
//                       src={user?.ProfilePicture || user?.profilePicture}
//                       size="xxl"
//                       className="h-32 w-32 sm:h-40 sm:w-40 md:h-48 md:w-48 ring-6 ring-white/90 dark:ring-gray-800/90 shadow-3xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700"
//                     />
//                     {/* Status Indicator */}
//                     <div className="absolute bottom-4 right-4 w-5 h-5 bg-emerald-500 rounded-full ring-3 ring-white dark:ring-gray-900"></div>
//                   </div>
                  
//                   {/* Role Badge - Adjusted position for larger photo */}
//                   <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
//                     <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-full shadow-lg whitespace-nowrap">
//                       {displayRole}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Profile Info - Adjusted for larger layout */}
//               <div className="space-y-3">
//                 <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white truncate">
//                   {displayName}
//                 </h2>
//                 <div className="flex items-center justify-center gap-2">
//                   <Icon name="mail" className="w-5 h-5 text-gray-400" />
//                   <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 break-all">
//                     {email}
//                   </p>
//                 </div>
                
//                 {isLoadingUserData && (
//                   <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 text-sm">
//                     <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//                     Refreshing profile...
//                   </div>
//                 )}
//                 {userDataError && (
//                   <p className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
//                     {userDataError}
//                   </p>
//                 )}
//               </div>

//               {/* Status Section - Enhanced */}
//               <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-4 border border-blue-100 dark:border-blue-800/40">
//                 <div className="flex items-center justify-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
//                   <Icon name="badge" className="w-5 h-5" />
//                   <span className="tracking-wide uppercase">Account Status</span>
//                 </div>
//                 <div className="flex items-center justify-center gap-2">
//                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
//                   <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
//                     Active
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* QR Code Section */}
//             {role === "student" && (
//               <div className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/60 dark:border-gray-800/70 p-5 sm:p-6">
//                 <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
//                   Student QR Code
//                 </h3>
//                 <StudentQRPass
//                   showTitle={false}
//                   className="bg-transparent dark:bg-transparent shadow-none p-0 space-y-3"
//                 />
//               </div>
//             )}
//           </div>

//           {/* Right Column - Information */}
//           <div className="lg:col-span-2">
//             <div className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/60 dark:border-gray-800/70 p-5 sm:p-6 md:p-7 h-full">
//               <div className="flex items-center gap-3 mb-6 sm:mb-8">
//                 <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl">
//                   <Icon
//                     name="user"
//                     className="w-6 h-6 sm:w-7 sm:h-7 text-white"
//                   />
//                 </div>
//                 <div>
//                   <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
//                     Personal Information
//                   </h3>
//                   <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
//                     Basic account details linked to your profile.
//                   </p>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
//                 {fields.map((field, index) => (
//                   <div
//                     key={field.key}
//                     className="group bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-900 dark:to-blue-900/10 rounded-2xl p-5 sm:p-6 border border-gray-100/70 dark:border-gray-800/70 hover:border-blue-200 dark:hover:border-blue-700/70 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
//                   >
//                     <div className="flex items-start gap-4 sm:gap-5">
//                       <div className="p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
//                         <Icon
//                           name={field.icon}
//                           className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400"
//                         />
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <h4 className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-[0.15em] mb-2">
//                           {field.key}
//                         </h4>
//                         <p className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white break-words">
//                           {String(field.value)}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Additional Info Section - Enhanced */}
//               <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-gray-200/80 dark:border-gray-800/80">
//                 <h4 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-5 sm:mb-6">
//                   Account Details
//                 </h4>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
//                   <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-2xl p-5 sm:p-6 border border-green-100/80 dark:border-green-800/60">
//                     <div className="flex items-center gap-3 sm:gap-4 mb-4">
//                       <div className="p-3 bg-green-100 dark:bg-green-900/40 rounded-xl">
//                         <Icon
//                           name="shield"
//                           className="w-6 h-6 sm:w-7 sm:h-7 text-green-600 dark:text-green-400"
//                         />
//                       </div>
//                       <h4 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
//                         Account Security
//                       </h4>
//                     </div>
//                     <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
//                       Your account is secured with industry-standard encryption
//                       and regular security updates.
//                     </p>
//                   </div>

//                   <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/10 dark:to-violet-900/10 rounded-2xl p-5 sm:p-6 border border-purple-100/80 dark:border-purple-800/60">
//                     <div className="flex items-center gap-3 sm:gap-4 mb-4">
//                       <div className="p-3 bg-purple-100 dark:bg-purple-900/40 rounded-xl">
//                         <Icon
//                           name="sync"
//                           className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600 dark:text-purple-400"
//                         />
//                       </div>
//                       <h4 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
//                         Last Updated
//                       </h4>
//                     </div>
//                     <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
//                       Profile information is synchronized in real-time across
//                       all your devices.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;
// export default Profile;
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Avatar from "../components/common/Avatar";
import { getUserBasicInfo } from "../services/userService";
import StudentQRPass from "../components/attendance/StudentQRPass";

// Inline SVG icons
const Icon = ({ name, className = "w-4 h-4" }) => {
  switch (name) {
    case "user":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 1115 0v.75H4.5v-.75z" />
        </svg>
      );
    case "mail":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      );
    case "phone":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
        </svg>
      );
    case "badge":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
        </svg>
      );
    case "school":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
        </svg>
      );
    case "id":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
        </svg>
      );
    case "qr":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M6.75 6.75h.008v.008H6.75V6.75zM6.75 16.5h.008v.008H6.75v-.008zM16.5 6.75h.008v.008H16.5V6.75zM13.5 13.5h3.75v3.75H13.5V13.5zM17.25 17.25h3v3h-3v-3zM13.5 18.75h1.5v1.5h-1.5v-1.5zM18.75 13.5h1.5v1.5h-1.5v-1.5z" />
        </svg>
      );
    case "copy":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
        </svg>
      );
    case "check":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      );
    case "close":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      );
    default:
      return null;
  }
};

const Profile = ({ isModal = false, onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const role = user?.userType || user?.role || "student";
  const [fetchedUserData, setFetchedUserData] = useState(null);
  const [isLoadingUserData, setIsLoadingUserData] = useState(false);
  const [userDataError, setUserDataError] = useState("");
  const [activeTab, setActiveTab] = useState("info");
  const [copiedField, setCopiedField] = useState(null);

  const displayRole = useMemo(() => {
    if (role === "admin") return "Administrator";
    if (role === "teacher") return "Teacher";
    return "Student";
  }, [role]);

  const toTitleCase = (value) =>
    String(value || "")
      .trim()
      .replace(
        /\w\S*/g,
        (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      );

  const email =
    fetchedUserData?.Email ||
    fetchedUserData?.email ||
    user?.email ||
    user?.Email ||
    user?.username ||
    "-";

  const emailLocal = email && email !== "-" ? String(email).split("@")[0] : "";

  const apiFullNameRaw =
    fetchedUserData?.FullName ??
    fetchedUserData?.fullName ??
    fetchedUserData?.Name ??
    fetchedUserData?.name ??
    "";
  const apiFullName = String(apiFullNameRaw || "").trim();

  const fallbackNameFromProfile = [user?.firstName, user?.lastName]
    .filter(Boolean)
    .join(" ");
  const fallbackFullName = (
    fallbackNameFromProfile ||
    user?.fullName ||
    user?.name ||
    ""
  ).trim();

  const baseFullName = (
    apiFullName ||
    fallbackFullName ||
    emailLocal ||
    user?.username ||
    user?.userName ||
    ""
  ).trim();

  const displayName = baseFullName
    ? apiFullName
      ? apiFullName
      : toTitleCase(baseFullName)
    : "User";

  const phone =
    fetchedUserData?.heD_MOBILE_NO ??
    fetchedUserData?.HED_MOBILE_NO ??
    fetchedUserData?.hedMobileNo ??
    fetchedUserData?.Phone ??
    fetchedUserData?.phone ??
    fetchedUserData?.ContactNumber ??
    fetchedUserData?.contactNumber ??
    user?.heD_MOBILE_NO ??
    user?.HED_MOBILE_NO ??
    user?.hedMobileNo ??
    user?.phone ??
    user?.PhoneNumber ??
    user?.phoneNumber ??
    user?.mobile ??
    "-";

  const department =
    fetchedUserData?.Department ||
    fetchedUserData?.department ||
    user?.department ||
    (role === "admin" ? "Administration" : "");

  const idNumber =
    user?.studentId ||
    user?.StudentID ||
    user?.studentID ||
    fetchedUserData?.StudentID ||
    fetchedUserData?.studentId ||
    user?.employeeId ||
    user?.EmployeeId ||
    fetchedUserData?.EmployeeID ||
    fetchedUserData?.employeeId ||
    "";

  const userId =
    user?.UserID ??
    user?.userID ??
    user?.userId ??
    user?.id ??
    user?.Id ??
    user?.StudentID ??
    user?.studentID ??
    user?.studentId ??
    null;

  useEffect(() => {
    let cancelled = false;

    const fetchUserData = async () => {
      if (!userId) return;

      try {
        setIsLoadingUserData(true);
        setUserDataError("");

        const userData = await getUserBasicInfo(userId);
        if (!cancelled) {
          setFetchedUserData(userData);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        if (!cancelled) {
          setUserDataError(error.message || "Failed to load updated user information");
        }
      } finally {
        if (!cancelled) {
          setIsLoadingUserData(false);
        }
      }
    };

    fetchUserData();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const handleCopy = (text, fieldName) => {
    if (!text || text === "-") return;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 1800);
    }
  };

  const infoFields = [
    {
      key: "fullName",
      label: "Full Name",
      value: displayName,
      icon: "user",
      fullWidth: false,
    },
    {
      key: "email",
      label: "Email Address",
      value: email,
      icon: "mail",
      fullWidth: true,
      canCopy: true,
    },
    {
      key: "phone",
      label: "Phone Number",
      value: phone,
      icon: "phone",
      fullWidth: false,
      canCopy: phone !== "-",
    },
    {
      key: "role",
      label: "System Access",
      value: displayRole,
      icon: "badge",
      fullWidth: false,
    },
    ...(department
      ? [
          {
            key: "department",
            label: "Department",
            value: department,
            icon: "school",
            fullWidth: false,
          },
        ]
      : []),
    ...(idNumber
      ? [
          {
            key: "idNumber",
            label: role === "student" ? "Student ID" : "Employee ID",
            value: idNumber,
            icon: "id",
            fullWidth: false,
          },
        ]
      : []),
  ];

  const profileCard = (
    <div className="w-full bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700/60 font-sans">
      {/* Compact Top Banner */}
      <div className="relative h-18 sm:h-22 bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 dark:from-blue-700 dark:via-indigo-800 dark:to-indigo-950 px-4 py-3 flex items-start justify-between">
        {/* Soft light accents */}
        <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white blur-xl" />
        </div>

        <span className="relative inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/20 backdrop-blur-md text-white/95 text-[11px] font-medium tracking-wide">
          <Icon name="badge" className="w-3 h-3 text-blue-200" />
          Profile Settings
        </span>

        {/* {onClose && (
          <button
            onClick={onClose}
            className="relative rounded-full p-1.5 bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition-colors focus:outline-none"
            aria-label="Close profile"
          >
            <Icon name="close" className="w-4 h-4" />
          </button>
        )} */}
      </div>

      {/* Avatar & Core Identity */}
      <div className="relative px-4 sm:px-5 pb-3 -mt-9 sm:-mt-11 flex flex-col items-center text-center">
        <div className="relative inline-block">
          <Avatar
            key={`avatar-${userId}-${user?.ProfilePictureVersion || user?.profilePictureVersion || ""}`}
            name={displayName}
            user={user}
            src={user?.ProfilePicture || user?.profilePicture}
            size="xl"
            className="h-18 w-18 sm:h-20 sm:w-20 ring-4 ring-white dark:ring-gray-800 shadow-md bg-gradient-to-br from-blue-500 to-indigo-600"
          />
          <span
            className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-gray-800 rounded-full"
            title="Account Active"
          />
        </div>

        <h2 className="mt-2 text-base sm:text-lg font-bold text-gray-900 dark:text-white tracking-tight truncate max-w-full px-2">
          {displayName}
        </h2>

        {/* Badges Row */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mt-1">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/40">
            <Icon name="badge" className="w-3 h-3" />
            {displayRole}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active
          </span>
        </div>

        {/* Status hints */}
        {isLoadingUserData && (
          <p className="text-[11px] text-blue-600 dark:text-blue-400 mt-1.5 animate-pulse">
            Updating details...
          </p>
        )}
        {userDataError && (
          <p className="text-[11px] text-red-600 dark:text-red-400 mt-1.5 px-2 py-0.5 bg-red-50 dark:bg-red-900/20 rounded">
            {userDataError}
          </p>
        )}
      </div>

      {/* Tabs if Student */}
      {role === "student" && (
        <div className="flex border-b border-gray-100 dark:border-gray-700 px-4 sm:px-5">
          <button
            type="button"
            onClick={() => setActiveTab("info")}
            className={`flex items-center gap-1.5 py-2 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === "info"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            <Icon name="user" className="w-3.5 h-3.5" />
            Information
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("qr")}
            className={`flex items-center gap-1.5 py-2 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === "qr"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            <Icon name="qr" className="w-3.5 h-3.5" />
            Attendance QR
          </button>
        </div>
      )}

      {/* Body Content */}
      <div className="p-3.5 sm:p-5">
        {role === "student" && activeTab === "qr" ? (
          <div className="flex flex-col items-center justify-center p-2">
            <StudentQRPass
              showTitle={false}
              className="bg-transparent dark:bg-transparent shadow-none p-0 space-y-3"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
            {infoFields.map((field) => (
              <div
                key={field.key}
                className={`group relative bg-gray-50/90 dark:bg-gray-900/50 rounded-xl p-2.5 sm:p-3 border border-gray-100 dark:border-gray-700/50 transition-colors ${
                  field.fullWidth ? "sm:col-span-2" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5 min-w-0 flex-1">
                    <div className="p-1.5 bg-blue-100/70 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex-shrink-0 mt-0.5">
                      <Icon name={field.icon} className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-400">
                        {field.label}
                      </p>
                      <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100 break-all">
                        {String(field.value)}
                      </p>
                    </div>
                  </div>

                  {field.canCopy && (
                    <button
                      type="button"
                      onClick={() => handleCopy(field.value, field.key)}
                      title="Copy to clipboard"
                      className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded transition-colors flex-shrink-0"
                    >
                      {copiedField === field.key ? (
                        <Icon name="check" className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Icon name="copy" className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="px-4 sm:px-5 py-2.5 bg-gray-50/70 dark:bg-gray-900/40 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
        {!isModal ? (
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            ← Back
          </button>
        ) : (
          <div className="text-[11px] text-gray-400 dark:text-gray-500">
            Account verified
          </div>
        )}

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm transition-colors"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );

  if (isModal) {
    return profileCard;
  }

  // Standalone page layout
  return (
    <div className="min-h-[85vh] flex items-center justify-center py-6 px-3 sm:px-4 font-sans">
      <div className="w-full max-w-lg">{profileCard}</div>
    </div>
  );
};

export default Profile;