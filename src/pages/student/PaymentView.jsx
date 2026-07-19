// import React, { useEffect, useState } from "react";
// import { useAuth } from "../../contexts/AuthContext";
// import Loader from "../../components/common/Loader";

// const formatDate = (iso) => {
//   try {
//     return new Date(iso).toLocaleString();
//   } catch (e) {
//     return iso;
//   }
// };

// const StatusBadge = ({ status }) => {
//   const base = "inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold";
//   if (status === "PAID") return <span className={`${base} bg-green-600 text-white`}>PAID</span>;
//   if (status === "PARTIAL") return <span className={`${base} bg-yellow-500 text-white`}>PARTIAL</span>;
//   return <span className={`${base} bg-red-600 text-white`}>{status}</span>;
// };

// const PaymentCard = ({ p, expanded, onToggle }) => {
//   return (
//     <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
//       <div className="p-4 flex items-start justify-between">
//         <div>
//           <div className="flex items-center gap-3">
//             <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">{p.studentName}</h3>
//             <StatusBadge status={p.status} />
//           </div>
//           <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
//             <div>Enrollment ID: <span className="font-semibold">{p.enrollmentID}</span></div>
//             <div>Teacher: <span className="font-semibold">{p.teacherName}</span></div>
//             <div>Parent: <span className="font-semibold">{p.parentName} ({p.parentContact})</span></div>
//           </div>
//         </div>

//         <div className="text-right">
//           <div className="text-sm text-gray-500 dark:text-gray-400">Total</div>
//           <div className="text-xl font-semibold text-gray-800 dark:text-gray-100">LKR { p.totalAmount?.toFixed(2)}</div>
//           <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">Paid / Balance</div>
//           <div className="text-sm mt-1">
//             <span className="font-semibold">LKR {p.paidAmount?.toFixed(2)}</span>
//             <span className="text-gray-400 mx-2">/</span>
//             <span className="font-semibold text-red-400">LKR {p.balanceAmount?.toFixed(2)}</span>
//           </div>
//           <div className="mt-3">
//             <button
//               onClick={() => onToggle(p.paymentID)}
//               className="px-3 py-1 rounded bg-indigo-600 text-white text-sm"
//             >
//               {expanded ? "Hide History" : "View History"}
//             </button>
//           </div>
//         </div>
//       </div>

//       {expanded && (
//         <div className="border-t border-gray-100 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900">
//           <div className="text-sm text-gray-600 dark:text-gray-300 mb-3">Payment History</div>
//           <div className="space-y-3">
//             {p.history && p.history.length ? (
//               p.history
//                 .slice()
//                 .sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate))
//                 .map((h) => (
//                   <div key={h.paymentHistoryID} className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
//                     <div className="flex justify-between">
//                       <div className="text-sm text-gray-700 dark:text-gray-200">{formatDate(h.paymentDate)}</div>
//                       <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">LKR {h.amountPaid?.toFixed(2)}</div>
//                     </div>
//                     <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
//                       <div>Method: {h.paymentMethod}</div>
//                       <div>Txn: {h.referenceNo}</div>
//                       <div>Remarks: {h.remarks}</div>
//                     </div>
//                   </div>
//                 ))
//             ) : (
//               <div className="text-sm text-gray-500">No payment history available.</div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const PaymentView = () => {
//   const { user } = useAuth();
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [expandedId, setExpandedId] = useState(null);

//   useEffect(() => {
//     const fetchPayments = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const studentId = (user && (user.id || user.userID || user.studentID)) || 10;
//         const url = `http://localhost:50447/api/Payments/student/${studentId}`;
//         const token = window.localStorage.getItem("token");
//         const res = await fetch(url, {
//           headers: token ? { Authorization: `Bearer ${token}` } : {},
//         });
//         if (!res.ok) throw new Error(`Failed to load (${res.status})`);
//         const json = await res.json();
//         setData(json);
//       } catch (e) {
//         setError(e.message || "Failed to fetch");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPayments();
//   }, [user]);

//   const toggle = (id) => {
//     setExpandedId((curr) => (curr === id ? null : id));
//   };

//   return (
//     <div className="p-6">
//       <div className="max-w-5xl mx-auto">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Payments</h2>
//           <p className="text-sm text-gray-500">View your course payments and history</p>
//         </div>

//         {loading && <Loader />}
//         {error && <div className="text-red-500">{error}</div>}

//         {!loading && !error && (
//           <div className="space-y-4">
//             {data && data.length ? (
//               data.map((p) => (
//                 <PaymentCard
//                   key={p.paymentID}
//                   p={p}
//                   expanded={expandedId === p.paymentID}
//                   onToggle={toggle}
//                 />
//               ))
//             ) : (
//               <div className="text-center py-10 text-gray-500">No payments found.</div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PaymentView;
import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Loader from "../../components/common/Loader";
import { 
  CreditCard, 
  DollarSign, 
  Calendar, 
  User, 
  Phone, 
  BookOpen,
  ChevronDown,
  ChevronUp,
  Download,
  Filter,
  RefreshCw,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Wallet
} from "lucide-react";

const formatDate = (iso) => {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return iso;
  }
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount || 0);
};

const StatusBadge = ({ status }) => {
  const config = {
    PAID: {
      icon: <CheckCircle className="w-3 h-3" />,
      bg: "bg-green-100 dark:bg-green-900/30",
      text: "text-green-800 dark:text-green-300",
      iconColor: "text-green-600"
    },
    PARTIAL: {
      icon: <Clock className="w-3 h-3" />,
      bg: "bg-amber-100 dark:bg-amber-900/30",
      text: "text-amber-800 dark:text-amber-300",
      iconColor: "text-amber-600"
    },
    UNPAID: {
      icon: <AlertCircle className="w-3 h-3" />,
      bg: "bg-red-100 dark:bg-red-900/30",
      text: "text-red-800 dark:text-red-300",
      iconColor: "text-red-600"
    }
  };

  const statusConfig = config[status] || config.UNPAID;

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.text}`}>
      {statusConfig.icon}
      <span className="capitalize">{status}</span>
    </span>
  );
};

const PaymentProgress = ({ paid, total }) => {
  const percentage = total > 0 ? (paid / total) * 100 : 0;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-300">Payment Progress</span>
        <span className="font-semibold">{percentage.toFixed(0)}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <div 
          className="bg-gradient-to-r from-green-500 to-emerald-500 h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${Math.min(100, percentage)}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>LKR {formatCurrency(paid)} paid</span>
        <span>LKR {formatCurrency(total)} total</span>
      </div>
    </div>
  );
};

const PaymentHistoryItem = ({ history }) => {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700 transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                {history.remarks || "Payment Received"}
              </div>
              <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(history.paymentDate)}
                </div>
                <div className="flex items-center gap-1">
                  <CreditCard className="w-3 h-3" />
                  {history.paymentMethod}
                </div>
                <div className="font-mono text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                  Ref: {history.referenceNo}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-green-600 dark:text-green-400">
            LKR {formatCurrency(history.amountPaid)}
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
  );
};

const PaymentCard = ({ payment, expanded, onToggle }) => {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700">
      {/* Card Header */}
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          {/* Left Column - Student & Course Info */}
          <div className="flex-1">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {payment.courseName || "Course Enrollment"}
                  </h3>
                  <StatusBadge status={payment.status} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <User className="w-4 h-4" />
                      <div>
                        <div className="text-sm text-gray-500">Student</div>
                        <div className="font-semibold">{payment.studentName}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <User className="w-4 h-4" />
                      <div>
                        <div className="text-sm text-gray-500">Teacher</div>
                        <div className="font-semibold">{payment.teacherName}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <User className="w-4 h-4" />
                      <div>
                        <div className="text-sm text-gray-500">Parent</div>
                        <div className="font-semibold">{payment.parentName}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <Phone className="w-4 h-4" />
                      <div>
                        <div className="text-sm text-gray-500">Contact</div>
                        <div className="font-semibold">{payment.parentContact}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="text-sm text-gray-500 mb-2">Enrollment ID</div>
                  <div className="font-mono px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg inline-block">
                    {payment.enrollmentID}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Payment Summary */}
          <div className="lg:w-96 space-y-4">
            <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-300">Course Total</span>
                <Wallet className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                LKR {formatCurrency(payment.totalAmount)}
              </div>
              
              <div className="space-y-3 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Paid Amount</span>
                  <span className="text-xl font-bold text-green-600 dark:text-green-400">
                    LKR {formatCurrency(payment.paidAmount)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Balance Due</span>
                  <span className="text-xl font-bold text-red-500 dark:text-red-400">
                    LKR {formatCurrency(payment.balanceAmount)}
                  </span>
                </div>
              </div>
              
              <PaymentProgress paid={payment.paidAmount} total={payment.totalAmount} />
            </div>
            
            <button
              onClick={() => onToggle(payment.paymentID)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-lg active:scale-95"
            >
              {expanded ? (
                <>
                  <ChevronUp className="w-5 h-5" />
                  Hide Payment History
                </>
              ) : (
                <>
                  <ChevronDown className="w-5 h-5" />
                  View Payment History
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Expanded History Section */}
      {expanded && (
        <div className="border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">Payment History</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {payment.history?.length || 0} transaction{payment.history?.length !== 1 ? 's' : ''} recorded
                </p>
              </div>
            </div>
            
            {/* <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button> */}
          </div>
          
          <div className="space-y-3">
            {payment.history && payment.history.length > 0 ? (
              payment.history
                .slice()
                .sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate))
                .map((history) => (
                  <PaymentHistoryItem key={history.paymentHistoryID} history={history} />
                ))
            ) : (
              <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h5 className="text-gray-700 dark:text-gray-300 font-medium">No Payment History</h5>
                <p className="text-gray-500 text-sm mt-1">No transactions recorded for this payment</p>
              </div>
            )}
          </div>
          
          {/* Summary Footer */}
          {payment.history && payment.history.length > 0 && (
            <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="font-semibold text-gray-900 dark:text-white">Total Paid Amount</span>
                </div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  LKR {formatCurrency(payment.paidAmount)}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const PaymentView = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [stats, setStats] = useState({ total: 0, paid: 0, balance: 0, count: 0 });

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      setError(null);
      try {
        const studentId = (user && (user.id || user.userID || user.studentID)) || 10;
const url = `http://localhost:50447/api/Payments/student/${studentId}`;
//  const url = `https://testtuitionbackend.dockyardsoftware.com/api/Payments/student/${studentId}`;
        
        const token = window.localStorage.getItem("token");
        const res = await fetch(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error(`Failed to load payments (${res.status})`);
        const json = await res.json();
        setData(json);
        
        // Calculate statistics
        const stats = json.reduce((acc, payment) => ({
          total: acc.total + (payment.totalAmount || 0),
          paid: acc.paid + (payment.paidAmount || 0),
          balance: acc.balance + (payment.balanceAmount || 0),
          count: acc.count + 1
        }), { total: 0, paid: 0, balance: 0, count: 0 });
        
        setStats(stats);
      } catch (e) {
        setError(e.message || "Failed to fetch payment data");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [user]);

  const toggle = (id) => {
    setExpandedId((curr) => (curr === id ? null : id));
  };

  const refreshData = async () => {
    // Implement refresh logic
    const studentId = (user && (user.id || user.userID || user.studentID)) || 10;
const url = `http://localhost:50447/api/Payments/student/${studentId}`;
// const url = `https://testtuitionbackend.dockyardsoftware.com/api/Payments/student/${studentId}`;

    const token = window.localStorage.getItem("token");
    const res = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (res.ok) {
      const json = await res.json();
      setData(json);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Payment Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Track and manage all your course payments in one place
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={refreshData}
                className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="text-gray-500 dark:text-gray-400">Total Courses</div>
                <BookOpen className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.count}</div>
            </div>
            
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="text-gray-500 dark:text-gray-400">Total Amount</div>
                <DollarSign className="w-5 h-5 text-gray-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                LKR {formatCurrency(stats.total)}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="text-gray-500 dark:text-gray-400">Total Paid</div>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                LKR {formatCurrency(stats.paid)}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="text-gray-500 dark:text-gray-400">Total Balance</div>
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
              <div className="text-3xl font-bold text-red-500 dark:text-red-400">
                LKR {formatCurrency(stats.balance)}
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-lg">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
              <p className="mt-6 text-gray-600 dark:text-gray-400 font-medium">Loading your payment data...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">Error Loading Payments</h3>
                <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success State */}
        {!loading && !error && (
          <div className="space-y-6">
            {data && data.length > 0 ? (
              data.map((payment) => (
                <PaymentCard
                  key={payment.paymentID}
                  payment={payment}
                  expanded={expandedId === payment.paymentID}
                  onToggle={toggle}
                />
              ))
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CreditCard className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-3">No Payments Found</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  You don't have any payment records yet. Payments will appear here once they are processed.
                </p>
              </div>
            )}
          </div>
        )}
        
        {/* Footer Note */}
        <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentView;