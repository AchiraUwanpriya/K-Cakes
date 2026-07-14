
// import { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import { 
//   Calendar, 
//   Download, 
//   Filter, 
//   RefreshCw, 
//   Printer, 
//   User, 
//   BookOpen, 
//   DollarSign,
//   ChevronDown,
//   ChevronUp
// } from "lucide-react";

// // PDF generation libraries
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// const formatCurrency = (amount) =>
//   Number(amount || 0).toLocaleString("en-US", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   });

// const formatDate = (date) => {
//   return date ? new Date(date).toLocaleDateString("en-US", {
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//   }) : "-";
// };

// const ReportCard = ({ report, expanded, onToggle }) => {
//   const p = report.payment;
  
//   const getStatusColor = (status) => {
//     const statusLower = (status || "").toLowerCase();
//     if (statusLower.includes("paid") || statusLower === "completed") return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
//     if (statusLower.includes("pending") || statusLower.includes("unpaid")) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
//     if (statusLower.includes("due") || statusLower.includes("overdue")) return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
//     return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
//   };

//   return (
//     <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200">
//       <div className="flex justify-between items-start">
//         <div className="flex-1">
//           <div className="flex items-center gap-2">
//             <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
//             <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
//               {report.courseName}
//             </h3>
//           </div>
//           <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
//             <span>Subject:</span>
//             <span className="font-medium">{report.subjectName || "-"}</span>
//           </div>
          
//           <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
//             <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
//               <Calendar className="w-3 h-3" />
//               <span>Start: {formatDate(report.startDate)}</span>
//             </div>
//             <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
//               <Calendar className="w-3 h-3" />
//               <span>End: {formatDate(report.endDate) || "-"}</span>
//             </div>
//           </div>
//         </div>
        
//         <button
//           onClick={onToggle}
//           className="ml-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
//         >
//           {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
//         </button>
//       </div>

//       {expanded && (
//         <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
//           {p ? (
//             <div className="space-y-3">
//               <div className="grid grid-cols-3 gap-3">
//                 <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
//                   <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
//                     {formatCurrency(p.totalAmount)}
//                   </div>
//                   <div className="text-xs text-gray-600 dark:text-gray-400">Total</div>
//                 </div>
//                 <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
//                   <div className="text-2xl font-bold text-green-600 dark:text-green-400">
//                     {formatCurrency(p.paidAmount)}
//                   </div>
//                   <div className="text-xs text-gray-600 dark:text-gray-400">Paid</div>
//                 </div>
//                 <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
//                   <div className="text-2xl font-bold text-red-600 dark:text-red-400">
//                     {formatCurrency(p.balanceAmount)}
//                   </div>
//                   <div className="text-xs text-gray-600 dark:text-gray-400">Balance</div>
//                 </div>
//               </div>
              
//               <div className="flex items-center justify-between">
//                 <div className="text-sm">
//                   <span className="text-gray-600 dark:text-gray-400">Status:</span>
//                   <span className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(p.status)}`}>
//                     {p.status}
//                   </span>
//                 </div>
//                 {p.dueDate && (
//                   <div className="text-xs text-gray-500">
//                     Due: {formatDate(p.dueDate)}
//                   </div>
//                 )}
//               </div>
//             </div>
//           ) : (
//             <div className="text-center py-6 text-gray-500 dark:text-gray-400">
//               <DollarSign className="w-12 h-12 mx-auto opacity-50 mb-2" />
//               <div className="text-sm">No payment record available</div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// const AdminReports = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [expandedStudents, setExpandedStudents] = useState({});
//   const [filterType, setFilterType] = useState("all"); // all, daily, monthly
//   const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
//   const [expandedReports, setExpandedReports] = useState({});

//   useEffect(() => {
//     fetchReports();
//   }, []);

//   const fetchReports = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const apiUrl = "http://localhost:50447/api/Reports/students";
//       const headers = {};
//       try {
//         const rawToken = window.localStorage.getItem("token") || window.sessionStorage.getItem("token");
//         if (rawToken) headers["Authorization"] = `Bearer ${String(rawToken).replace(/^"|"$/g, "")}`;
//       } catch (e) {}
//       const resp = await axios.get(apiUrl, { headers });
//       setData(Array.isArray(resp.data) ? resp.data : resp.data?.data ?? []);
//     } catch (err) {
//       console.error(err);
//       setError(err?.message || "Failed to load reports");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleStudent = (studentId) => {
//     setExpandedStudents(prev => ({
//       ...prev,
//       [studentId]: !prev[studentId]
//     }));
//   };

//   const toggleReport = (studentId, reportIndex) => {
//     const key = `${studentId}-${reportIndex}`;
//     setExpandedReports(prev => ({
//       ...prev,
//       [key]: !prev[key]
//     }));
//   };

//   const filterReports = () => {
//     if (filterType === "all") return data;
    
//     const filtered = data.map(student => {
//       const filteredReports = (student.reports || []).filter(report => {
//         if (!report.startDate) return false;
        
//         const reportDate = new Date(report.startDate);
//         const filterDateObj = new Date(filterDate);
        
//         if (filterType === "daily") {
//           return reportDate.toDateString() === filterDateObj.toDateString();
//         } else if (filterType === "monthly") {
//           return reportDate.getMonth() === filterDateObj.getMonth() &&
//                  reportDate.getFullYear() === filterDateObj.getFullYear();
//         }
//         return true;
//       });
      
//       return { ...student, reports: filteredReports };
//     }).filter(student => (student.reports || []).length > 0);
    
//     return filtered;
//   };

//   const generatePDF = (type = "all") => {
//     const doc = new jsPDF();
//     const filteredData = filterReports();
//     const today = new Date();
//     const dateStr = today.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });

//     // Add title and header
//     doc.setFontSize(20);
//     doc.setTextColor(33, 33, 33);
//     doc.text("Student Reports Summary", 14, 22);
    
//     doc.setFontSize(11);
//     doc.setTextColor(100, 100, 100);
//     doc.text(`Report Type: ${type === "all" ? "All Reports" : type === "daily" ? "Daily Report" : "Monthly Report"}`, 14, 32);
//     doc.text(`Generated: ${dateStr}`, 14, 38);
//     doc.text(`Total Students: ${filteredData.length}`, 14, 44);

//     let yPosition = 55;

//     filteredData.forEach((student, studentIndex) => {
//       // Add student header
//       if (yPosition > 260) {
//         doc.addPage();
//         yPosition = 20;
//       }

//       doc.setFontSize(14);
//       doc.setTextColor(33, 33, 33);
//       doc.text(`${student.studentName} (${student.studentID})`, 14, yPosition);
      
//       doc.setFontSize(10);
//       doc.setTextColor(100, 100, 100);
//       yPosition += 7;
//       doc.text(`Email: ${student.email || 'N/A'}`, 14, yPosition);
//       yPosition += 10;

//       // Prepare table data
//       const tableData = (student.reports || []).map((report, index) => {
//         const payment = report.payment;
//         return [
//           index + 1,
//           report.courseName,
//           report.subjectName || 'N/A',
//           formatDate(report.startDate),
//           payment ? formatCurrency(payment.totalAmount) + ' LKR' : 'N/A',
//           payment ? formatCurrency(payment.paidAmount) + ' LKR' : 'N/A',
//           payment ? formatCurrency(payment.balanceAmount) + ' LKR' : 'N/A',
//           payment?.status || 'N/A'
//         ];
//       });

//       if (tableData.length > 0) {
//         autoTable(doc, {
//           startY: yPosition,
//           head: [['#', 'Course', 'Subject', 'Start Date', 'Total', 'Paid', 'Balance', 'Status']],
//           body: tableData,
//           theme: 'grid',
//           headStyles: { fillColor: [59, 130, 246] },
//           margin: { left: 14 },
//           styles: { fontSize: 9 },
//           columnStyles: {
//             0: { cellWidth: 10 },
//             1: { cellWidth: 30 },
//             2: { cellWidth: 30 },
//             3: { cellWidth: 25 },
//             4: { cellWidth: 25 },
//             5: { cellWidth: 25 },
//             6: { cellWidth: 25 },
//             7: { cellWidth: 25 }
//           }
//         });
        
//         yPosition = doc.lastAutoTable.finalY + 15;
//       } else {
//         doc.setFontSize(10);
//         doc.text("No reports available", 14, yPosition);
//         yPosition += 10;
//       }

//       // Add spacing between students
//       yPosition += 5;
//     });

//     // Add summary
//     doc.addPage();
//     doc.setFontSize(16);
//     doc.text("Financial Summary", 14, 22);
    
//     const summary = calculateSummary(filteredData);
//     doc.setFontSize(11);
//     let summaryY = 40;
    
//     doc.text(`Total Students: ${filteredData.length}`, 14, summaryY);
//     summaryY += 8;
//     doc.text(`Total Courses: ${summary.totalCourses}`, 14, summaryY);
//     summaryY += 8;
//     doc.text(`Total Revenue: ${formatCurrency(summary.totalRevenue)} LKR`, 14, summaryY);
//     summaryY += 8;
//     doc.text(`Total Collected: ${formatCurrency(summary.totalCollected)} LKR`, 14, summaryY);
//     summaryY += 8;
//     doc.text(`Total Outstanding: ${formatCurrency(summary.totalOutstanding)} LKR`, 14, summaryY);
//     summaryY += 15;

//     // Add payment status breakdown
//     doc.setFontSize(14);
//     doc.text("Payment Status Breakdown", 14, summaryY);
//     summaryY += 10;
    
//     Object.entries(summary.statusBreakdown).forEach(([status, count]) => {
//       doc.text(`${status}: ${count}`, 20, summaryY);
//       summaryY += 7;
//     });

//     // Save the PDF
//     const fileName = `Student_Reports_${type}_${today.getFullYear()}_${today.getMonth() + 1}_${today.getDate()}.pdf`;
//     doc.save(fileName);
//   };

//   const calculateSummary = (data) => {
//     const summary = {
//       totalCourses: 0,
//       totalRevenue: 0,
//       totalCollected: 0,
//       totalOutstanding: 0,
//       statusBreakdown: {}
//     };

//     data.forEach(student => {
//       (student.reports || []).forEach(report => {
//         if (report.payment) {
//           summary.totalCourses++;
//           summary.totalRevenue += Number(report.payment.totalAmount) || 0;
//           summary.totalCollected += Number(report.payment.paidAmount) || 0;
//           summary.totalOutstanding += Number(report.payment.balanceAmount) || 0;
          
//           const status = report.payment.status || 'Unknown';
//           summary.statusBreakdown[status] = (summary.statusBreakdown[status] || 0) + 1;
//         }
//       });
//     });

//     return summary;
//   };

//   const exportAllAsPDF = () => {
//     generatePDF("all");
//   };

//   const exportDailyAsPDF = () => {
//     generatePDF("daily");
//   };

//   const exportMonthlyAsPDF = () => {
//     generatePDF("monthly");
//   };

//   const filteredData = filterReports();

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
//                 <User className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
//                 Students Reports Dashboard
//               </h1>
//               <p className="text-gray-600 dark:text-gray-400 mt-2">
//                 Monitor student enrollment, payments, and course progress
//               </p>
//             </div>
            
//             <div className="flex flex-wrap gap-2">
//               <button
//                 onClick={fetchReports}
//                 className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center gap-2"
//               >
//                 <RefreshCw className="w-4 h-4" />
//                 Refresh
//               </button>
              
//               <div className="relative">
//                 <button onClick={exportAllAsPDF} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center gap-2">
//                   <Download className="w-4 h-4" />
//                   Export PDF
//                 </button>
//                 <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
//                   <button
//                     onClick={exportAllAsPDF}
//                     className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-lg flex items-center gap-2"
//                   >
//                     <Printer className="w-4 h-4" />
//                     Export All Reports
//                   </button>
//                   <button
//                     onClick={exportDailyAsPDF}
//                     className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
//                   >
//                     <Calendar className="w-4 h-4" />
//                     Export Daily Report
//                   </button>
//                   <button
//                     onClick={exportMonthlyAsPDF}
//                     className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-b-lg flex items-center gap-2"
//                   >
//                     <Calendar className="w-4 h-4" />
//                     Export Monthly Report
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Filters */}
//           <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
//             <div className="flex flex-col md:flex-row md:items-center gap-4">
//               <div className="flex items-center gap-2">
//                 <Filter className="w-5 h-5 text-gray-500" />
//                 <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter Reports:</span>
//               </div>
              
//               <div className="flex flex-wrap gap-2">
//                 <button
//                   onClick={() => setFilterType("all")}
//                   className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
//                     filterType === "all"
//                       ? "bg-indigo-600 text-white"
//                       : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
//                   }`}
//                 >
//                   All Reports
//                 </button>
                
//                 <button
//                   onClick={() => setFilterType("daily")}
//                   className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
//                     filterType === "daily"
//                       ? "bg-green-600 text-white"
//                       : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
//                   }`}
//                 >
//                   Daily Report
//                 </button>
                
//                 <button
//                   onClick={() => setFilterType("monthly")}
//                   className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
//                     filterType === "monthly"
//                       ? "bg-blue-600 text-white"
//                       : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
//                   }`}
//                 >
//                   Monthly Report
//                 </button>
//               </div>

//               {(filterType === "daily" || filterType === "monthly") && (
//                 <div className="flex-1 md:ml-auto">
//                   <input
//                     type={filterType === "daily" ? "date" : "month"}
//                     value={filterDate}
//                     onChange={(e) => setFilterDate(e.target.value)}
//                     className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                   />
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
//           <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600 dark:text-gray-400">Total Students</p>
//                 <p className="text-2xl font-bold text-gray-900 dark:text-white">{filteredData.length}</p>
//               </div>
//               <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
//                 <User className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600 dark:text-gray-400">Total Courses</p>
//                 <p className="text-2xl font-bold text-gray-900 dark:text-white">
//                   {filteredData.reduce((acc, student) => acc + (student.reports?.length || 0), 0)}
//                 </p>
//               </div>
//               <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
//                 <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
//                 <p className="text-2xl font-bold text-gray-900 dark:text-white">
//                   {formatCurrency(
//                     filteredData.reduce((acc, student) => 
//                       acc + (student.reports?.reduce((sum, report) => 
//                         sum + (report.payment?.totalAmount || 0), 0) || 0), 0
//                     )
//                   )} LKR
//                 </p>
//               </div>
//               <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
//                 <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600 dark:text-gray-400">Outstanding</p>
//                 <p className="text-2xl font-bold text-gray-900 dark:text-white">
//                   {formatCurrency(
//                     filteredData.reduce((acc, student) => 
//                       acc + (student.reports?.reduce((sum, report) => 
//                         sum + (report.payment?.balanceAmount || 0), 0) || 0), 0
//                     )
//                   )} LKR
//                 </p>
//               </div>
//               <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
//                 <DollarSign className="w-6 h-6 text-red-600 dark:text-red-400" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Loading State */}
//         {loading ? (
//           <div className="text-center py-12">
//             <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
//             <p className="mt-4 text-gray-600 dark:text-gray-400">Loading reports...</p>
//           </div>
//         ) : error ? (
//           <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
//             <div className="text-red-600 dark:text-red-400 font-medium">{error}</div>
//             <button
//               onClick={fetchReports}
//               className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
//             >
//               Try Again
//             </button>
//           </div>
//         ) : filteredData.length === 0 ? (
//           <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
//             <User className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
//             <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
//               No reports found
//             </h3>
//             <p className="text-gray-600 dark:text-gray-400">
//               {filterType === "all" 
//                 ? "No student reports available" 
//                 : `No reports found for the selected ${filterType} filter`}
//             </p>
//           </div>
//         ) : (
//           <div className="space-y-6">
//             {filteredData.map((student) => (
//               <div
//                 key={student.studentID}
//                 className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
//               >
//                 {/* Student Header */}
//                 <div className="p-6 border-b border-gray-200 dark:border-gray-700">
//                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//                     <div className="flex items-start gap-4">
//                       <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
//                         <User className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
//                       </div>
//                       <div>
//                         <div className="flex items-center gap-2">
//                           <h2 className="text-xl font-bold text-gray-900 dark:text-white">
//                             {student.studentName}
//                           </h2>
//                           <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
//                             ID: {student.studentID}
//                           </span>
//                         </div>
//                         <p className="text-gray-600 dark:text-gray-400 mt-1">{student.email}</p>
//                         <div className="flex items-center gap-4 mt-2 text-sm">
//                           <span className="text-gray-500 dark:text-gray-400">
//                             Courses: {student.reports?.length || 0}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
                    
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() => toggleStudent(student.studentID)}
//                         className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center gap-2"
//                       >
//                         {expandedStudents[student.studentID] ? (
//                           <>
//                             <ChevronUp className="w-4 h-4" />
//                             Collapse
//                           </>
//                         ) : (
//                           <>
//                             <ChevronDown className="w-4 h-4" />
//                             Expand
//                           </>
//                         )}
//                       </button>
//                       {/* Per-student export removed — use the Export PDF button above for consistent output */}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Reports Grid */}
//                 {expandedStudents[student.studentID] && (
//                   <div className="p-6 bg-gray-50 dark:bg-gray-900/50">
//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//                       {student.reports?.map((report, index) => (
//                         <ReportCard
//                           key={index}
//                           report={report}
//                           expanded={expandedReports[`${student.studentID}-${index}`]}
//                           onToggle={() => toggleReport(student.studentID, index)}
//                         />
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminReports;
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { 
  Calendar, 
  Download, 
  Filter, 
  RefreshCw, 
  Printer, 
  User, 
  BookOpen, 
  DollarSign,
  ChevronDown,
  ChevronUp,
  CreditCard,
  FileText,
  TrendingUp
} from "lucide-react";

// PDF generation libraries
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const formatCurrency = (amount) =>
  Number(amount || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const formatDate = (date) => {
  return date ? new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }) : "-";
};

const formatDateFull = (date) => {
  return date ? new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }) : "-";
};

const ReportCard = ({ report, expanded, onToggle }) => {
  const p = report.payment;
  
  const getStatusColor = (status) => {
    const statusLower = (status || "").toLowerCase();
    if (statusLower.includes("paid") || statusLower === "completed") return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    if (statusLower.includes("pending") || statusLower.includes("unpaid")) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    if (statusLower.includes("due") || statusLower.includes("overdue")) return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    if (statusLower.includes("partial")) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {report.courseName}
            </h3>
          </div>
          <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
            <span>Subject:</span>
            <span className="font-medium">{report.subjectName || "-"}</span>
          </div>
          
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <Calendar className="w-3 h-3" />
              <span>Start: {formatDate(report.startDate)}</span>
            </div>
            {p?.createdDate && (
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <Calendar className="w-3 h-3" />
                <span>Payment: {formatDate(p.createdDate)}</span>
              </div>
            )}
          </div>
        </div>
        
        <button
          onClick={onToggle}
          className="ml-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          {p ? (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(p.totalAmount)}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Total</div>
                </div>
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(p.paidAmount)}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Paid</div>
                </div>
                <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {formatCurrency(p.balanceAmount)}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Balance</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Status:</span>
                  <span className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(p.status)}`}>
                    {p.status}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  Created: {formatDate(p.createdDate)}
                </div>
              </div>

              {p.paymentHistory && p.paymentHistory.length > 0 && (
                <div className="mt-4">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Payment History
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {p.paymentHistory.map((history, idx) => (
                      <div key={history.paymentHistoryID} className="text-xs bg-gray-50 dark:bg-gray-900/50 p-2 rounded">
                        <div className="flex justify-between">
                          <span className="font-medium">Payment {idx + 1}</span>
                          <span className="text-green-600 dark:text-green-400">
                            {formatCurrency(history.amountPaid)} LKR
                          </span>
                        </div>
                        <div className="flex justify-between text-gray-500 mt-1">
                          <span>{formatDateFull(history.paymentDate)}</span>
                          <span>{history.paymentMethod}</span>
                        </div>
                        {history.remarks && (
                          <div className="text-gray-600 dark:text-gray-400 mt-1">
                            Remarks: {history.remarks}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
              <DollarSign className="w-12 h-12 mx-auto opacity-50 mb-2" />
              <div className="text-sm">No payment record available</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const AdminReports = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedStudents, setExpandedStudents] = useState({});
  const [filterType, setFilterType] = useState("all"); // all, daily, monthly
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
  const [expandedReports, setExpandedReports] = useState({});
  const [dateFilterType, setDateFilterType] = useState("payment"); // payment, enrollment

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
 //const apiUrl = "http://localhost:50447/api/Reports/students";
const apiUrl = "https://testtuitionbackend.dockyardsoftware.com/api/Reports/students";

      
      const headers = {};
      try {
        const rawToken = window.localStorage.getItem("token") || window.sessionStorage.getItem("token");
        if (rawToken) headers["Authorization"] = `Bearer ${String(rawToken).replace(/^"|"$/g, "")}`;
      } catch (e) {}
      const resp = await axios.get(apiUrl, { headers });
      setData(Array.isArray(resp.data) ? resp.data : resp.data?.data ?? []);
    } catch (err) {
      console.error(err);
      setError(err?.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const toggleStudent = (studentId) => {
    setExpandedStudents(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  const toggleReport = (studentId, reportIndex) => {
    const key = `${studentId}-${reportIndex}`;
    setExpandedReports(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const filterReports = () => {
    if (filterType === "all") return data;
    
    const filterDateObj = new Date(filterDate);
    
    const filtered = data.map(student => {
      const filteredReports = (student.reports || []).filter(report => {
        if (dateFilterType === "enrollment") {
          // Filter by enrollment date (startDate)
          if (!report.startDate) return false;
          const reportDate = new Date(report.startDate);
          
          if (filterType === "daily") {
            return reportDate.toDateString() === filterDateObj.toDateString();
          } else if (filterType === "monthly") {
            return reportDate.getMonth() === filterDateObj.getMonth() &&
                   reportDate.getFullYear() === filterDateObj.getFullYear();
          }
        } else if (dateFilterType === "payment") {
          // Filter by payment date (from paymentHistory or createdDate)
          if (!report.payment) return false;
          
          if (filterType === "daily") {
            // Check payment history dates or created date
            const hasPaymentToday = report.payment.paymentHistory?.some(history => {
              const paymentDate = new Date(history.paymentDate);
              return paymentDate.toDateString() === filterDateObj.toDateString();
            });
            
            if (hasPaymentToday) return true;
            
            // Also check if payment was created today
            const paymentCreatedDate = new Date(report.payment.createdDate);
            return paymentCreatedDate.toDateString() === filterDateObj.toDateString();
          } else if (filterType === "monthly") {
            // Check payment history dates or created date for month
            const hasPaymentThisMonth = report.payment.paymentHistory?.some(history => {
              const paymentDate = new Date(history.paymentDate);
              return paymentDate.getMonth() === filterDateObj.getMonth() &&
                     paymentDate.getFullYear() === filterDateObj.getFullYear();
            });
            
            if (hasPaymentThisMonth) return true;
            
            // Also check if payment was created this month
            const paymentCreatedDate = new Date(report.payment.createdDate);
            return paymentCreatedDate.getMonth() === filterDateObj.getMonth() &&
                   paymentCreatedDate.getFullYear() === filterDateObj.getFullYear();
          }
        }
        return true;
      });
      
      return { ...student, reports: filteredReports };
    }).filter(student => (student.reports || []).length > 0);
    
    return filtered;
  };

  const calculateDailyPayments = (filteredData) => {
    const dailyPayments = {};
    const today = filterDate;
    
    filteredData.forEach(student => {
      student.reports?.forEach(report => {
        if (report.payment?.paymentHistory) {
          report.payment.paymentHistory.forEach(history => {
            const paymentDate = new Date(history.paymentDate).toISOString().split('T')[0];
            if (paymentDate === today) {
              if (!dailyPayments[student.studentID]) {
                dailyPayments[student.studentID] = {
                  studentName: student.studentName,
                  totalPaid: 0,
                  payments: []
                };
              }
              dailyPayments[student.studentID].totalPaid += history.amountPaid;
              dailyPayments[student.studentID].payments.push({
                course: report.courseName,
                amount: history.amountPaid,
                date: history.paymentDate,
                method: history.paymentMethod
              });
            }
          });
        }
      });
    });
    
    return dailyPayments;
  };

  const calculateMonthlyPayments = (filteredData) => {
    const monthlyPayments = {};
    const filterDateObj = new Date(filterDate);
    const year = filterDateObj.getFullYear();
    const month = filterDateObj.getMonth();
    
    filteredData.forEach(student => {
      student.reports?.forEach(report => {
        if (report.payment?.paymentHistory) {
          report.payment.paymentHistory.forEach(history => {
            const paymentDate = new Date(history.paymentDate);
            if (paymentDate.getFullYear() === year && paymentDate.getMonth() === month) {
              if (!monthlyPayments[student.studentID]) {
                monthlyPayments[student.studentID] = {
                  studentName: student.studentName,
                  totalPaid: 0,
                  payments: []
                };
              }
              monthlyPayments[student.studentID].totalPaid += history.amountPaid;
              monthlyPayments[student.studentID].payments.push({
                course: report.courseName,
                amount: history.amountPaid,
                date: history.paymentDate,
                method: history.paymentMethod
              });
            }
          });
        }
      });
    });
    
    return monthlyPayments;
  };

  const generatePDF = (type = "all") => {
    const doc = new jsPDF();
    const filteredData = filterReports();
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Add title and header
    doc.setFontSize(20);
    doc.setTextColor(33, 33, 33);
    doc.text("Student Reports Summary", 14, 22);
    
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(`Report Type: ${type === "all" ? "All Reports" : type === "daily" ? "Daily Report" : "Monthly Report"}`, 14, 32);
    doc.text(`Filter Type: ${dateFilterType === "payment" ? "Payment Date" : "Enrollment Date"}`, 14, 38);
    doc.text(`Generated: ${dateStr}`, 14, 44);
    doc.text(`Total Students: ${filteredData.length}`, 14, 50);

    let yPosition = 60;

    // Add daily/monthly payment summary if applicable
    if (filterType === "daily" || filterType === "monthly") {
      doc.setFontSize(14);
      doc.setTextColor(33, 33, 33);
      doc.text(`${filterType === "daily" ? "Daily" : "Monthly"} Payment Summary`, 14, yPosition);
      yPosition += 10;
      
      const payments = filterType === "daily" ? calculateDailyPayments(filteredData) : calculateMonthlyPayments(filteredData);
      const totalDailyRevenue = Object.values(payments).reduce((sum, student) => sum + student.totalPaid, 0);
      
      doc.setFontSize(11);
      doc.text(`Total ${filterType} Revenue: ${formatCurrency(totalDailyRevenue)} LKR`, 14, yPosition);
      yPosition += 8;
      doc.text(`Total Transactions: ${Object.values(payments).reduce((sum, student) => sum + student.payments.length, 0)}`, 14, yPosition);
      yPosition += 15;
    }

    filteredData.forEach((student, studentIndex) => {
      // Add student header
      if (yPosition > 260) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(14);
      doc.setTextColor(33, 33, 33);
      doc.text(`${student.studentName} (${student.studentID})`, 14, yPosition);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      yPosition += 7;
      doc.text(`Email: ${student.email || 'N/A'}`, 14, yPosition);
      yPosition += 10;

      // Prepare table data
      const tableData = (student.reports || []).map((report, index) => {
        const payment = report.payment;
        const latestPayment = payment?.paymentHistory?.slice(-1)[0];
        return [
          index + 1,
          report.courseName,
          report.subjectName || 'N/A',
          formatDate(report.startDate),
          payment ? formatCurrency(payment.totalAmount) + ' ' : 'N/A',
          payment ? formatCurrency(payment.paidAmount) + '' : 'N/A',
          payment ? formatCurrency(payment.balanceAmount) + ' ' : 'N/A',
          payment?.status || 'N/A',
          latestPayment ? formatDate(latestPayment.paymentDate) : (payment ? formatDate(payment.createdDate) : 'N/A')
        ];
      });

      if (tableData.length > 0) {
        autoTable(doc, {
          startY: yPosition,
          head: [['#', 'Course', 'Class', 'Start Date', 'Total(LKR)', 'Paid(LKR)', 'Balance(LKR)', 'Status', 'Last Payment Date']],
          body: tableData,
          theme: 'grid',
          headStyles: { fillColor: [59, 130, 246] },
          margin: { left: 14 },
          styles: { fontSize: 8 },
          columnStyles: {
            0: { cellWidth: 8 },
            1: { cellWidth: 25 },
            2: { cellWidth: 25 },
            3: { cellWidth: 20 },
            4: { cellWidth: 20 },
            5: { cellWidth: 20 },
            6: { cellWidth: 20 },
            7: { cellWidth: 20 },
            8: { cellWidth: 20 }
          }
        });
        
        yPosition = doc.lastAutoTable.finalY + 15;
      } else {
        doc.setFontSize(10);
        doc.text("No reports available", 14, yPosition);
        yPosition += 10;
      }

      // Add spacing between students
      yPosition += 5;
    });

    // Add financial summary
    doc.addPage();
    doc.setFontSize(16);
    doc.text("Financial Summary", 14, 22);
    
    const summary = calculateSummary(filteredData);
    doc.setFontSize(11);
    let summaryY = 40;
    
    doc.text(`Total Students: ${filteredData.length}`, 14, summaryY);
    summaryY += 8;
    doc.text(`Total Courses: ${summary.totalCourses}`, 14, summaryY);
    summaryY += 8;
    doc.text(`Total Revenue: ${formatCurrency(summary.totalRevenue)} LKR`, 14, summaryY);
    summaryY += 8;
    doc.text(`Total Collected: ${formatCurrency(summary.totalCollected)} LKR`, 14, summaryY);
    summaryY += 8;
    doc.text(`Total Outstanding: ${formatCurrency(summary.totalOutstanding)} LKR`, 14, summaryY);
    summaryY += 15;

    // Add payment status breakdown
    doc.setFontSize(14);
    doc.text("Payment Status Breakdown", 14, summaryY);
    summaryY += 10;
    
    Object.entries(summary.statusBreakdown).forEach(([status, count]) => {
      doc.text(`${status}: ${count}`, 20, summaryY);
      summaryY += 7;
    });

    // Save the PDF
    const fileName = `Student_Reports_${type}_${dateFilterType}_${today.getFullYear()}_${today.getMonth() + 1}_${today.getDate()}.pdf`;
    doc.save(fileName);
  };

  const calculateSummary = (data) => {
    const summary = {
      totalCourses: 0,
      totalRevenue: 0,
      totalCollected: 0,
      totalOutstanding: 0,
      statusBreakdown: {}
    };

    data.forEach(student => {
      (student.reports || []).forEach(report => {
        if (report.payment) {
          summary.totalCourses++;
          summary.totalRevenue += Number(report.payment.totalAmount) || 0;
          summary.totalCollected += Number(report.payment.paidAmount) || 0;
          summary.totalOutstanding += Number(report.payment.balanceAmount) || 0;
          
          const status = report.payment.status || 'Unknown';
          summary.statusBreakdown[status] = (summary.statusBreakdown[status] || 0) + 1;
        }
      });
    });

    return summary;
  };

  const exportAllAsPDF = () => {
    generatePDF("all");
  };

  const exportDailyAsPDF = () => {
    generatePDF("daily");
  };

  const exportMonthlyAsPDF = () => {
    generatePDF("monthly");
  };

  const filteredData = filterReports();
  const dailyPayments = filterType === "daily" ? calculateDailyPayments(filteredData) : {};
  const monthlyPayments = filterType === "monthly" ? calculateMonthlyPayments(filteredData) : {};

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                Students Reports Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Monitor student enrollment, payments, and course progress
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={fetchReports}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              
              <div className="relative group">
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export PDF
                </button>
                <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <button
                    onClick={exportAllAsPDF}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-lg flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Export All Reports
                  </button>
                  <button
                    onClick={exportDailyAsPDF}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    Export Daily Report
                  </button>
                  <button
                    onClick={exportMonthlyAsPDF}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-b-lg flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    Export Monthly Report
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter Reports:</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterType("all")}
                  className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                    filterType === "all"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  All Reports
                </button>
                
                <button
                  onClick={() => setFilterType("daily")}
                  className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                    filterType === "daily"
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  Daily Report
                </button>
                
                <button
                  onClick={() => setFilterType("monthly")}
                  className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                    filterType === "monthly"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  Monthly Report
                </button>
              </div>

              <div className="flex items-center gap-2 ml-0 md:ml-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">Filter by:</span>
                <select
                  value={dateFilterType}
                  onChange={(e) => setDateFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                >
                  <option value="payment">Payment Date</option>
                  <option value="enrollment">Enrollment Date</option>
                </select>
              </div>

              {(filterType === "daily" || filterType === "monthly") && (
                <div className="flex-1 md:ml-auto">
                  <input
                    type={filterType === "daily" ? "date" : "month"}
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Students</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{filteredData.length}</p>
              </div>
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <User className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {filteredData.reduce((acc, student) => acc + (student.reports?.length || 0), 0)}
                </p>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(
                    filteredData.reduce((acc, student) => 
                      acc + (student.reports?.reduce((sum, report) => 
                        sum + (report.payment?.totalAmount || 0), 0) || 0), 0
                    )
                  )} LKR
                </p>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Outstanding</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(
                    filteredData.reduce((acc, student) => 
                      acc + (student.reports?.reduce((sum, report) => 
                        sum + (report.payment?.balanceAmount || 0), 0) || 0), 0
                    )
                  )} LKR
                </p>
              </div>
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <DollarSign className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Daily/Monthly Payment Summary */}
        {(filterType === "daily" && Object.keys(dailyPayments).length > 0) && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Daily Payment Summary</h2>
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm">
                {new Date(filterDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(Object.values(dailyPayments).reduce((sum, student) => sum + student.totalPaid, 0))} LKR
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Daily Collection</div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {Object.values(dailyPayments).reduce((sum, student) => sum + student.payments.length, 0)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Transactions</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {Object.keys(dailyPayments).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Students Paid Today</div>
              </div>
            </div>

            <div className="space-y-4">
              {Object.entries(dailyPayments).map(([studentId, data]) => (
                <div key={studentId} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{data.studentName}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Paid: {formatCurrency(data.totalPaid)} LKR</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm">
                      {data.payments.length} payment{data.payments.length > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {data.payments.map((payment, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm bg-gray-50 dark:bg-gray-900/50 p-2 rounded">
                        <div>
                          <span className="font-medium">{payment.course}</span>
                          <span className="text-gray-500 dark:text-gray-400 ml-2">• {formatDateFull(payment.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-green-600 dark:text-green-400 font-medium">
                            {formatCurrency(payment.amount)} LKR
                          </span>
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs">
                            {payment.method}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading reports...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
            <div className="text-red-600 dark:text-red-400 font-medium">{error}</div>
            <button
              onClick={fetchReports}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <User className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No reports found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {filterType === "all" 
                ? "No student reports available" 
                : `No reports found for the selected ${filterType} filter (${dateFilterType})`}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredData.map((student) => (
              <div
                key={student.studentID}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
              >
                {/* Student Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                        <User className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            {student.studentName}
                          </h2>
                          <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                            ID: {student.studentID}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">{student.email}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span className="text-gray-500 dark:text-gray-400">
                            Courses: {student.reports?.length || 0}
                          </span>
                          {student.reports?.some(r => r.payment) && (
                            <span className="text-gray-500 dark:text-gray-400">
                              Total Paid: {formatCurrency(
                                student.reports?.reduce((sum, report) => 
                                  sum + (report.payment?.paidAmount || 0), 0
                                ) || 0
                              )} LKR
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleStudent(student.studentID)}
                        className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center gap-2"
                      >
                        {expandedStudents[student.studentID] ? (
                          <>
                            <ChevronUp className="w-4 h-4" />
                            Collapse
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4" />
                            Expand
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Reports Grid */}
                {expandedStudents[student.studentID] && (
                  <div className="p-6 bg-gray-50 dark:bg-gray-900/50">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {student.reports?.map((report, index) => (
                        <ReportCard
                          key={index}
                          report={report}
                          expanded={expandedReports[`${student.studentID}-${index}`]}
                          onToggle={() => toggleReport(student.studentID, index)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReports;