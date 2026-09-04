

// // export default PaymentHistory;
// import { useEffect, useState } from "react";
// import axios from "axios";

// // Small date formatter to avoid extra dependency on date-fns
// const formatDate = (d) => {
//   try {
//     const dt = d ? new Date(d) : new Date();
//     return dt.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   } catch (e) {
//     return String(d || "");
//   }
// };

// const Badge = ({ status }) => {
//   const base = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
//   if (!status) return null;
//   switch (String(status).toUpperCase()) {
//     case "PAID":
//       return <span className={`${base} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200`}>PAID</span>;
//     case "PARTIAL":
//       return <span className={`${base} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200`}>PARTIAL</span>;
//     case "PENDING":
//       return <span className={`${base} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200`}>PENDING</span>;
//     default:
//       return <span className={`${base} bg-gray-100 text-gray-800 dark:bg-gray-700/40 dark:text-gray-200`}>{status}</span>;
//   }
// };

// const PaymentHistory = () => {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [openMap, setOpenMap] = useState({});

//   useEffect(() => {
//     (async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const apiUrl = "http://localhost:50447/api/Payments/All";
//         const headers = {};
//         try {
//           const rawToken = window.localStorage.getItem("token") || window.sessionStorage.getItem("token");
//           if (rawToken) {
//             const token = String(rawToken).replace(/^\"|\"$/g, "").replace(/^\'|\'$/g, "");
//             headers["Authorization"] = `Bearer ${token}`;
//           }
//         } catch (e) {}

//         const resp = await axios.get(apiUrl, { headers });
//         if (Array.isArray(resp.data)) setItems(resp.data);
//         else setItems(resp.data?.items ?? []);
//       } catch (err) {
//         console.error("Failed to load payments history", err);
//         setError(err?.response?.data || err?.message || "Failed to load");
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   const toggle = (id) => setOpenMap((m) => ({ ...m, [id]: !m[id] }));

//   const formatCurrency = (amount) => {
//     return Number(amount).toLocaleString("en-US", {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     });
//   };

//   return (
//     <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payment History</h1>
//           <p className="text-gray-600 dark:text-gray-400">Track and manage all payment records</p>
//         </div>
//         <div className="text-sm text-gray-500 dark:text-gray-400">
//           Total Records: {items.length}
//         </div>
//       </div>

//       {/* Table Container */}
//       <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
//         {loading ? (
//           <div className="p-8 text-center">
//             <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
//             <p className="mt-2 text-gray-600 dark:text-gray-400">Loading payment records...</p>
//           </div>
//         ) : error ? (
//           <div className="p-6 text-center">
//             <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
//               <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//             </div>
//             <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Failed to load data</h3>
//             <p className="text-gray-600 dark:text-gray-400">{String(error)}</p>
//           </div>
//         ) : items.length === 0 ? (
//           <div className="p-8 text-center">
//             <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
//               <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//               </svg>
//             </div>
//             <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No payments found</h3>
//             <p className="text-gray-600 dark:text-gray-400">No payment records available at the moment</p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
//                 <tr>
//                   <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">#</th>
//                   <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Enrollment ID</th>
//                   <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
//                   <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Amount</th>
//                   <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Paid Amount</th>
//                   <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Balance</th>
//                   <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//                 {items.map((p, index) => (
//                   <>
//                     <tr key={p.paymentID} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
//                       <td className="py-4 px-6 text-sm font-medium text-gray-900 dark:text-white">{index + 1}</td>
//                       <td className="py-4 px-6 text-sm font-semibold text-gray-900 dark:text-white">{p.enrollmentID}</td>
//                       <td className="py-4 px-6 text-sm">
//                         <Badge status={p.status} />
//                       </td>
//                       <td className="py-4 px-6 text-sm font-medium text-gray-900 dark:text-white">
//                         {formatCurrency(p.totalAmount)} LKR
//                       </td>
//                       <td className="py-4 px-6 text-sm font-medium text-green-600 dark:text-green-400">
//                         {formatCurrency(p.paidAmount)} LKR
//                       </td>
//                       <td className="py-4 px-6 text-sm font-medium text-red-600 dark:text-red-400">
//                         {formatCurrency(p.balanceAmount)} LKR
//                       </td>
//                       <td className="py-4 px-6 text-sm">
//                         <button
//                           type="button"
//                           onClick={() => toggle(p.paymentID)}
//                           className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-xs font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
//                         >
//                           <svg className={`w-4 h-4 mr-1.5 transition-transform ${openMap[p.paymentID] ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                           </svg>
//                           {openMap[p.paymentID] ? "Hide History" : "Show History"}
//                         </button>
//                       </td>
//                     </tr>
//                     {openMap[p.paymentID] && (
//                       <tr>
//                         <td colSpan="7" className="p-0">
//                           <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
//                             <div className="flex items-center justify-between mb-3">
//                               <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Payment History</h4>
//                               <span className="text-xs text-gray-500 dark:text-gray-400">
//                                 {(Array.isArray(p.history) ? p.history : []).length} transaction(s)
//                               </span>
//                             </div>
//                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
//                               {(Array.isArray(p.history) ? p.history : []).map((h) => (
//                                 <div key={h.paymentHistoryID} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
//                                   <div className="flex items-center justify-between mb-2">
//                                     <div className="text-lg font-semibold text-gray-900 dark:text-white">
//                                       {formatCurrency(h.amountPaid)} LKR
//                                     </div>
//                                     <div className="text-xs px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 rounded">
//                                       {h.paymentMethod}
//                                     </div>
//                                   </div>
//                                   <div className="space-y-2 text-sm">
//                                     <div className="flex items-center text-gray-600 dark:text-gray-400">
//                                       <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                                       </svg>
//                                       Reference: {h.referenceNo || "N/A"}
//                                     </div>
//                                     <div className="flex items-center text-gray-600 dark:text-gray-400">
//                                       <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                                       </svg>
//                                       {h.paymentDate ? formatDate(h.paymentDate) : formatDate(h.createdDate)}
//                                     </div>
//                                     {h.remarks && (
//                                       <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
//                                         <div className="text-xs text-gray-500 dark:text-gray-400">Remarks:</div>
//                                         <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">{h.remarks}</div>
//                                       </div>
//                                     )}
//                                   </div>
//                                 </div>
//                               ))}
//                             </div>
//                             {(Array.isArray(p.history) ? p.history : []).length === 0 && (
//                               <div className="text-center py-6 text-gray-500 dark:text-gray-400">
//                                 No transaction history available
//                               </div>
//                             )}
//                           </div>
//                         </td>
//                       </tr>
//                     )}
//                   </>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Summary Footer */}
//       {items.length > 0 && !loading && !error && (
//         <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
//           <div className="grid grid-cols-3 gap-4">
//             <div className="text-center">
//               <div className="text-sm text-gray-500 dark:text-gray-400">Total Balance</div>
//               <div className="text-xl font-bold text-red-600 dark:text-red-400">
//                 {formatCurrency(items.reduce((sum, p) => sum + (Number(p.balanceAmount) || 0), 0))} LKR
//               </div>
//             </div>
//             <div className="text-center">
//               <div className="text-sm text-gray-500 dark:text-gray-400">Total Paid</div>
//               <div className="text-xl font-bold text-green-600 dark:text-green-400">
//                 {formatCurrency(items.reduce((sum, p) => sum + (Number(p.paidAmount) || 0), 0))} LKR
//               </div>
//             </div>
//             <div className="text-center">
//               <div className="text-sm text-gray-500 dark:text-gray-400">Overall Total</div>
//               <div className="text-xl font-bold text-gray-900 dark:text-white">
//                 {formatCurrency(items.reduce((sum, p) => sum + (Number(p.totalAmount) || 0), 0))} LKR
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PaymentHistory;
import { useEffect, useState } from "react";
import axios from "axios";
import StatsCard from "../../components/common/StatsCard";

// Small date formatter to avoid extra dependency on date-fns
const formatDate = (d) => {
  try {
    const dt = d ? new Date(d) : new Date();
    return dt.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (e) {
    return String(d || "");
  }
};

const Badge = ({ status }) => {
  const base = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  if (!status) return null;
  switch (String(status).toUpperCase()) {
    case "PAID":
      return <span className={`${base} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200`}>PAID</span>;
    case "PARTIAL":
      return <span className={`${base} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200`}>PARTIAL</span>;
    case "PENDING":
      return <span className={`${base} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200`}>PENDING</span>;
    default:
      return <span className={`${base} bg-gray-100 text-gray-800 dark:bg-gray-700/40 dark:text-gray-200`}>{status}</span>;
  }
};

// Modal Component for Add Installment
const AddInstallmentModal = ({ isOpen, onClose, payment, onSuccess }) => {
  const [formData, setFormData] = useState({
    PaymentID: "",
    AmountPaid: "",
    PaymentMethod: "",
    ReferenceNo: "",
    Remarks: "",
    CreatedBy: "", // This should come from user context/session
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isFullyPaid = payment && (String(payment.status || "").toUpperCase() === "PAID" || Number(payment.balanceAmount || 0) <= 0);

  useEffect(() => {
    if (payment && isOpen) {
      // Get user ID from localStorage or sessionStorage (adjust based on your auth system)
      const userId = window.localStorage.getItem("userId") || window.sessionStorage.getItem("userId") || "101";
      // Generate a simple unique reference number for this installment
      const genRef = `REF-${payment.enrollmentID || payment.paymentID}-${Math.floor(Math.random() * 900000 + 100000)}`;

      setFormData({
        PaymentID: payment.paymentID || "",
        AmountPaid: "",
        PaymentMethod: "Cash",
        ReferenceNo: genRef,
        Remarks: "",
        CreatedBy: userId,
      });

      // If payment already marked as PAID or has no balance, show validation error
      const isPaidStatus = String(payment.status || "").toUpperCase() === "PAID";
      const bal = Number(payment.balanceAmount || 0);
      if (isPaidStatus || bal <= 0) {
        setError("Student already fully paid — no installment can be added.");
      } else {
        setError(null);
      }
    }
  }, [payment, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = window.localStorage.getItem("token") || window.sessionStorage.getItem("token");
      const headers = {
        "Authorization": `Bearer ${token?.replace(/^\"|\"$/g, "")}`,
        "Content-Type": "application/json"
      };

      const payload = {
        ...formData,
        AmountPaid: parseFloat(formData.AmountPaid),
        PaymentID: parseInt(formData.PaymentID),
        CreatedBy: parseInt(formData.CreatedBy)
      };

      // Prevent adding installment if already fully paid
      const isPaidStatus = String(payment?.status || "").toUpperCase() === "PAID";
      const balance = Number(payment?.balanceAmount || 0);
      if (isPaidStatus || balance <= 0) {
        setError("Student already fully paid — cannot add installment.");
        setLoading(false);
        return;
      }

      // Validate amount does not exceed remaining balance
      if (!payload.AmountPaid || payload.AmountPaid <= 0) {
        setError("Please enter a valid amount greater than 0.");
        setLoading(false);
        return;
      }
      if (payload.AmountPaid > balance) {
        setError("Amount exceeds remaining balance.");
        setLoading(false);
        return;
      }

      const response = await axios.post(
    //"http://localhost:50447/api/Payments/AddInstallment",
    "https://testtuitionbackend.dockyardsoftware.com/api/Payments/AddInstallment",
        payload,
        { headers }
      );

      if (response.status === 200 || response.status === 201) {
        onSuccess();
        onClose();
      } else {
        throw new Error("Failed to add installment");
      }
    } catch (err) {
      console.error("Error adding installment:", err);
      setError(err.response?.data?.message || err.message || "Failed to add installment");
    } finally {
      setLoading(false);
    }
  };

  const formatBalance = (val) => {
    const num = typeof val === "number" ? val : parseFloat(String(val || 0).replace(/,/g, "")) || 0;
    return num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Add Installment
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Payment ID
                </label>
                <input
                  type="text"
                  value={formData.PaymentID}
                  disabled
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Remaining Balance (LKR)
                </label>
                <input
                  type="text"
                  value={formatBalance(payment?.balanceAmount)}
                  disabled
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Amount Paid (LKR)
                </label>
                <input
                  type="number"
                  name="AmountPaid"
                  value={formData.AmountPaid}
                  onChange={handleChange}
                  required
                  min="0.01"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter amount"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Payment Method
                </label>
                <select
                  name="PaymentMethod"
                  value={formData.PaymentMethod}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="Cash">Cash</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Online Payment">Online Payment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Reference Number
                </label>
                <input
                  type="text"
                  name="ReferenceNo"
                  value={formData.ReferenceNo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Optional reference number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Remarks
                </label>
                <textarea
                  name="Remarks"
                  value={formData.Remarks}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Additional notes or remarks"
                />
              </div>

              <div className="pt-4 flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || isFullyPaid}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </span>
                  ) : "Add Installment"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const getCourseName = (p) => {
  if (!p) return "—";
  if (typeof p.courseName === "string" && p.courseName.trim()) return p.courseName.trim();
  if (typeof p.CourseName === "string" && p.CourseName.trim()) return p.CourseName.trim();
  if (typeof p.course_Name === "string" && p.course_Name.trim()) return p.course_Name.trim();
  if (typeof p.courseTitle === "string" && p.courseTitle.trim()) return p.courseTitle.trim();
  if (typeof p.CourseTitle === "string" && p.CourseTitle.trim()) return p.CourseTitle.trim();
  if (typeof p.course === "string" && p.course.trim()) return p.course.trim();

  const c = p.course || p.enrollment?.course;
  if (c && typeof c === "object") {
    const name = c.courseName || c.CourseName || c.name || c.Name || c.title || c.Title || c.course_Name;
    if (name) return String(name).trim();
  }

  const ecName = p.enrollment?.courseName || p.enrollment?.CourseName || p.enrollment?.course_Name;
  if (ecName) return String(ecName).trim();

  return p.enrollmentID ? String(p.enrollmentID) : "—";
};

const getSubjectName = (p) => {
  if (!p) return "—";
  if (typeof p.subject === "string" && p.subject.trim()) return p.subject.trim();
  if (typeof p.subjectName === "string" && p.subjectName.trim()) return p.subjectName.trim();
  if (typeof p.SubjectName === "string" && p.SubjectName.trim()) return p.SubjectName.trim();
  if (typeof p.subject_Name === "string" && p.subject_Name.trim()) return p.subject_Name.trim();
  if (typeof p.subjectTitle === "string" && p.subjectTitle.trim()) return p.subjectTitle.trim();
  if (typeof p.SubjectTitle === "string" && p.SubjectTitle.trim()) return p.SubjectTitle.trim();
  if (typeof p.className === "string" && p.className.trim()) return p.className.trim();
  if (typeof p.ClassName === "string" && p.ClassName.trim()) return p.ClassName.trim();
  if (typeof p.class === "string" && p.class.trim()) return p.class.trim();
  if (typeof p.Class === "string" && p.Class.trim()) return p.Class.trim();

  const s = p.subject || p.Subject || p.enrollment?.subject || p.enrollment?.Subject;
  if (s && typeof s === "object") {
    const name = s.subjectName || s.SubjectName || s.name || s.Name || s.title || s.Title || s.subject_Name;
    if (name) return String(name).trim();
  }

  const esName = p.enrollment?.subjectName || p.enrollment?.SubjectName || p.enrollment?.subject_Name || p.enrollment?.className || p.enrollment?.ClassName;
  if (esName) return String(esName).trim();

  return "—";
};

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

const PaymentHistory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openMap, setOpenMap] = useState({});
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("active");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    try {
const apiUrl = "https://testtuitionbackend.dockyardsoftware.com/api/Payments/All";
//const apiUrl = "http://localhost:50447/api/Payments/All";
      const headers = {};
      try {
        const rawToken = window.localStorage.getItem("token") || window.sessionStorage.getItem("token");
        if (rawToken) {
          const token = String(rawToken).replace(/^\"|\"$/g, "").replace(/^\'|\'$/g, "");
          headers["Authorization"] = `Bearer ${token}`;
        }
      } catch (e) {}

      const resp = await axios.get(apiUrl, { headers });
      if (Array.isArray(resp.data)) setItems(resp.data);
      else setItems(resp.data?.items ?? []);
    } catch (err) {
      console.error("Failed to load payments history", err);
      setError(err?.response?.data || err?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  const toggle = (id) => setOpenMap((m) => ({ ...m, [id]: !m[id] }));

  const handleEditClick = (payment) => {
    setSelectedPayment(payment);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedPayment(null);
  };

  const handleInstallmentSuccess = () => {
    // Refresh the payments data after successful installment addition
    fetchPayments();
  };

  const formatCurrency = (amount) => {
    return Number(amount).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const activeRecords = (items || []).filter(isStudentActive);
  const inactiveRecords = (items || []).filter((p) => !isStudentActive(p));
  const currentTabRecords = activeTab === "active" ? activeRecords : inactiveRecords;

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Add Installment Modal */}
      <AddInstallmentModal
        isOpen={showModal}
        onClose={handleModalClose}
        payment={selectedPayment}
        onSuccess={handleInstallmentSuccess}
      />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Payments</h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Track and manage all payment records</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full md:w-auto">
          <input
            id="payment-search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search course, class, or student name"
            className="w-full sm:w-64 px-3 py-2 sm:py-1.5 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 self-end sm:self-auto">
            Total Records: {items.length}
          </div>
        </div>
      </div>

      {/* Tabs Container */}
      <div className="flex overflow-x-auto scrollbar-none border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-t-xl px-2 pt-1">
        <button
          type="button"
          onClick={() => setActiveTab("active")}
          className={`flex-shrink-0 whitespace-nowrap py-1.5 px-3 text-xs font-medium border-b-2 transition-colors duration-150 flex items-center space-x-1.5 ${
            activeTab === "active"
              ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-semibold"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
          <span>Active Students</span>
          <span
            className={`ml-1 px-1.5 py-0.5 text-[10px] rounded-full ${
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
          className={`flex-shrink-0 whitespace-nowrap py-1.5 px-3 text-xs font-medium border-b-2 transition-colors duration-150 flex items-center space-x-1.5 ${
            activeTab === "inactive"
              ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-semibold"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
          <span>Inactive Students</span>
          <span
            className={`ml-1 px-1.5 py-0.5 text-[10px] rounded-full ${
              activeTab === "inactive"
                ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-bold"
                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
            }`}
          >
            {inactiveRecords.length}
          </span>
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-gray-800 rounded-b-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 sm:p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">Loading payment records...</p>
          </div>
        ) : error ? (
          <div className="p-4 sm:p-6 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-100 dark:bg-red-900/20 mb-3 sm:mb-4">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-1.5 sm:mb-2">Failed to load data</h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{String(error)}</p>
          </div>
        ) : currentTabRecords.length === 0 ? (
          <div className="p-6 sm:p-8 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 dark:bg-gray-700 mb-3 sm:mb-4">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-1.5 sm:mb-2">
              No {activeTab === "active" ? "active" : "inactive"} student payments found
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              No payment records available for {activeTab === "active" ? "active" : "inactive"} students at the moment
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
            <table className="w-full min-w-[1050px]">
              <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">#</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Enrollment ID</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Course</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Class</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Student</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Status</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Total Amount</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Paid Amount</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Balance</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {(() => {
                  const q = String(searchQuery || "").trim().toLowerCase();
                  const filtered = q
                    ? (currentTabRecords || []).filter((p) => {
                        const parts = [];
                        parts.push(String(getCourseName(p)));
                        parts.push(String(getSubjectName(p)));
                        parts.push(String(p.enrollmentID || ""));
                        const s = p.enrollment?.student || p.student;
                        if (s) {
                          parts.push(String(s.firstName || s.FirstName || s.firstname || ""));
                          parts.push(String(s.lastName || s.LastName || s.lastname || ""));
                          parts.push(String(s.username || s.userName || ""));
                        }
                        const hay = parts.join(" ").toLowerCase();
                        return hay.indexOf(q) !== -1;
                      })
                    : currentTabRecords || [];
                  return filtered.map((p, index) => (
                  <>
                    <tr key={p.paymentID} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="py-3.5 px-4 text-xs sm:text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">{index + 1}</td>
                      <td className="py-3.5 px-4 text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">{p.enrollmentID || "—"}</td>
                      <td className="py-3.5 px-4 text-xs sm:text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap max-w-[200px] truncate" title={getCourseName(p)}>{getCourseName(p)}</td>
                      <td className="py-3.5 px-4 text-xs sm:text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap max-w-[180px] truncate" title={getSubjectName(p)}>{getSubjectName(p)}</td>
                      <td className="py-3.5 px-4 text-xs sm:text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap max-w-[180px] truncate">
                        {(() => {
                          const s = p.enrollment?.student;
                          if (!s) return "—";
                          const full = [s.firstName, s.lastName].filter(Boolean).join(" ");
                          return full || s.username || s.userID || "—";
                        })()}
                      </td>
                      <td className="py-3.5 px-4 text-xs sm:text-sm whitespace-nowrap">
                        <Badge status={p.status} />
                      </td>
                      <td className="py-3.5 px-4 text-xs sm:text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
                        {formatCurrency(p.totalAmount)} LKR
                      </td>
                      <td className="py-3.5 px-4 text-xs sm:text-sm font-medium text-green-600 dark:text-green-400 whitespace-nowrap">
                        {formatCurrency(p.paidAmount)} LKR
                      </td>
                      <td className="py-3.5 px-4 text-xs sm:text-sm font-medium text-red-600 dark:text-red-400 whitespace-nowrap">
                        {formatCurrency(p.balanceAmount)} LKR
                      </td>
                      <td className="py-3.5 px-4 text-xs sm:text-sm whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => toggle(p.paymentID)}
                            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 dark:border-gray-600 text-xs font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors whitespace-nowrap"
                          >
                            <svg className={`w-3.5 h-3.5 mr-1.5 transition-transform ${openMap[p.paymentID] ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                            {openMap[p.paymentID] ? "Hide History" : "Show History"}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleEditClick(p)}
                            className="inline-flex items-center px-2.5 py-1.5 border border-indigo-300 dark:border-indigo-600 text-xs font-medium rounded-lg text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors whitespace-nowrap"
                            title="Add Installment"
                          >
                            <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add
                          </button>
                        </div>
                      </td>
                    </tr>
                    {openMap[p.paymentID] && (
                      <tr>
                        <td colSpan="10" className="p-0">
                          <div className="bg-gray-50 dark:bg-gray-800/50 px-3 sm:px-6 py-3 sm:py-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">Payment History</h4>
                              <span className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">
                                {(Array.isArray(p.history) ? p.history : []).length} transaction(s)
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {(Array.isArray(p.history) ? p.history : []).map((h) => (
                                <div key={h.paymentHistoryID} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                                      {formatCurrency(h.amountPaid)} LKR
                                    </div>
                                    <div className="text-[11px] sm:text-xs px-2 py-0.5 sm:py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 rounded">
                                      {h.paymentMethod}
                                    </div>
                                  </div>
                                  <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                      </svg>
                                      <span className="truncate">Reference: {h.referenceNo || "N/A"}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                      </svg>
                                      {h.paymentDate ? formatDate(h.paymentDate) : formatDate(h.createdDate)}
                                    </div>
                                    {h.remarks && (
                                      <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                                        <div className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">Remarks:</div>
                                        <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mt-0.5">{h.remarks}</div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                            {(Array.isArray(p.history) ? p.history : []).length === 0 && (
                              <div className="text-center py-4 sm:py-6 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                No transaction history available
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ));
              })()}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Footer */}
      {currentTabRecords.length > 0 && !loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatsCard
            title={`Total Balance (${activeTab === "active" ? "Active" : "Inactive"})`}
            value={`${formatCurrency(currentTabRecords.reduce((sum, p) => sum + (Number(p.balanceAmount) || 0), 0))} LKR`}
            valueColor="text-red-600 dark:text-red-400"
          />
          <StatsCard
            title={`Total Paid (${activeTab === "active" ? "Active" : "Inactive"})`}
            value={`${formatCurrency(currentTabRecords.reduce((sum, p) => sum + (Number(p.paidAmount) || 0), 0))} LKR`}
            valueColor="text-green-600 dark:text-green-400"
          />
          <StatsCard
            title={`Overall Total (${activeTab === "active" ? "Active" : "Inactive"})`}
            value={`${formatCurrency(currentTabRecords.reduce((sum, p) => sum + (Number(p.totalAmount) || 0), 0))} LKR`}
            valueColor="text-gray-900 dark:text-white"
          />
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;