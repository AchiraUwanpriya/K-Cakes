// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useAuth } from "../../contexts/AuthContext";

// const TeacherPaymentHistory = () => {
//   const { user } = useAuth();
//   const [payments, setPayments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [expanded, setExpanded] = useState({});
//   const [search, setSearch] = useState("");

//   const teacherId = user?.UserID || user?.userID || user?.id || 2;

//   useEffect(() => {
//     fetchPayments();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [teacherId]);

//   const fetchPayments = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const url = `http://localhost:50447/api/Payments/teacher/${teacherId}`;
//       const rawToken = window.localStorage.getItem("token") || window.sessionStorage.getItem("token");
//       const headers = {};
//       if (rawToken) {
//         const token = String(rawToken).replace(/^"|"$/g, "").replace(/^'|'$/g, "");
//         headers["Authorization"] = `Bearer ${token}`;
//       }
//       const resp = await axios.get(url, { headers });
//       setPayments(Array.isArray(resp.data) ? resp.data : []);
//     } catch (err) {
//       console.error(err);
//       setError(err?.response?.data || err?.message || "Failed to load payments");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggle = (id) => setExpanded((s) => ({ ...s, [id]: !s[id] }));

//   const formatCurrency = (n) => `Rs. ${Number(n || 0).toFixed(2)}`;
//   const formatDate = (d) => (d ? new Date(d).toLocaleString() : "-");

//   const filtered = payments.filter((p) => {
//     const q = (search || "").toString().toLowerCase();
//     if (!q) return true;
//     return (
//       String(p.studentName || "").toLowerCase().includes(q) ||
//       String(p.parentName || "").toLowerCase().includes(q) ||
//       String(p.enrollmentID || "").includes(q)
//     );
//   });

//   return (
//     <div className="p-6 min-h-screen">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-2xl font-semibold mb-4">Teacher Payment History</h1>

//         {loading && <div className="p-6 bg-white dark:bg-gray-800 rounded shadow">Loading...</div>}
//         {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 rounded mb-4">{String(error)}</div>}

//         {!loading && !error && (
//           <>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//               <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
//                 <div className="text-sm text-gray-500">Total Students</div>
//                 <div className="text-xl font-semibold mt-2">{payments.length}</div>
//               </div>
//               <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
//                 <div className="text-sm text-gray-500">Total Received</div>
//                 <div className="text-xl font-semibold text-green-600 mt-2">{formatCurrency(payments.reduce((s, x) => s + (Number(x.paidAmount) || 0), 0))}</div>
//               </div>
//               <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
//                 <div className="text-sm text-gray-500">Pending Balance</div>
//                 <div className="text-xl font-semibold text-red-600 mt-2">{formatCurrency(payments.reduce((s, x) => s + (Number(x.balanceAmount) || 0), 0))}</div>
//               </div>
//             </div>

//             <div className="flex items-center justify-between mb-6 gap-3">
//               <div className="relative w-full max-w-xl">
//                 <input
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   placeholder="Search student, parent or enrollment ID"
//                   className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
//                 />
//                 <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</div>
//               </div>

//               <div className="flex gap-2">
//                 <button onClick={fetchPayments} className="px-4 py-2 rounded bg-indigo-600 text-white">Refresh</button>
//               </div>
//             </div>

//             {filtered.length === 0 ? (
//               <div className="p-6 bg-white dark:bg-gray-800 rounded shadow text-center">No payment records found.</div>
//             ) : (
//               filtered.map((p) => (
//                 <div key={p.paymentID} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl mb-4 overflow-hidden">
//                   <div className="p-6">
//                     <div className="grid grid-cols-1 md:grid-cols-8 gap-4 items-center">
//                       <div className="md:col-span-3">
//                         <div className="text-sm text-gray-500">Student</div>
//                         <div className="font-medium">{p.studentName}</div>
//                         <div className="text-xs text-gray-400">Enroll: {p.enrollmentID}</div>
//                       </div>

//                       <div className="md:col-span-3">
//                         <div className="text-sm text-gray-500">Parent</div>
//                         <div className="font-medium">{p.parentName}</div>
//                         <div className="text-xs text-gray-400">{p.parentContact}</div>
//                       </div>

//                       <div className="md:col-span-1 text-right">
//                         <div className="text-sm text-gray-500">Paid</div>
//                         <div className="font-semibold text-green-600">{formatCurrency(p.paidAmount)}</div>
//                         <div className="text-xs text-gray-400">of {formatCurrency(p.totalAmount)}</div>
//                       </div>

//                       <div className="md:col-span-1 text-right flex items-center justify-end gap-2">
//                         <div className={`px-2 py-1 rounded text-xs ${p.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{p.status}</div>
//                         <button onClick={() => toggle(p.paymentID)} className="px-3 py-1 bg-indigo-600 text-white rounded">{expanded[p.paymentID] ? 'Hide' : 'History'}</button>
//                       </div>
//                     </div>

//                     {expanded[p.paymentID] && (
//                       <div className="mt-4 border-t border-gray-100 dark:border-gray-700 pt-4">
//                         {(!p.history || p.history.length === 0) ? (
//                           <div className="text-sm text-gray-500">No history entries.</div>
//                         ) : (
//                           <div className="space-y-2">
//                             {p.history.map((h) => (
//                               <div key={h.paymentHistoryID} className="flex justify-between items-start bg-gray-50 dark:bg-gray-900 p-3 rounded">
//                                 <div>
//                                   <div className="text-sm font-medium">{formatDate(h.paymentDate)}</div>
//                                   <div className="text-xs text-gray-400">{h.paymentMethod} • Ref: {h.referenceNo}</div>
//                                   {h.remarks && <div className="text-xs text-gray-500 mt-1">{h.remarks}</div>}
//                                 </div>
//                                 <div className="text-right">
//                                   <div className="font-semibold text-green-600">{formatCurrency(h.amountPaid)}</div>
//                                   <div className="text-xs text-gray-400">By: {h.createdBy}</div>
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         )}
//                         <div className="mt-3 text-sm text-gray-600 text-right">Total Paid: <strong className="text-green-700">{formatCurrency(p.paidAmount)}</strong> • Balance: <strong className={` ${p.balanceAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>{formatCurrency(p.balanceAmount)}</strong></div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

const TeacherPaymentHistory = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("active");
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalReceived: 0,
    pendingBalance: 0,
    completionRate: 0
  });

  const teacherId = user?.UserID || user?.userID || user?.id || 2;

  // Modal states for Add Installment (teacher side)
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teacherId]);

  const isStudentActive = (item) => {
    if (!item) return true;
    const s = item.student || item.enrollment?.student;
    if (s) {
      if (s.isActive !== undefined && s.isActive !== null) return Boolean(s.isActive);
      if (s.IsActive !== undefined && s.IsActive !== null) return Boolean(s.IsActive);
      if (s.active !== undefined && s.active !== null) return Boolean(s.active);
      if (s.Active !== undefined && s.Active !== null) return Boolean(s.Active);
      if (s.status !== undefined && s.status !== null) {
        const st = String(s.status).toLowerCase();
        if (st === "active" || st === "true" || st === "1") return true;
        if (st === "inactive" || st === "false" || st === "0" || st === "deactive" || st === "disabled") return false;
      }
    }

    if (item.studentIsActive !== undefined && item.studentIsActive !== null) return Boolean(item.studentIsActive);
    if (item.isStudentActive !== undefined && item.isStudentActive !== null) return Boolean(item.isStudentActive);
    if (item.studentActive !== undefined && item.studentActive !== null) return Boolean(item.studentActive);

    if (item.isActive !== undefined && item.isActive !== null) return Boolean(item.isActive);
    if (item.IsActive !== undefined && item.IsActive !== null) return Boolean(item.IsActive);
    if (item.active !== undefined && item.active !== null) return Boolean(item.active);

    const e = item.enrollment;
    if (e) {
      if (e.isActive !== undefined && e.isActive !== null) return Boolean(e.isActive);
      if (e.IsActive !== undefined && e.IsActive !== null) return Boolean(e.IsActive);
    }

    return true;
  };

  const activeRecords = (payments || []).filter(isStudentActive);
  const inactiveRecords = (payments || []).filter((p) => !isStudentActive(p));
  const currentTabRecords = activeTab === "active" ? activeRecords : inactiveRecords;

  useEffect(() => {
    const list = currentTabRecords || [];
    const totalReceived = list.reduce((s, x) => s + (Number(x.paidAmount) || 0), 0);
    const pendingBalance = list.reduce((s, x) => s + (Number(x.balanceAmount) || 0), 0);
    const totalExpected = list.reduce((s, x) => s + (Number(x.totalAmount) || 0), 0);
    const completionRate = totalExpected > 0 ? (totalReceived / totalExpected) * 100 : 0;
    
    setStats({
      totalStudents: list.length,
      totalReceived,
      pendingBalance,
      completionRate: Math.round(completionRate)
    });
  }, [payments, activeTab]);

  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    try {
const url = `http://localhost:50447/api/Payments/teacher/${teacherId}`;
// const url = `https://testtuitionbackend.dockyardsoftware.com/api/Payments/teacher/${teacherId}`;
      const rawToken = window.localStorage.getItem("token") || window.sessionStorage.getItem("token");
      const headers = {};
      if (rawToken) {
        const token = String(rawToken).replace(/^"|"$/g, "").replace(/^'|'$/g, "");
        headers["Authorization"] = `Bearer ${token}`;
      }
      const resp = await axios.get(url, { headers });
      setPayments(Array.isArray(resp.data) ? resp.data : []);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data || err?.message || "Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  const toggle = (id) => setExpanded((s) => ({ ...s, [id]: !s[id] }));

  const formatCurrency = (n) => `Rs. ${Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const formatDate = (d) => (d ? new Date(d).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) : "-");

  const getStatusIcon = (status) => {
    switch(status) {
      case 'PAID': return (
        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
      case 'PARTIAL': return (
        <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      );
      default: return (
        <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      );
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'PAID': return 'bg-green-50 text-green-700 border-green-200';
      case 'PARTIAL': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getCourseName = (p) => {
    if (!p) return "—";
    if (typeof p.courseName === "string" && p.courseName.trim()) return p.courseName.trim();
    if (typeof p.CourseName === "string" && p.CourseName.trim()) return p.CourseName.trim();
    if (typeof p.course_Name === "string" && p.course_Name.trim()) return p.course_Name.trim();
    if (typeof p.courseTitle === "string" && p.courseTitle.trim()) return p.courseTitle.trim();
    if (typeof p.CourseTitle === "string" && p.CourseTitle.trim()) return p.CourseTitle.trim();
    if (typeof p.course === "string" && p.course.trim()) return p.course.trim();

    const c = p.course || p.Course || p.enrollment?.course || p.enrollment?.Course;
    if (c && typeof c === "object") {
      const name = c.courseName || c.CourseName || c.name || c.Name || c.title || c.Title || c.course_Name;
      if (name) return String(name).trim();
    }

    const ecName = p.enrollment?.courseName || p.enrollment?.CourseName || p.enrollment?.course_Name || p.enrollment?.courseTitle || p.enrollment?.CourseTitle;
    if (ecName) return String(ecName).trim();

    return "—";
  };

  const getSubjectName = (p) => {
    if (!p) return "—";
    if (typeof p.subjectName === "string" && p.subjectName.trim()) return p.subjectName.trim();
    if (typeof p.SubjectName === "string" && p.SubjectName.trim()) return p.SubjectName.trim();
    if (typeof p.subject_Name === "string" && p.subject_Name.trim()) return p.subject_Name.trim();
    if (typeof p.subjectTitle === "string" && p.subjectTitle.trim()) return p.subjectTitle.trim();
    if (typeof p.SubjectTitle === "string" && p.SubjectTitle.trim()) return p.SubjectTitle.trim();
    if (typeof p.subject === "string" && p.subject.trim()) return p.subject.trim();
    if (typeof p.className === "string" && p.className.trim()) return p.className.trim();
    if (typeof p.ClassName === "string" && p.ClassName.trim()) return p.ClassName.trim();
    if (typeof p.class === "string" && p.class.trim()) return p.class.trim();
    if (typeof p.Class === "string" && p.Class.trim()) return p.Class.trim();

    const s = p.subject || p.Subject || p.enrollment?.subject || p.enrollment?.Subject;
    if (s && typeof s === "object") {
      const name = s.subjectName || s.SubjectName || s.name || s.Name || s.title || s.Title || s.subject_Name;
      if (name) return String(name).trim();
    }

    const esName = p.enrollment?.subjectName || p.enrollment?.SubjectName || p.enrollment?.subject_Name || p.enrollment?.className || p.enrollment?.ClassName || p.enrollment?.subjectTitle || p.enrollment?.SubjectTitle;
    if (esName) return String(esName).trim();

    return "—";
  };

  const filtered = currentTabRecords.filter((p) => {
    const q = (search || "").toString().toLowerCase();
    if (!q) return true;
    const course = getCourseName(p).toLowerCase();
    const subject = getSubjectName(p).toLowerCase();
    return (
      String(p.studentName || "").toLowerCase().includes(q) ||
      String(p.parentName || "").toLowerCase().includes(q) ||
      String(p.enrollmentID || "").includes(q) ||
      String(p.paymentID || "").includes(q) ||
      course.includes(q) ||
      subject.includes(q)
    );
  });

  // Add Installment modal component (copied/adapted from admin PaymentHistory)
  const AddInstallmentModal = ({ isOpen, onClose, payment, onSuccess }) => {
    const [formData, setFormData] = useState({
      PaymentID: "",
      AmountPaid: "",
      PaymentMethod: "Cash",
      ReferenceNo: "",
      Remarks: "",
      CreatedBy: "",
    });
    const [loadingModal, setLoadingModal] = useState(false);
    const [modalError, setModalError] = useState(null);

    useEffect(() => {
      if (payment && isOpen) {
        const userId = window.localStorage.getItem("userId") || window.sessionStorage.getItem("userId") || "101";
        const genRef = `REF-${payment.enrollmentID || payment.paymentID}-${Math.floor(Math.random() * 900000 + 100000)}`;
        setFormData({
          PaymentID: payment.paymentID || "",
          AmountPaid: "",
          PaymentMethod: "Cash",
          ReferenceNo: genRef,
          Remarks: "",
          CreatedBy: userId,
        });

        const isPaidStatus = String(payment.status || "").toUpperCase() === "PAID";
        const bal = Number(payment.balanceAmount || 0);
        if (isPaidStatus || bal <= 0) {
          setModalError("Student already fully paid — no installment can be added.");
        } else {
          setModalError(null);
        }
      }
    }, [payment, isOpen]);

    const formatAmountForDisplay = (val) => {
      if (val === null || val === undefined) return "";
      let s = String(val).replace(/,/g, '').replace(/[^\d.]/g, '');
      if (s === "") return "";
      // allow only one decimal point
      const parts = s.split('.');
      const intPartRaw = parts[0] || '0';
      const decPartRaw = parts[1] || '';
      const intPartClean = intPartRaw.replace(/^0+(?=\d)/, '') || '0';
      const intPartNum = Number(intPartClean) || 0;
      const intPart = intPartNum.toLocaleString('en-US');
      const decPart = decPartRaw.slice(0, 2);
      return decPart ? `${intPart}.${decPart}` : intPart;
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      if (name === 'AmountPaid') {
        // format value for display but keep only numeric & one decimal internally
        const cleaned = String(value).replace(/,/g, '').replace(/[^\d.]/g, '');
        const parts = cleaned.split('.').slice(0, 2);
        const normalized = parts.length === 2 ? `${parts[0]}.${parts[1].slice(0,2)}` : parts[0];
        const display = formatAmountForDisplay(normalized);
        setFormData((p) => ({ ...p, AmountPaid: display }));
      } else {
        setFormData((p) => ({ ...p, [name]: value }));
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoadingModal(true);
      setModalError(null);

      try {
        const token = window.localStorage.getItem("token") || window.sessionStorage.getItem("token");
        const headers = { "Authorization": `Bearer ${token?.replace(/^\"|\"$/g, "")}`, "Content-Type": "application/json" };

        const payload = {
          ...formData,
          AmountPaid: parseFloat(String(formData.AmountPaid).replace(/,/g, '')) || 0,
          PaymentID: parseInt(formData.PaymentID),
          CreatedBy: parseInt(formData.CreatedBy)
        };

        const isPaidStatus = String(payment?.status || "").toUpperCase() === "PAID";
        const balance = Number(payment?.balanceAmount || 0);
        if (isPaidStatus || balance <= 0) {
          setModalError("Student already fully paid — cannot add installment.");
          setLoadingModal(false);
          return;
        }

        if (!payload.AmountPaid || payload.AmountPaid <= 0) {
          setModalError("Please enter a valid amount greater than 0.");
          setLoadingModal(false);
          return;
        }
        if (payload.AmountPaid > balance) {
          setModalError("Amount exceeds remaining balance.");
          setLoadingModal(false);
          return;
        }

     const response = await axios.post("http://localhost:50447/api/Payments/AddInstallment", payload, { headers });
    //  const response = await axios.post("https://testtuitionbackend.dockyardsoftware.com/api/Payments/AddInstallment", payload, { headers });
        if (response.status === 200 || response.status === 201) {
          onSuccess && onSuccess();
          onClose && onClose();
        } else {
          throw new Error("Failed to add installment");
        }
      } catch (err) {
        console.error(err);
        setModalError(err.response?.data?.message || err.message || "Failed to add installment");
      } finally {
        setLoadingModal(false);
      }
    };

    if (!isOpen) return null;

    const balance = Number(payment?.balanceAmount || 0);
    const isFullyPaid = String(payment?.status || "").toUpperCase() === "PAID" || balance <= 0;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Add Installment</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1">✕</button>
            </div>

            {modalError && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-xs sm:text-sm text-red-600 dark:text-red-400">{modalError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payment ID</label>
                  <input type="text" value={formData.PaymentID} disabled className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white" />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount Paid (LKR)</label>
                  <input type="text" inputMode="decimal" name="AmountPaid" value={formData.AmountPaid} onChange={handleChange} required placeholder="Enter amount" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payment Method</label>
                  <select name="PaymentMethod" value={formData.PaymentMethod} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option>Cash</option>
                    <option>Credit Card</option>
                    <option>Debit Card</option>
                    <option>Bank Transfer</option>
                    <option>Cheque</option>
                    <option>Online Payment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reference Number</label>
                  <input type="text" name="ReferenceNo" value={formData.ReferenceNo} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Remarks</label>
                  <textarea name="Remarks" value={formData.Remarks} onChange={handleChange} rows="3" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>

                <div className="pt-3 sm:pt-4 flex space-x-3">
                  <button type="button" onClick={onClose} disabled={loadingModal} className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-xs sm:text-sm">Cancel</button>
                  <button type="submit" disabled={loadingModal || isFullyPaid} className="flex-1 px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50 text-xs sm:text-sm font-medium">
                    {loadingModal ? 'Processing...' : 'Add Installment'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <AddInstallmentModal
          isOpen={showModal}
          onClose={() => { setShowModal(false); setSelectedPayment(null); }}
          payment={selectedPayment}
          onSuccess={fetchPayments}
        />
        <div className="mb-4 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Payments</h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5 sm:mt-1">Track and manage student payments</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={fetchPayments}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-all duration-200 text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium shadow-sm hover:shadow"
              >
                <svg className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-3.5 sm:p-5 shadow-sm sm:shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Total Students</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mt-1 sm:mt-2">{stats.totalStudents}</p>
                </div>
                <div className="p-2 sm:p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <svg className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-5.197h-6m6 0V9a3 3 0 00-6 0v3m6 0v3m0 0h-6m6 0v3m0 0h-6" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-3.5 sm:p-5 shadow-sm sm:shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Total Received</p>
                  <p className="text-sm sm:text-xl md:text-2xl font-bold text-green-600 dark:text-green-400 mt-1 sm:mt-2 truncate">
                    {formatCurrency(stats.totalReceived)}
                  </p>
                </div>
                <div className="p-2 sm:p-3 bg-green-50 dark:bg-green-900/30 rounded-lg flex-shrink-0">
                  <svg className="w-4 h-4 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-3.5 sm:p-5 shadow-sm sm:shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Pending Balance</p>
                  <p className="text-sm sm:text-xl md:text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1 sm:mt-2 truncate">
                    {formatCurrency(stats.pendingBalance)}
                  </p>
                </div>
                <div className="p-2 sm:p-3 bg-amber-50 dark:bg-amber-900/30 rounded-lg flex-shrink-0">
                  <svg className="w-4 h-4 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-3.5 sm:p-5 shadow-sm sm:shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Completion Rate</p>
                  <p className="text-lg sm:text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1 sm:mt-2">
                    {stats.completionRate}%
                  </p>
                </div>
                <div className="relative flex-shrink-0">
                  <div className="p-2 sm:p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                    <svg className="w-4 h-4 sm:w-6 sm:h-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-[10px] sm:text-xs text-white">{stats.completionRate}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex overflow-x-auto scrollbar-none border-b border-gray-200 dark:border-gray-700 mb-4 sm:mb-6 bg-white dark:bg-gray-800 rounded-t-xl px-2 pt-2 shadow-sm">
          <button
            type="button"
            onClick={() => setActiveTab("active")}
            className={`flex-shrink-0 whitespace-nowrap pb-2.5 sm:pb-3 px-3 sm:px-4 text-xs sm:text-sm font-medium border-b-2 transition-all flex items-center space-x-1.5 sm:space-x-2 ${
              activeTab === "active"
                ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-semibold"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-green-500"></span>
            <span>Active Students</span>
            <span
              className={`ml-1 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs rounded-full ${
                activeTab === "active"
                  ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-bold"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
              }`}
            >
              {activeRecords.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("inactive")}
            className={`flex-shrink-0 whitespace-nowrap pb-2.5 sm:pb-3 px-3 sm:px-4 text-xs sm:text-sm font-medium border-b-2 transition-all flex items-center space-x-1.5 sm:space-x-2 ${
              activeTab === "inactive"
                ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-semibold"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red-400"></span>
            <span>Inactive Students</span>
            <span
              className={`ml-1 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs rounded-full ${
                activeTab === "inactive"
                  ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-bold"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
              }`}
            >
              {inactiveRecords.length}
            </span>
          </button>
        </div>

        <div className="mb-4 sm:mb-6">
          <div className="relative">
            <svg className="absolute left-3.5 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student, course, subject..."
              className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-indigo-600 mb-3 sm:mb-4"></div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Loading payment records...</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-3.5 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-xs sm:text-sm text-red-700 dark:text-red-300">{String(error)}</p>
            </div>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-8 sm:py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1.5 sm:mb-2">
              No {activeTab === "active" ? "active" : "inactive"} student payments found
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
              {search 
                ? "No payment records match your search criteria." 
                : `No payment records available for ${activeTab === "active" ? "active" : "inactive"} students at the moment.`}
            </p>
            {search && (
              <button 
                onClick={() => setSearch("")}
                className="text-xs sm:text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="space-y-3 sm:space-y-4">
            {filtered.map((p) => (
              <div 
                key={p.paymentID} 
                className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700"
              >
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="p-2.5 sm:p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg flex-shrink-0">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">{p.studentName}</h3>
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1">
                          <span className="text-xs sm:text-sm font-medium text-indigo-600 dark:text-indigo-400">Course: {getCourseName(p)}</span>
                          <span className="text-xs sm:text-sm text-gray-400">•</span>
                          <span className="text-xs sm:text-sm font-medium text-purple-600 dark:text-purple-400">Class: {getSubjectName(p)}</span>
                          <span className="text-xs sm:text-sm text-gray-400">•</span>
                          <span className="text-xs sm:text-sm font-medium text-emerald-600 dark:text-emerald-400">Enrollment ID: #{p.enrollmentID || "—"}</span>
                          <span className="text-xs sm:text-sm text-gray-400">•</span>
                          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">ID: #{p.paymentID}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 self-end sm:self-auto">
                      <span className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-medium border flex items-center gap-1 sm:gap-1.5 ${getStatusColor(p.status)}`}>
                        {getStatusIcon(p.status)}
                        {p.status}
                      </span>
                      <button
                        onClick={() => { setSelectedPayment(p); setShowModal(true); }}
                        className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-indigo-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-indigo-700 transition-colors"
                        title="Add Installment"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => toggle(p.paymentID)}
                        className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium transition-colors duration-200"
                      >
                        {expanded[p.paymentID] ? (
                          <>
                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                            <span>Hide</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                            <span>Details</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                    <div className="text-center min-w-0">
                      <p className="text-[11px] sm:text-sm text-gray-500 dark:text-gray-400">Total</p>
                      <p className="text-xs sm:text-base md:text-xl font-bold text-gray-900 dark:text-white mt-0.5 sm:mt-1 truncate">
                        {formatCurrency(p.totalAmount)}
                      </p>
                    </div>
                    <div className="text-center min-w-0 border-x border-gray-200 dark:border-gray-700 px-1 sm:px-2">
                      <p className="text-[11px] sm:text-sm text-gray-500 dark:text-gray-400">Paid</p>
                      <p className="text-xs sm:text-base md:text-xl font-bold text-green-600 dark:text-green-400 mt-0.5 sm:mt-1 truncate">
                        {formatCurrency(p.paidAmount)}
                      </p>
                    </div>
                    <div className="text-center min-w-0">
                      <p className="text-[11px] sm:text-sm text-gray-500 dark:text-gray-400">Balance</p>
                      <p className={`text-xs sm:text-base md:text-xl font-bold ${p.balanceAmount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-green-600 dark:text-green-400'} mt-0.5 sm:mt-1 truncate`}>
                        {formatCurrency(p.balanceAmount)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 bg-gray-50 dark:bg-gray-900/30 rounded-lg mb-3 sm:mb-4">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-5.197h-6m6 0V9a3 3 0 00-6 0v3m6 0v3m0 0h-6m6 0v3m0 0h-6" />
                      </svg>
                      <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">{p.parentName}</p>
                    </div>
                    <div className="flex items-center gap-1.5 pl-6 sm:pl-0">
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{p.parentContact}</p>
                    </div>
                  </div>

                  {expanded[p.paymentID] && (
                    <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700" style={{animation: 'fadeIn 0.3s ease-out'}}>
                      <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Payment History
                      </h4>
                      
                      {(!p.history || p.history.length === 0) ? (
                        <div className="text-center py-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          No payment history available
                        </div>
                      ) : (
                        <div className="space-y-2.5 sm:space-y-3">
                          {p.history.map((h, index) => (
                            <div 
                              key={h.paymentHistoryID} 
                              className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 sm:gap-3 mb-1.5">
                                    <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-medium text-[10px] sm:text-xs flex-shrink-0">
                                      {index + 1}
                                    </div>
                                    <div className="font-medium text-xs sm:text-sm text-gray-900 dark:text-white truncate">
                                      {formatDate(h.paymentDate)}
                                    </div>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 text-xs text-gray-600 dark:text-gray-400">
                                    <div className="flex items-center gap-1">
                                      <span>{h.paymentMethod}</span>
                                    </div>
                                    <span>•</span>
                                    <span>Ref: {h.referenceNo}</span>
                                    <span>•</span>
                                    <span>By: User #{h.createdBy}</span>
                                  </div>
                                  {h.remarks && (
                                    <p className="mt-1.5 text-xs sm:text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 p-2 rounded">
                                      {h.remarks}
                                    </p>
                                  )}
                                </div>
                                <div className="text-left sm:text-right flex sm:block items-center justify-between pt-1 sm:pt-0 border-t sm:border-t-0 border-gray-200 dark:border-gray-700">
                                  <p className="text-sm sm:text-lg font-bold text-green-600 dark:text-green-400">
                                    {formatCurrency(h.amountPaid)}
                                  </p>
                                  <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                                    Paid on {new Date(h.paymentDate).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="mt-4 sm:mt-6 p-3.5 sm:p-4 bg-gradient-to-r from-gray-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-900/20 rounded-xl">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Payment Progress</p>
                            <div className="w-full sm:w-48 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-1.5">
                              <div 
                                className="h-full bg-green-500 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(100, Math.max(0, (p.paidAmount / (p.totalAmount || 1)) * 100))}%` }}
                              ></div>
                            </div>
                            <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {Math.round((p.paidAmount / (p.totalAmount || 1)) * 100)}% Complete
                            </p>
                          </div>
                          <div className="text-left sm:text-right">
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total Summary</p>
                            <div className="flex items-center gap-3 sm:gap-4 mt-1">
                              <div>
                                <p className="text-sm sm:text-lg font-bold text-green-600 dark:text-green-400">
                                  {formatCurrency(p.paidAmount)}
                                </p>
                                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Paid</p>
                              </div>
                              <div>
                                <p className={`text-sm sm:text-lg font-bold ${p.balanceAmount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-green-600 dark:text-green-400'}`}>
                                  {formatCurrency(p.balanceAmount)}
                                </p>
                                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Balance</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <style jsx="true">{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default TeacherPaymentHistory;