
// // export default Payment;
// import { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import axios from "axios";
// import { getCourseDetails } from "../../services/courseService";
// import { useAuth } from "../../contexts/AuthContext";

// const Payment = () => {
//   const { user } = useAuth();
//   const location = useLocation();
//   // Initialize from storage synchronously so inputs show values on first render
//   const readFromStorage = (key) => {
//     try {
//       return window.localStorage.getItem(key) || window.sessionStorage.getItem(key) || "";
//     } catch (e) {
//       return "";
//     }
//   };

//   const getInitialEnrollment = () => {
//     try {
//       const params = new URLSearchParams(location.search || "");
//       const enrollmentParam = params.get("enrollment");
//       return enrollmentParam || readFromStorage("lastEnrollmentID") || "";
//     } catch (e) {
//       return readFromStorage("lastEnrollmentID") || "";
//     }
//   };

//   const [enrollmentId, setEnrollmentId] = useState(() => String(getInitialEnrollment()));
//   const [totalAmount, setTotalAmount] = useState(() => {
//     const v = readFromStorage("selectedTotalFee");
//     return v !== null && v !== undefined ? String(v) : "";
//   });
//   const [firstPaid, setFirstPaid] = useState(() => {
//     const v = readFromStorage("selectedMonthlyFee");
//     return v !== null && v !== undefined ? String(v) : "";
//   });
//   const [paymentMethod, setPaymentMethod] = useState("Cash");
//   const [referenceNo, setReferenceNo] = useState("");
//   const [remarks, setRemarks] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState(null);
//   const [error, setError] = useState(null);

//   // Load enrollment ID from query param or localStorage
//   useEffect(() => {
//     try {
//       const params = new URLSearchParams(location.search || "");
//       const enrollmentParam = params.get("enrollment");
//       const storedEnrollmentId = window.localStorage.getItem("lastEnrollmentID");
      
//       const enrollmentValue = enrollmentParam || storedEnrollmentId;
//       if (enrollmentValue) {
//         console.log('Setting enrollment ID:', enrollmentValue);
//         setEnrollmentId(String(enrollmentValue));
//       }
//     } catch (e) {
//       console.error('Error loading enrollment ID:', e);
//     }
//   }, [location.search]);

//   // Load fees from localStorage/sessionStorage
//   useEffect(() => {
//     try {
//       console.log('Loading fees from storage...');
      
//       // Try localStorage first, then sessionStorage
//       const totalLS = window.localStorage.getItem("selectedTotalFee");
//       const monthlyLS = window.localStorage.getItem("selectedMonthlyFee");
//       const totalSS = window.sessionStorage.getItem("selectedTotalFee");
//       const monthlySS = window.sessionStorage.getItem("selectedMonthlyFee");
      
//       const total = totalLS || totalSS;
//       const monthly = monthlyLS || monthlySS;

//       console.log('Fees from storage:', { total, monthly });

//       if (total !== null && total !== undefined && total !== "") {
//         const n = Number(total);
//         const value = !Number.isNaN(n) ? String(n) : String(total);
//         console.log('Setting total amount:', value);
//         setTotalAmount(value);
//       }
      
//       if (monthly !== null && monthly !== undefined && monthly !== "") {
//         const m = Number(monthly);
//         const value = !Number.isNaN(m) ? String(m) : String(monthly);
//         console.log('Setting first paid amount:', value);
//         setFirstPaid(value);
//       }
//     } catch (e) {
//       console.error('Error loading fees from storage:', e);
//     }
//   }, []);

//   // Load fees from API if provided via query params
//   useEffect(() => {
//     (async () => {
//       try {
//         const params = new URLSearchParams(location.search || "");
//         const courseParam = params.get("course") || params.get("courseId") || params.get("courseid");
//         const subjectParam = params.get("subject") || params.get("subjectId") || params.get("subjectid");
        
//         if (!courseParam) {
//           console.log('No course parameter, skipping API fetch');
//           return;
//         }

//         console.log('Fetching course details for course:', courseParam, 'subject:', subjectParam);
        
//         const details = await getCourseDetails(courseParam);
//         console.log('Course details received:', details);
        
//         const subjectList = details?.subjects ?? details?.Subjects ?? [];
//         let found = null;
        
//         if (Array.isArray(subjectList) && subjectList.length) {
//           if (subjectParam) {
//             found = subjectList.find(
//               (s) => String(s?.subjectID ?? s?.SubjectID ?? s?.id ?? s?.subjectId) === String(subjectParam)
//             );
//             console.log('Found matching subject:', found);
//           }
//           if (!found) {
//             found = subjectList[0];
//             console.log('Using first subject as fallback:', found);
//           }
//         }

//         if (found) {
//           const total = found.totalFee ?? found.TotalFee ?? found.total ?? null;
//           const monthly = found.monthlyFee ?? found.MonthlyFee ?? found.monthly ?? null;
          
//           console.log('Extracted fees from API:', { total, monthly });
          
//           if (total !== null && total !== undefined) {
//             const n = Number(total);
//             const value = !Number.isNaN(n) ? String(n) : String(total);
//             console.log('Setting total amount from API:', value);
//             setTotalAmount(value);
//           }
          
//           if (monthly !== null && monthly !== undefined) {
//             const m = Number(monthly);
//             const value = !Number.isNaN(m) ? String(m) : String(monthly);
//             console.log('Setting first paid amount from API:', value);
//             setFirstPaid(value);
//           }
//         }
//       } catch (err) {
//         console.error("Failed to fetch course details for query-prefill", err);
//       }
//     })();
//   }, [location.search]);

//   // Fallback: Load fees from API using stored course/subject IDs if values are empty
//   useEffect(() => {
//     (async () => {
//       try {
//         // Only fetch if we don't have values yet
//         if (totalAmount || firstPaid) {
//           console.log('Already have fee values, skipping fallback fetch');
//           return;
//         }

//         const courseId = window.localStorage.getItem("selectedCourseID") || 
//                         window.sessionStorage.getItem("selectedCourseID");
//         const subjectId = window.localStorage.getItem("selectedSubjectID") || 
//                          window.sessionStorage.getItem("selectedSubjectID");
        
//         if (!courseId) {
//           console.log('No stored course ID, skipping fallback fetch');
//           return;
//         }

//         console.log('Fallback fetch for course:', courseId, 'subject:', subjectId);

//         const details = await getCourseDetails(courseId);
//         console.log('Fallback course details:', details);
        
//         const subjectList = details?.subjects ?? details?.Subjects ?? [];
//         let found = null;
        
//         if (Array.isArray(subjectList) && subjectList.length) {
//           if (subjectId) {
//             found = subjectList.find(
//               s => String(s?.subjectID ?? s?.SubjectID ?? s?.id ?? s?.subjectId) === String(subjectId)
//             );
//           }
//           if (!found) found = subjectList[0];
//         }
        
//         if (found) {
//           const total = found.totalFee ?? found.TotalFee ?? found.total ?? null;
//           const monthly = found.monthlyFee ?? found.MonthlyFee ?? found.monthly ?? null;
          
//           console.log('Fallback extracted fees:', { total, monthly });
          
//           if (total !== null && total !== undefined) {
//             const n = Number(total);
//             const value = !Number.isNaN(n) ? String(n) : String(total);
//             console.log('Setting total from fallback:', value);
//             setTotalAmount(value);
//           }
          
//           if (monthly !== null && monthly !== undefined) {
//             const m = Number(monthly);
//             const value = !Number.isNaN(m) ? String(m) : String(monthly);
//             console.log('Setting monthly from fallback:', value);
//             setFirstPaid(value);
//           }
//         }
//       } catch (err) {
//         console.error('Failed to load course details for payment prefill', err);
//       }
//     })();
//   }, [totalAmount, firstPaid]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setResult(null);
    
//     const createdBy = user?.UserID ?? user?.id ?? user?.userID ?? user?.userId ?? null;
    
//     if (!enrollmentId) {
//       setError("Missing enrollment id");
//       return;
//     }

//     const body = {
//       EnrollmentID: Number.isNaN(Number(enrollmentId))
//         ? enrollmentId
//         : Number(enrollmentId),
//       TotalAmount: Number(totalAmount) || 0,
//       FirstPaidAmount: Number(firstPaid) || 0,
//       PaymentMethod: paymentMethod || "",
//       ReferenceNo: referenceNo || null,
//       Remarks: remarks || null,
//       CreatedBy: createdBy,
//     };

//     console.log('Submitting payment:', body);

//     setLoading(true);
//     try {
//       // Prefer explicit API URL for Payments endpoint
//       const apiUrl = "http://localhost:50447/api/Payments";
//       const headers = {};
//       try {
//         const rawToken = window.localStorage.getItem("token") || window.sessionStorage.getItem("token");
//         if (rawToken) {
//           // strip surrounding quotes if present
//           const token = String(rawToken).replace(/^\"|\"$/g, "").replace(/^\'|\'$/g, "");
//           headers["Authorization"] = `Bearer ${token}`;
//         }
//       } catch (e) {
//         // ignore token read errors
//       }

//       const resp = await axios.post(apiUrl, body, { headers });
//       setResult(resp.data);
//       console.log("Payment created successfully:", resp.data);
      
//       // Clear stored values after successful payment
//       try {
//         window.localStorage.removeItem('selectedTotalFee');
//         window.localStorage.removeItem('selectedMonthlyFee');
//         window.localStorage.removeItem('selectedCourseID');
//         window.localStorage.removeItem('selectedSubjectID');
//         window.localStorage.removeItem('lastEnrollmentID');
//         window.sessionStorage.removeItem('selectedTotalFee');
//         window.sessionStorage.removeItem('selectedMonthlyFee');
//         window.sessionStorage.removeItem('selectedCourseID');
//         window.sessionStorage.removeItem('selectedSubjectID');
//         window.sessionStorage.removeItem('lastEnrollmentID');
//       } catch (e) {
//         // ignore cleanup errors
//       }
//     } catch (err) {
//       console.error("Payment create failed", err);
//       setError(err?.response?.data || err?.message || "Failed to create");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-6 p-6">
//       <h1 className="text-xl font-semibold">Payments</h1>
      
//       {/* Debug info removed for cleaner UI */}
      
//       <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
//         <div>
//           <label className="block text-sm font-medium">Enrollment ID</label>
//           <input
//             className="input mt-1 px-3 py-2"
//             value={enrollmentId}
//             readOnly
//             onChange={(e) => setEnrollmentId(e.target.value)}
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium">Total Amount</label>
//           <input
//             type="number"
//             step="0.01"
//             className="input mt-1 px-3 py-2"
//             value={totalAmount}
//             onChange={(e) => setTotalAmount(e.target.value)}
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium">First Paid Amount (Monthly Fee)</label>
//           <input
//             type="number"
//             step="0.01"
//             className="input mt-1 px-3 py-2"
//             value={firstPaid}
//             onChange={(e) => setFirstPaid(e.target.value)}
//           />
//         </div>

//         {/* <div>
//           <label className="block text-sm font-medium">Payment Method</label>
//           <select
//             className="mt-1 block w-full rounded border px-3 py-2"
//             value={paymentMethod}
//             onChange={(e) => setPaymentMethod(e.target.value)}
//           >
//             <option>Cash</option>
//             <option>Credit Card</option>
//             <option>Bank Transfer</option>
//           </select>
//         </div> */}

//         <div>
//           <label className="block text-sm font-medium">Reference No</label>
//           <input
//             className="input mt-1 px-3 py-2"
//             value={referenceNo}
//             onChange={(e) => setReferenceNo(e.target.value)}
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium">Remarks</label>
//           <textarea
//             className="input mt-1 px-3 py-2"
//             rows="3"
//             value={remarks}
//             onChange={(e) => setRemarks(e.target.value)}
//           />
//         </div>

//         <div className="flex items-center gap-3">
//           <button
//             type="submit"
//             className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-400"
//             disabled={loading}
//           >
//             {loading ? "Saving..." : "Save Payment"}
//           </button>
//         </div>
//       </form>

//       {error && (
//         <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-4 rounded">
//           <pre className="whitespace-pre-wrap">{String(error)}</pre>
//         </div>
//       )}

//       {result && (
//         <div className="rounded border p-4 bg-green-50 dark:bg-green-900/20">
//           <h3 className="font-medium text-green-800 dark:text-green-200">Payment created successfully!</h3>
//           <pre className="mt-2 text-xs whitespace-pre-wrap text-green-700 dark:text-green-300">
//             {JSON.stringify(result, null, 2)}
//           </pre>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Payment;
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  CreditCard, 
  ArrowLeft, 
  RefreshCw, 
  CheckCircle2, 
  History, 
  DollarSign
} from "lucide-react";
import { getCourseDetails } from "../../services/courseService";
import { useAuth } from "../../contexts/AuthContext";
import CustomSelect from "../../components/common/CustomSelect";

const PAYMENT_METHOD_OPTIONS = [
  { value: "Cash", label: "Cash" },
  { value: "Credit Card", label: "Credit Card" },
  { value: "Debit Card", label: "Debit Card" },
  { value: "Bank Transfer", label: "Bank Transfer" },
  { value: "Cheque", label: "Cheque" },
  { value: "Online Payment", label: "Online Payment" },
];

const Payment = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // synchronous storage read to avoid effect race
  const readFromStorageSync = (key) => {
    try {
      const v = window.localStorage.getItem(key) ?? window.sessionStorage.getItem(key);
      if (v === null || v === undefined) return null;
      const s = String(v).trim();
      if (!s || s.toLowerCase() === "undefined" || s.toLowerCase() === "null") return null;
      return s;
    } catch (e) {
      return null;
    }
  };

  const formatNumberSync = (raw) => {
    try {
      const n = Number(String(raw).replace(/,/g, ""));
      if (Number.isNaN(n)) return String(raw ?? "");
      const parts = Number(n).toFixed(2).split(".");
      const intFormatted = String(parts[0]).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parts[1] && parts[1] !== "00" ? `${intFormatted}.${parts[1]}` : intFormatted;
    } catch (e) {
      return String(raw ?? "");
    }
  };

  const [enrollmentId, setEnrollmentId] = useState(() => {
    try {
      const params = new URLSearchParams(location.search);
      const enrollmentParam = params.get("enrollment");
      return enrollmentParam || readFromStorageSync("lastEnrollmentID") || "";
    } catch (e) {
      return readFromStorageSync("lastEnrollmentID") || "";
    }
  });

  const [totalAmount, setTotalAmount] = useState(() => {
    const v = readFromStorageSync("selectedTotalFee");
    if (v === null) return "";
    return formatNumberSync(v);
  });

  const [firstPaid, setFirstPaid] = useState(() => {
    const v = readFromStorageSync("selectedMonthlyFee");
    if (v === null) return "";
    return formatNumberSync(v);
  });
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [referenceNo, setReferenceNo] = useState("");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [storedLoggedUser, setStoredLoggedUser] = useState(null);

  // helpers: format with commas and parse formatted numbers
  const formatWithCommas = (value) => {
    if (value === null || value === undefined) return "";
    const s = String(value).trim();
    if (s === "") return "";
    const raw = s.replace(/,/g, "");
    const parts = raw.split(".");
    const intPart = parts[0].replace(/[^0-9]/g, "") || "0";
    const fracPart = parts[1] ? parts[1].replace(/[^0-9]/g, "").slice(0, 2) : "";
    const intFormatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return fracPart ? `${intFormatted}.${fracPart}` : intFormatted;
  };

  const parseNumber = (formatted) => {
    if (formatted === null || formatted === undefined) return NaN;
    const raw = String(formatted).replace(/,/g, "").trim();
    if (raw === "") return NaN;
    return Number(raw);
  };

  // Initialize state from storage/query params
  useEffect(() => {
    const readFromStorage = (key) => {
      try {
        return window.localStorage.getItem(key) || window.sessionStorage.getItem(key) || "";
      } catch (e) {
        return "";
      }
    };

    const params = new URLSearchParams(location.search);
    const enrollmentParam = params.get("enrollment");
    const storedEnrollment = readFromStorage("lastEnrollmentID");
    const initialEnrollment = enrollmentParam || storedEnrollment || "";
    setEnrollmentId(initialEnrollment);

    const total = readFromStorage("selectedTotalFee");
    const monthly = readFromStorage("selectedMonthlyFee");
    if (total) {
      const n = Number(String(total).replace(/,/g, ""));
      setTotalAmount(
        !Number.isNaN(n)
          ? formatWithCommas(n % 1 === 0 ? String(n) : n.toFixed(2))
          : String(total)
      );
    }
    if (monthly) {
      const m = Number(String(monthly).replace(/,/g, ""));
      setFirstPaid(
        !Number.isNaN(m)
          ? formatWithCommas(m % 1 === 0 ? String(m) : m.toFixed(2))
          : String(monthly)
      );
    }
  }, [location.search]);

  useEffect(() => {
    try {
      const raw =
        window.localStorage.getItem("loggedUser") ||
        window.localStorage.getItem("user") ||
        window.sessionStorage.getItem("loggedUser") ||
        window.sessionStorage.getItem("user");
      if (!raw) return;
      let parsed = null;
      try {
        parsed = JSON.parse(raw);
      } catch (e) {
        parsed = null;
      }
      if (
        parsed &&
        (parsed.id || parsed.UserID || parsed.userID || parsed.ID || parsed.id === 0)
      ) {
        setStoredLoggedUser(parsed);
      }
    } catch (e) {}
  }, []);

  const totalNumValue = parseNumber(totalAmount) || 0;
  const paidNumValue = parseNumber(firstPaid) || 0;
  const balanceAmount = Math.max(0, totalNumValue - paidNumValue);

  useEffect(() => {
    const loadCourseDetails = async () => {
      if (totalAmount && firstPaid) return;

      try {
        const params = new URLSearchParams(location.search);
        const courseParam = params.get("course") || params.get("courseId");

        if (!courseParam) {
          const storedCourse =
            window.localStorage.getItem("selectedCourseID") ||
            window.sessionStorage.getItem("selectedCourseID");
          if (!storedCourse) return;

          const details = await getCourseDetails(storedCourse);
          const subjectList = details?.subjects ?? details?.Subjects ?? [];
          if (subjectList.length) {
            const subject = subjectList[0];
            if (!totalAmount && subject.totalFee) {
              const n = Number(String(subject.totalFee).replace(/,/g, ""));
              setTotalAmount(
                !Number.isNaN(n)
                  ? formatWithCommas(n % 1 === 0 ? String(n) : n.toFixed(2))
                  : String(subject.totalFee)
              );
            }
            if (!firstPaid && subject.monthlyFee) {
              const m = Number(String(subject.monthlyFee).replace(/,/g, ""));
              setFirstPaid(
                !Number.isNaN(m)
                  ? formatWithCommas(m % 1 === 0 ? String(m) : m.toFixed(2))
                  : String(subject.monthlyFee)
              );
            }
          }
        }
      } catch (err) {
        console.error("Failed to load course details", err);
      }
    };

    loadCourseDetails();
  }, [location.search, totalAmount, firstPaid]);

  useEffect(() => {
    try {
      if (referenceNo && String(referenceNo).trim() !== "") return;
      const key = "paymentRefCounter";
      const current = Number(window.localStorage.getItem(key) || "0") || 0;
      const next = current + 1;
      window.localStorage.setItem(key, String(next));
      setReferenceNo(`Ref-${next}`);
    } catch (e) {}
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!enrollmentId.trim()) {
      setError("Enrollment ID is required");
      return;
    }

    const totalNum = parseNumber(totalAmount);
    const firstNum = parseNumber(firstPaid);
    if (Number.isNaN(totalNum) || totalNum <= 0) {
      setError("Total amount must be greater than 0");
      return;
    }
    if (Number.isNaN(firstNum) || firstNum <= 0) {
      setError("First payment amount must be greater than 0");
      return;
    }
    if (firstNum > totalNum) {
      setError("First payment cannot exceed total amount");
      return;
    }

    const createdByFromStored =
      storedLoggedUser &&
      (storedLoggedUser.UserID ??
        storedLoggedUser.userID ??
        storedLoggedUser.id ??
        storedLoggedUser.ID ??
        null);
    const body = {
      EnrollmentID: enrollmentId,
      TotalAmount: totalNum,
      FirstPaidAmount: firstNum,
      PaymentMethod: paymentMethod,
      ReferenceNo: referenceNo.trim() || null,
      Remarks: remarks.trim() || null,
      CreatedBy: createdByFromStored ?? user?.UserID ?? user?.id ?? null,
    };

    setLoading(true);
    try {
      const apiUrl = "https://testtuitionbackend.dockyardsoftware.com/api/Payments";
      const headers = {};

      const rawToken =
        window.localStorage.getItem("token") || window.sessionStorage.getItem("token");
      if (rawToken) {
        const token = String(rawToken).replace(/^"|"$/g, "").replace(/^'|'$/g, "");
        headers["Authorization"] = `Bearer ${token}`;
      }

      const resp = await axios.post(apiUrl, body, { headers });
      setResult(resp.data);

      [
        "selectedTotalFee",
        "selectedMonthlyFee",
        "selectedCourseID",
        "selectedSubjectID",
        "lastEnrollmentID",
      ].forEach((key) => {
        window.localStorage.removeItem(key);
        window.sessionStorage.removeItem(key);
      });

      try {
        const type = user && String(user.userType || "").toLowerCase();
        const target =
          type === "admin"
            ? "/admin/payment-history"
            : type === "teacher"
            ? "/teacher/payment-history"
            : "/admin/payment-history";
        navigate(target);
      } catch (navErr) {
        navigate("/admin/payment-history");
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setEnrollmentId("");
    setTotalAmount("");
    setFirstPaid("");
    setReferenceNo("");
    setRemarks("");
    setError(null);
    setResult(null);
  };

  return (
    <div className="w-full space-y-3 sm:space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-1">
        <div>
          <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            New Payment
          </h1>
          <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Process initial payment for student enrollment
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="self-start sm:self-auto px-2.5 sm:px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-1.5 font-medium shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        {/* Left Column - Payment Form */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-xs border border-gray-200/90 dark:border-gray-700 p-3 sm:p-4">
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5 text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              {/* Enrollment ID */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Enrollment ID *
                </label>
                <input
                  type="text"
                  value={enrollmentId}
                  readOnly
                  className="w-full px-2.5 py-1.5 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white font-medium"
                  placeholder="Enrollment ID"
                  required
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Payment Method
                </label>
                <CustomSelect
                  name="paymentMethod"
                  value={paymentMethod}
                  onChange={(val) => setPaymentMethod(val)}
                  options={PAYMENT_METHOD_OPTIONS}
                  placeholder="Select payment method"
                  searchable={false}
                />
              </div>
            </div>

            {/* Stored Student Preview */}
            {storedLoggedUser && (
              <div className="p-2 sm:p-2.5 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-700/80 grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-semibold block">
                    Student
                  </span>
                  <span className="text-xs font-medium text-gray-900 dark:text-white truncate block">
                    {storedLoggedUser.firstName
                      ? `${storedLoggedUser.firstName} ${storedLoggedUser.lastName || ""}`.trim()
                      : storedLoggedUser.username || storedLoggedUser.name || "—"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-semibold block">
                    Student ID
                  </span>
                  <span className="text-xs font-medium text-gray-900 dark:text-white truncate block">
                    #{storedLoggedUser.id ?? storedLoggedUser.UserID ?? storedLoggedUser.userID ?? "—"}
                  </span>
                </div>
              </div>
            )}

            {/* Fee Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-1">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Total Fee (LKR)
                </label>
                <input
                  type="text"
                  value={totalAmount}
                  readOnly
                  className="w-full px-2.5 py-1.5 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white font-bold"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  First Paid (LKR)
                </label>
                <input
                  type="text"
                  value={firstPaid}
                  readOnly
                  className="w-full px-2.5 py-1.5 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-green-600 dark:text-green-400 font-bold"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Balance (LKR)
                </label>
                <div
                  className={`w-full px-2.5 py-1.5 text-xs rounded-lg border font-bold flex items-center justify-between ${
                    balanceAmount > 0
                      ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300"
                      : "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300"
                  }`}
                >
                  <span>{formatWithCommas(balanceAmount.toFixed(2))}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold uppercase bg-white/70 dark:bg-gray-800">
                    {balanceAmount > 0 ? "Pending" : "Paid"}
                  </span>
                </div>
              </div>
            </div>

            {/* Reference No & Remarks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Reference Number (Optional)
                </label>
                <input
                  type="text"
                  value={referenceNo}
                  onChange={(e) => setReferenceNo(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-1 focus:ring-indigo-500"
                  placeholder="e.g. Ref-123"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Remarks (Optional)
                </label>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-1 focus:ring-indigo-500"
                  placeholder="Notes..."
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-xs text-red-600 dark:text-red-400 font-medium">
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-1.5 sm:py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Save Payment</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="py-1.5 sm:py-2 px-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-xs transition-colors"
              >
                Clear
              </button>
            </div>
          </form>
        </div>

        {/* Right Column - Summary & Quick Actions */}
        <div className="space-y-3">
          {/* Payment Summary Box */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xs border border-gray-200/90 dark:border-gray-700 p-3 sm:p-4 space-y-2.5">
            <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-green-500" />
              <span>Summary</span>
            </h3>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-gray-100 dark:border-gray-700/60">
                <span className="text-gray-500 dark:text-gray-400 text-[11px]">Total Fee</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  Rs. {formatWithCommas((parseNumber(totalAmount) || 0).toFixed(2))}
                </span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-gray-100 dark:border-gray-700/60">
                <span className="text-gray-500 dark:text-gray-400 text-[11px]">First Payment</span>
                <span className="font-bold text-green-600 dark:text-green-400">
                  Rs. {formatWithCommas((parseNumber(firstPaid) || 0).toFixed(2))}
                </span>
              </div>

              <div className="flex justify-between items-center pt-1">
                <span className="text-gray-500 dark:text-gray-400 text-[11px]">Balance</span>
                <span
                  className={`font-bold ${
                    balanceAmount > 0
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-green-600 dark:text-green-400"
                  }`}
                >
                  Rs. {formatWithCommas(balanceAmount.toFixed(2))}
                </span>
              </div>

              {/* Mini Progress */}
              <div className="pt-2">
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                    style={{
                      width: parseNumber(totalAmount) || 0
                        ? `${Math.min(
                            100,
                            ((parseNumber(firstPaid) || 0) /
                              (parseNumber(totalAmount) || 1)) *
                              100
                          )}%`
                        : "0%",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xs border border-gray-200/90 dark:border-gray-700 p-3 sm:p-4">
            <h4 className="text-xs font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-indigo-500" />
              <span>Quick Navigation</span>
            </h4>
            <button
              type="button"
              onClick={() => navigate("/teacher/payment-history")}
              className="w-full text-left p-2 rounded-lg bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-700 text-xs font-medium text-indigo-600 dark:text-indigo-400 transition-colors flex items-center justify-between"
            >
              <span>View Payment History</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;