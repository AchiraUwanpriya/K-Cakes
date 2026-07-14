// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useAuth } from "../../contexts/AuthContext";
// import { useParams } from "react-router-dom";

// const formatCurrency = (amount) =>
//   Number(amount || 0).toLocaleString("en-US", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   });

// const formatDate = (d) => {
//   try {
//     return d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "-";
//   } catch (e) {
//     return String(d || "-");
//   }
// };

// const ReportView = () => {
//   const { user } = useAuth();
//   const { id } = useParams();
//   const studentId = id || user?.userID || user?.userId || user?.UserID;

//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!studentId) return;
//     (async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const apiUrl = `http://localhost:50447/api/Reports/student/${studentId}`;
//         const headers = {};
//         try {
//           const rawToken = window.localStorage.getItem("token") || window.sessionStorage.getItem("token");
//           if (rawToken) headers["Authorization"] = `Bearer ${String(rawToken).replace(/^\"|\"$/g, "")}`;
//         } catch (e) {}
//         const resp = await axios.get(apiUrl, { headers });
//         setData(resp.data);
//       } catch (err) {
//         console.error(err);
//         setError(err?.response?.data || err?.message || "Failed to load report");
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [studentId]);

//   if (!studentId) {
//     return (
//       <div className="p-6">
//         <div className="text-red-600">Student ID not found.</div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
//       <div className="max-w-4xl mx-auto">
//         <div className="flex items-center justify-between mb-6">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Report View</h1>
//             <p className="text-gray-600 dark:text-gray-400 mt-1">Student-level report and payment history</p>
//           </div>
//         </div>

//         {loading ? (
//           <div className="p-6 bg-white dark:bg-gray-800 rounded-lg">Loading...</div>
//         ) : error ? (
//           <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600">{String(error)}</div>
//         ) : !data ? (
//           <div className="p-6 bg-white dark:bg-gray-800 rounded-lg">No report available</div>
//         ) : (
//           <div className="space-y-6">
//             <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
//               <div className="flex items-start justify-between">
//                 <div>
//                   <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{data.studentName}</h2>
//                   <div className="text-sm text-gray-500">ID: {data.studentId}</div>
//                   <div className="text-sm text-gray-500">Email: {data.email || '-'}</div>
//                 </div>
//                 <div className="text-right">
//                   <div className="text-sm text-gray-500">Courses</div>
//                   <div className="text-2xl font-bold text-gray-900 dark:text-white">{(data.reports || []).length}</div>
//                 </div>
//               </div>
//             </div>

//             {(data.reports || []).map((r, idx) => (
//               <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
//                 <div className="flex items-start justify-between">
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{r.courseName}</h3>
//                     <div className="text-sm text-gray-500">Subject: {r.subjectName || '-'}</div>
//                     <div className="text-sm text-gray-500 mt-1">Start: {formatDate(r.startDate)}</div>
//                   </div>
//                   <div className="text-right">
//                     {r.payment ? (
//                       <>
//                         <div className="text-sm text-gray-500">Total</div>
//                         <div className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(r.payment.totalAmount)} LKR</div>
//                         <div className="text-sm text-green-600">Paid: {formatCurrency(r.payment.paidAmount)} LKR</div>
//                         <div className="text-sm text-red-600">Balance: {formatCurrency(r.payment.balanceAmount)} LKR</div>
//                         <div className="text-xs mt-2 inline-flex px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600">{r.payment.status}</div>
//                       </>
//                     ) : (
//                       <div className="text-sm text-gray-500">No payment record</div>
//                     )}
//                   </div>
//                 </div>

//                 {r.payment && Array.isArray(r.payment.paymentHistory) && r.payment.paymentHistory.length > 0 && (
//                   <div className="mt-4 border-t border-gray-100 dark:border-gray-700 pt-4 space-y-3">
//                     {r.payment.paymentHistory.map((h) => (
//                       <div key={h.paymentHistoryID} className="p-3 bg-gray-50 dark:bg-gray-900 rounded">
//                         <div className="flex items-start justify-between">
//                           <div>
//                             <div className="text-sm text-gray-600">{formatDate(h.paymentDate)}</div>
//                             <div className="text-xs text-gray-400">Method: {h.paymentMethod} • Ref: {h.referenceNo}</div>
//                             {h.remarks && <div className="text-sm text-gray-700 dark:text-gray-300 mt-2">{h.remarks}</div>}
//                           </div>
//                           <div className="text-right">
//                             <div className="text-lg font-semibold text-green-600">{formatCurrency(h.amountPaid)} LKR</div>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
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

// export default ReportView;
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { useParams } from "react-router-dom";
import { 
  Download, 
  User, 
  Mail, 
  Calendar, 
  DollarSign, 
  CreditCard,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const formatCurrency = (amount) =>
  Number(amount || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const formatDate = (d) => {
  try {
    return d ? new Date(d).toLocaleDateString("en-US", { 
      year: "numeric", 
      month: "short", 
      day: "numeric" 
    }) : "-";
  } catch (e) {
    return String(d || "-");
  }
};

const getPaymentStatusIcon = (status) => {
  switch(status?.toUpperCase()) {
    case "PAID": return <CheckCircle className="w-4 h-4 text-green-500" />;
    case "PARTIAL": return <Clock className="w-4 h-4 text-amber-500" />;
    case "UNPAID": return <AlertCircle className="w-4 h-4 text-red-500" />;
    default: return <FileText className="w-4 h-4 text-gray-400" />;
  }
};

const getPaymentStatusColor = (status) => {
  switch(status?.toUpperCase()) {
    case "PAID": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    case "PARTIAL": return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
    case "UNPAID": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
};

const ReportView = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const studentId = id || user?.userID || user?.userId || user?.UserID;
  
  const reportRef = useRef();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (!studentId) return;
    fetchReportData();
  }, [studentId]);

  const fetchReportData = async () => {
    setLoading(true);
    setError(null);
    try {
//const apiUrl = `http://localhost:50447/api/Reports/student/${studentId}`;
const apiUrl = `https://testtuitionbackend.dockyardsoftware.com/api/Reports/student/${studentId}`;
      const headers = {};
      try {
        const rawToken = window.localStorage.getItem("token") || window.sessionStorage.getItem("token");
        if (rawToken) headers["Authorization"] = `Bearer ${String(rawToken).replace(/^\"|\"$/g, "")}`;
      } catch (e) {}
      const resp = await axios.get(apiUrl, { headers });
      setData(resp.data);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data || err?.message || "Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = async () => {
    if (!reportRef.current || exporting) return;
    
    setExporting(true);
    try {
      const element = reportRef.current;
      
      // Hide buttons and controls during export
      const buttons = element.querySelectorAll('button');
      const originalDisplay = [];
      buttons.forEach(btn => {
        originalDisplay.push(btn.style.display);
        btn.style.display = 'none';
      });

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff"
      });

      // Restore buttons
      buttons.forEach((btn, i) => {
        btn.style.display = originalDisplay[i];
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = imgHeight / imgWidth;
      
      let width = pdfWidth - 20; // Margin
      let height = width * ratio;
      
      if (height > pdfHeight) {
        height = pdfHeight - 20;
        width = height / ratio;
      }

      pdf.addImage(imgData, 'PNG', 10, 10, width, height);
      pdf.save(`student-report-${studentId}-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error("PDF export failed:", error);
      alert("Failed to export PDF. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const calculateTotalStats = () => {
    if (!data?.reports) return { totalCourses: 0, totalPaid: 0, totalBalance: 0 };
    
    return data.reports.reduce((acc, report) => {
      if (report.payment) {
        acc.totalPaid += report.payment.paidAmount || 0;
        acc.totalBalance += report.payment.balanceAmount || 0;
      }
      return acc;
    }, { 
      totalCourses: data.reports.length, 
      totalPaid: 0, 
      totalBalance: 0 
    });
  };

  if (!studentId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8">
          <div className="text-red-500 text-2xl mb-4">⚠️</div>
          <div className="text-red-600 text-xl font-semibold">Student ID not found.</div>
        </div>
      </div>
    );
  }

  const stats = calculateTotalStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Student Report
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Detailed payment history and course information
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={exportToPDF}
                disabled={!data || exporting}
                className="flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                {exporting ? "Generating PDF..." : "Export as PDF"}
              </button>
              
              <button
                onClick={fetchReportData}
                className="px-4 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
            <p className="text-center text-gray-600 dark:text-gray-400 mt-4">Loading report data...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <div className="text-red-500 mt-1">⚠️</div>
              <div>
                <h3 className="text-lg font-semibold text-red-700 dark:text-red-400">Error Loading Report</h3>
                <p className="text-red-600 dark:text-red-300 mt-2">{String(error)}</p>
                <button
                  onClick={fetchReportData}
                  className="mt-4 px-4 py-2 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        ) : !data ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg text-center">
            <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">📄</div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No Report Available</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">No report data found for this student.</p>
          </div>
        ) : (
          <div ref={reportRef} className="space-y-6">
            {/* Student Info Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                      <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{data.studentName}</h2>
                      <div className="flex flex-wrap items-center gap-4 mt-3">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <div className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg text-sm font-medium">
                            ID: {data.studentId}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Mail className="w-4 h-4" />
                          <span>{data.email || 'No email'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Total Courses</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalCourses}</div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <div className="text-sm text-green-600 dark:text-green-400">Total Paid</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(stats.totalPaid)} LKR
                    </div>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
                    <div className="text-sm text-amber-600 dark:text-amber-400">Total Balance</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(stats.totalBalance)} LKR
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Courses List */}
            <div className="space-y-4">
              {(data.reports || []).map((report, idx) => (
                <div 
                  key={idx} 
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
                >
                  {/* Course Header */}
                  <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3">
                          <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
                            <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                              {report.courseName}
                            </h3>
                            <div className="flex flex-wrap items-center gap-3 mt-2">
                              <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-medium">Subject:</span> {report.subjectName || '-'}
                              </div>
                              <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                <Calendar className="w-3 h-3" />
                                <span>Start: {formatDate(report.startDate)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Payment Summary */}
                      <div className="lg:text-right">
                        {report.payment ? (
                          <div className="space-y-2">
                            <div className="text-sm text-gray-500">Course Total</div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                              {formatCurrency(report.payment.totalAmount)} LKR
                            </div>
                            
                            <div className="flex items-center justify-center lg:justify-end gap-4 mt-3">
                              <div className="text-center">
                                <div className="text-sm text-green-600 dark:text-green-400">Paid</div>
                                <div className="text-lg font-semibold">{formatCurrency(report.payment.paidAmount)} LKR</div>
                              </div>
                              <div className="text-center">
                                <div className="text-sm text-red-600 dark:text-red-400">Balance</div>
                                <div className="text-lg font-semibold">{formatCurrency(report.payment.balanceAmount)} LKR</div>
                              </div>
                            </div>
                            
                            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium">
                              {getPaymentStatusIcon(report.payment.status)}
                              <span className={getPaymentStatusColor(report.payment.status)}>
                                {report.payment.status || 'UNKNOWN'}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                            <div className="text-gray-400 dark:text-gray-500 text-4xl mb-2">💳</div>
                            <div className="text-gray-500 dark:text-gray-400">No payment record</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Payment History */}
                  {report.payment && Array.isArray(report.payment.paymentHistory) && report.payment.paymentHistory.length > 0 && (
                    <div className="p-6 bg-gray-50/50 dark:bg-gray-900/50">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        Payment History
                      </h4>
                      
                      <div className="space-y-3">
                        {report.payment.paymentHistory.map((history, hIdx) => (
                          <div 
                            key={history.paymentHistoryID || hIdx}
                            className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3">
                                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                                    <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-900 dark:text-white">
                                      {history.remarks || 'Payment'}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500 dark:text-gray-400">
                                      <div>{formatDate(history.paymentDate)}</div>
                                      <div className="flex items-center gap-1">
                                        <span className="font-medium">Method:</span> {history.paymentMethod}
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <span className="font-medium">Ref:</span> {history.referenceNo}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="sm:text-right">
                                <div className="text-xl font-bold text-green-600 dark:text-green-400">
                                  {formatCurrency(history.amountPaid)} LKR
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                  {new Date(history.createdDate).toLocaleTimeString([], { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Payment Summary Bar */}
                      <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">Total Payments: {report.payment.paymentHistory.length}</div>
                          <div className="text-lg font-bold text-gray-900 dark:text-white">
                            Total Paid: {formatCurrency(report.payment.paidAmount)} LKR
                          </div>
                        </div>
                        <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-500"
                            style={{ 
                              width: `${Math.min(100, (report.payment.paidAmount / report.payment.totalAmount) * 100)}%` 
                            }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-right">
                          {Math.round((report.payment.paidAmount / report.payment.totalAmount) * 100)}% Paid
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Footer Note */}
            <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
              Report generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportView;