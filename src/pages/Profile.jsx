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
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import Avatar from "../components/common/Avatar";
import { getUserBasicInfo } from "../services/userService";
import StudentQRPass from "../components/attendance/StudentQRPass";

// Simple inline SVG icons (no external deps)
const Icon = ({ name, className = "w-5 h-5" }) => {
  switch (name) {
    case "user":
      return (
        <svg
          className={className}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4.5 20.25a8.25 8.25 0 1115 0v.75H4.5v-.75z"
          />
        </svg>
      );
    case "mail":
      return (
        <svg
          className={className}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21.75 7.5v9a2.25 2.25 0 01-2.25 2.25h-15A2.25 2.25 0 012.25 16.5v-9A2.25 2.25 0 014.5 5.25h15A2.25 2.25 0 0121.75 7.5z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 7.5l8.25 5.25L19.5 7.5"
          />
        </svg>
      );
    case "badge":
      return (
        <svg
          className={className}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12l2 2 4-4"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M7.5 4.5h9a2.25 2.25 0 012.25 2.25v10.5A2.25 2.25 0 0116.5 19.5h-9A2.25 2.25 0 015.25 17.25V6.75A2.25 2.25 0 017.5 4.5z"
          />
        </svg>
      );
    case "phone":
      return (
        <svg
          className={className}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M2.25 6.75A2.25 2.25 0 014.5 4.5h3a2.25 2.25 0 012.25 2.25v1.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 12v0c0 4.556 3.694 8.25 8.25 8.25v0a2.25 2.25 0 002.25-2.25v-1.5A2.25 2.25 0 0012.75 14.25H11.25A2.25 2.25 0 019 12v0"
          />
        </svg>
      );
    case "school":
      return (
        <svg
          className={className}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 3l8.25 4.5L12 12 3.75 7.5 12 3z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3.75 12L12 16.5 20.25 12"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 12v9"
          />
        </svg>
      );
    case "shield":
      return (
        <svg
          className={className}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      );
    case "sync":
      return (
        <svg
          className={className}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      );
    case "calendar":
      return (
        <svg
          className={className}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
          />
        </svg>
      );
    case "key":
      return (
        <svg
          className={className}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
          />
        </svg>
      );
    case "info":
      return (
        <svg
          className={className}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
          />
        </svg>
      );
    default:
      return null;
  }
};

const Profile = () => {
  const { user } = useAuth();

  const role = user?.userType || user?.role || "student";
  const [fetchedUserData, setFetchedUserData] = useState(null);
  const [isLoadingUserData, setIsLoadingUserData] = useState(false);
  const [userDataError, setUserDataError] = useState("");

  const displayRole =
    role === "admin"
      ? "Administrator"
      : role === "teacher"
      ? "Teacher"
      : "Student";

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

  const normalizedFullName = baseFullName
    ? apiFullName
      ? apiFullName
      : toTitleCase(baseFullName)
    : "";

  const displayName = normalizedFullName || "User";
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

  const fields = (() => {
    const base = [
      {
        key: "Full Name",
        value: normalizedFullName || "-",
        icon: "user",
        
      },
      { 
        key: "Email Address", 
        value: email || "-", 
        icon: "mail",
        description: "Primary contact and login email",
        isEmail: true 
      },
    ];

    if (role === "admin") {
      return [
        ...base,
        { 
          key: "Role", 
          value: "Administrator", 
          icon: "badge",
          description: "System access level"
        },
        {
          key: "Department",
          value: user?.department || "Administration",
          icon: "school",
          description: "Assigned department"
        },
      ];
    }

    if (role === "teacher") {
      return [
        ...base,
        { 
          key: "Role", 
          value: "Teacher", 
          icon: "badge",
          description: "System access level"
        },
        {
          key: "Employee ID",
          value: user?.employeeId || "T-" + (user?.id?.slice(-6) || "000000"),
          icon: "key",
          description: "Unique staff identifier"
        },
      ];
    }

    return [
      ...base,
      { 
        key: "Role", 
        value: "Student", 
        icon: "badge",
        description: "System access level"
      },
      {
        key: "Student ID",
        value: user?.studentId || "S-" + (user?.id?.slice(-6) || "000000"),
        icon: "key",
        description: "Unique student identifier"
      },
    ];
  })();

  const additionalFields = [
    { key: "Member Since", value: "January 2024", icon: "calendar" },
    { key: "Last Login", value: "Today, 10:30 AM", icon: "sync" },
  ];

  useEffect(() => {
    let cancelled = false;

    const fetchUserData = async () => {
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

      if (!userId) {
        console.warn("No user ID available to fetch user data");
        return;
      }

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
          setUserDataError(error.message || "Failed to load user information");
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
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 py-6 sm:py-8 px-3 sm:px-4 lg:px-6 font-sans">
      {/* Background decorative elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Profile Settings
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                Manage your account information and preferences
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-xl px-4 py-3 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Account Active
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="relative h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
              <div className="relative px-6 pb-6 -mt-16">
                <div className="flex justify-center mb-6">
                  <Avatar
                    key={`avatar-${user?.UserID || user?.id}-${
                      user?.ProfilePictureVersion ||
                      user?.profilePictureVersion ||
                      ""
                    }`}
                    name={displayName}
                    user={user}
                    src={user?.ProfilePicture || user?.profilePicture}
                    size="xxl"
                    className="h-32 w-32 ring-4 ring-white dark:ring-gray-800 shadow-xl border-2 border-white dark:border-gray-700"
                  />
                </div>

                <div className="text-center space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {displayName}
                    </h2>
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full">
                      <Icon name="badge" className="w-4 h-4" />
                      <span className="text-sm font-semibold">{displayRole}</span>
                    </div>
                  </div>

                  {/* Email Box - Fixed */}
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Icon name="mail" className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Email Address</p>
                        <p className="text-gray-900 dark:text-white font-medium break-all">
                          {email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Phone Box - Fixed */}
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Icon name="phone" className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Phone Number</p>
                        <p className="text-gray-900 dark:text-white font-medium break-all">
                          {phone}
                        </p>
                      </div>
                    </div>
                  </div>

                  {isLoadingUserData && (
                    <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 text-sm">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      Updating profile...
                    </div>
                  )}
                  {userDataError && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                      <p className="text-sm text-red-600 dark:text-red-400 text-center">
                        {userDataError}
                      </p>
                    </div>
                  )}
                </div>

                
                {/* <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">98%</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Profile Complete</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">24</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Active Sessions</div>
                  </div>
                </div> */}
              </div>
            </div>

            {/* QR Code Section for Students */}
            {role === "student" && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Icon name="badge" className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Student ID Card</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Scan for attendance</p>
                  </div>
                </div>
                <StudentQRPass
                  showTitle={false}
                  className="bg-transparent dark:bg-transparent shadow-none p-0"
                />
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Updated: Today, 09:42 AM
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                    <Icon name="user" className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Personal Information</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Basic account details linked to your profile</p>
                  </div>
                </div>
                {/* <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                  Edit Profile
                </button> */}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields.map((field, index) => (
                  <div
                    key={field.key}
                    className="group bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${field.isEmail ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
                        <Icon
                          name={field.icon}
                          className={`w-5 h-5 ${field.isEmail ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                          {field.key}
                        </h4>
                        <p className={`text-base font-semibold ${field.isEmail ? 'text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-white'} break-words`}>
                          {String(field.value)}
                        </p>
                        {field.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            {field.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Account Security */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                    <Icon name="shield" className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Account Security</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Two-Factor Authentication</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-xs font-medium rounded-full">
                      Enabled
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Last Security Update</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">2 days ago</span>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  {/* <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    Your account is protected with 256-bit encryption and monitored 24/7 for suspicious activity.
                  </p> */}
                </div>
              </div>

              {/* Account Activity */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                    <Icon name="sync" className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Account Activity</h3>
                </div>
                <div className="space-y-4">
                  {additionalFields.map((field) => (
                    <div key={field.key} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon name={field.icon} className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{field.key}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{field.value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  {/* <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    Profile information syncs automatically across all your registered devices.
                  </p> */}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            {/* <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="flex flex-col items-center justify-center p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 border border-blue-200 dark:border-blue-800 transition-colors">
                  <Icon name="key" className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Change Password</span>
                </button>
                <button className="flex flex-col items-center justify-center p-4 rounded-xl bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 border border-green-200 dark:border-green-800 transition-colors">
                  <Icon name="shield" className="w-6 h-6 text-green-600 dark:text-green-400 mb-2" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Security</span>
                </button>
                <button className="flex flex-col items-center justify-center p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 border border-purple-200 dark:border-purple-800 transition-colors">
                  <Icon name="mail" className="w-6 h-6 text-purple-600 dark:text-purple-400 mb-2" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Notifications</span>
                </button>
                <button className="flex flex-col items-center justify-center p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 border border-orange-200 dark:border-orange-800 transition-colors">
                  <Icon name="info" className="w-6 h-6 text-orange-600 dark:text-orange-400 mb-2" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Help</span>
                </button>
              </div> */}
            {/* </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;