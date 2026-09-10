import React, { useEffect, useState, useCallback, useMemo } from "react";
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
  Wallet,
  Search,
  X,
  SlidersHorizontal
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
  const normalizedStatus = (status || "").toUpperCase();
  const config = {
    PAID: {
      icon: <CheckCircle className="w-3.5 h-3.5" />,
      bg: "bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800/50",
      text: "text-green-800 dark:text-green-300",
    },
    PARTIAL: {
      icon: <Clock className="w-3.5 h-3.5" />,
      bg: "bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800/50",
      text: "text-amber-800 dark:text-amber-300",
    },
    UNPAID: {
      icon: <AlertCircle className="w-3.5 h-3.5" />,
      bg: "bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50",
      text: "text-red-800 dark:text-red-300",
    }
  };

  const statusConfig = config[normalizedStatus] || config.UNPAID;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.text}`}>
      {statusConfig.icon}
      <span className="capitalize">{normalizedStatus}</span>
    </span>
  );
};

const PaymentProgress = ({ paid, total }) => {
  const percentage = total > 0 ? (paid / total) * 100 : 0;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-300">Payment Progress</span>
        <span className="font-semibold text-gray-800 dark:text-gray-200">{percentage.toFixed(0)}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-green-500 to-emerald-500 h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>LKR {formatCurrency(paid)} paid</span>
        <span>LKR {formatCurrency(total)} total</span>
      </div>
    </div>
  );
};

const PaymentHistoryItem = ({ history }) => {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700 transition-all duration-300 group shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg shrink-0">
              <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                {history.remarks || "Payment Received"}
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(history.paymentDate)}
                </div>
                <div className="flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5" />
                  {history.paymentMethod}
                </div>
                {history.referenceNo && (
                  <div className="font-mono text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                    Ref: {history.referenceNo}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="text-left sm:text-right shrink-0">
          <div className="text-lg font-bold text-green-600 dark:text-green-400">
            LKR {formatCurrency(history.amountPaid)}
          </div>
          {history.createdDate && (
            <div className="text-xs text-gray-400 mt-0.5">
              {new Date(history.createdDate).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          )}
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
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl shrink-0">
                <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {payment.courseName || "Course Enrollment"}
                  </h3>
                  <StatusBadge status={payment.status} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <User className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-xs text-gray-500">Student</div>
                        <div className="font-semibold text-gray-800 dark:text-gray-200">{payment.studentName}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <User className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-xs text-gray-500">Teacher</div>
                        <div className="font-semibold text-gray-800 dark:text-gray-200">{payment.teacherName}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <User className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-xs text-gray-500">Parent</div>
                        <div className="font-semibold text-gray-800 dark:text-gray-200">{payment.parentName || "N/A"}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-xs text-gray-500">Contact</div>
                        <div className="font-semibold text-gray-800 dark:text-gray-200">{payment.parentContact || "N/A"}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="text-xs text-gray-500 mb-1">Enrollment ID</div>
                  <div className="font-mono text-sm px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg inline-block">
                    #{payment.enrollmentID}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Payment Summary */}
          <div className="lg:w-96 space-y-4">
            <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-300 text-sm">Course Total</span>
                <Wallet className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                LKR {formatCurrency(payment.totalAmount)}
              </div>
              
              <div className="space-y-3 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300 text-sm">Paid Amount</span>
                  <span className="text-xl font-bold text-green-600 dark:text-green-400">
                    LKR {formatCurrency(payment.paidAmount)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300 text-sm">Balance Due</span>
                  <span className="text-xl font-bold text-red-500 dark:text-red-400">
                    LKR {formatCurrency(payment.balanceAmount)}
                  </span>
                </div>
              </div>
              
              <div className="mt-4">
                <PaymentProgress paid={payment.paidAmount} total={payment.totalAmount} />
              </div>
            </div>
            
            <button
              onClick={() => onToggle(payment.paymentID)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-lg active:scale-95 cursor-pointer"
            >
              {expanded ? (
                <>
                  <ChevronUp className="w-5 h-5" />
                  Hide Payment History
                </>
              ) : (
                <>
                  <ChevronDown className="w-5 h-5" />
                  View Payment History ({payment.history?.length || 0})
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
                <p className="text-gray-500 text-sm mt-1">No transactions recorded for this payment yet.</p>
              </div>
            )}
          </div>
          
          {/* Summary Footer */}
          {payment.history && payment.history.length > 0 && (
            <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-100 dark:border-green-800/30">
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [stats, setStats] = useState({ total: 0, paid: 0, balance: 0, count: 0 });

  // Filters & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const getStudentId = (u) => {
    return (
      u?.StudentID ??
      u?.studentID ??
      u?.studentId ??
      u?.UserID ??
      u?.userID ??
      u?.userId ??
      u?.id ??
      10
    );
  };

  const fetchPayments = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const studentId = getStudentId(user);
      const url = `https://testtuitionbackend.dockyardsoftware.com/api/Payments/student/${studentId}`;
      const token = window.localStorage.getItem("token");

      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) throw new Error(`Failed to load payments (${res.status})`);
      const json = await res.json();
      const paymentData = Array.isArray(json) ? json : [];
      setData(paymentData);
      
      // Calculate statistics
      const computedStats = paymentData.reduce((acc, payment) => ({
        total: acc.total + (Number(payment.totalAmount) || 0),
        paid: acc.paid + (Number(payment.paidAmount) || 0),
        balance: acc.balance + (Number(payment.balanceAmount) || 0),
        count: acc.count + 1
      }), { total: 0, paid: 0, balance: 0, count: 0 });
      
      setStats(computedStats);
    } catch (e) {
      setError(e.message || "Failed to fetch payment data");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPayments(false);
  }, [fetchPayments]);

  const toggle = (id) => {
    setExpandedId((curr) => (curr === id ? null : id));
  };

  const handleRefresh = () => {
    fetchPayments(true);
  };

  // Status Counts calculation for Filter tabs
  const statusCounts = useMemo(() => {
    if (!data) return { ALL: 0, PAID: 0, PARTIAL: 0, UNPAID: 0 };
    return data.reduce(
      (acc, p) => {
        acc.ALL += 1;
        const st = (p.status || "UNPAID").toUpperCase();
        if (acc[st] !== undefined) {
          acc[st] += 1;
        }
        return acc;
      },
      { ALL: 0, PAID: 0, PARTIAL: 0, UNPAID: 0 }
    );
  }, [data]);

  // Filtering & Sorting Logic
  const filteredData = useMemo(() => {
    if (!data) return [];

    return data
      .filter((payment) => {
        // Status filter
        if (statusFilter !== "ALL") {
          const pStatus = (payment.status || "").toUpperCase();
          if (pStatus !== statusFilter) return false;
        }

        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const course = (payment.courseName || "").toLowerCase();
          const teacher = (payment.teacherName || "").toLowerCase();
          const student = (payment.studentName || "").toLowerCase();
          const parent = (payment.parentName || "").toLowerCase();
          const enrollment = String(payment.enrollmentID || "").toLowerCase();
          const paymentId = String(payment.paymentID || "").toLowerCase();

          // Check history references
          const historyMatch = (payment.history || []).some((h) =>
            String(h.referenceNo || "").toLowerCase().includes(q) ||
            String(h.paymentMethod || "").toLowerCase().includes(q) ||
            String(h.remarks || "").toLowerCase().includes(q)
          );

          return (
            course.includes(q) ||
            teacher.includes(q) ||
            student.includes(q) ||
            parent.includes(q) ||
            enrollment.includes(q) ||
            paymentId.includes(q) ||
            historyMatch
          );
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "amount-high-low") {
          return (Number(b.totalAmount) || 0) - (Number(a.totalAmount) || 0);
        }
        if (sortBy === "amount-low-high") {
          return (Number(a.totalAmount) || 0) - (Number(b.totalAmount) || 0);
        }
        if (sortBy === "balance-high") {
          return (Number(b.balanceAmount) || 0) - (Number(a.balanceAmount) || 0);
        }
        // "newest" by default
        return (Number(b.paymentID) || 0) - (Number(a.paymentID) || 0);
      });
  }, [data, searchQuery, statusFilter, sortBy]);

  const activeFilterCount = 
    (statusFilter !== "ALL" ? 1 : 0) + 
    (searchQuery.trim() ? 1 : 0) + 
    (sortBy !== "newest" ? 1 : 0);

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("ALL");
    setSortBy("newest");
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
                onClick={handleRefresh}
                disabled={isRefreshing || loading}
                className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
                title="Refresh payments"
              >
                <RefreshCw className={`w-4 h-4 text-indigo-600 dark:text-indigo-400 ${isRefreshing ? "animate-spin" : ""}`} />
                <span className="font-medium text-gray-700 dark:text-gray-200">
                  {isRefreshing ? "Refreshing..." : "Refresh"}
                </span>
              </button>
              <button 
                onClick={() => setShowFilterPanel((prev) => !prev)}
                className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer relative ${
                  showFilterPanel || activeFilterCount > 0
                    ? "bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-700 dark:text-indigo-300 font-semibold"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>Filter</span>
                {activeFilterCount > 0 && (
                  <span className="bg-indigo-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center ml-1">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 p-4 mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search Bar */}
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search course, teacher, reference #..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Status Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
                {[
                  { key: "ALL", label: "All", count: statusCounts.ALL },
                  { key: "PAID", label: "Paid", count: statusCounts.PAID },
                  { key: "PARTIAL", label: "Partial", count: statusCounts.PARTIAL },
                  { key: "UNPAID", label: "Unpaid", count: statusCounts.UNPAID },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setStatusFilter(tab.key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      statusFilter === tab.key
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-gray-100 dark:bg-gray-700/60 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </div>
            </div>

            {/* Expanded Filter Panel */}
            {showFilterPanel && (
              <div className="pt-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full max-w-full min-w-0 px-3 py-2.5 sm:py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-base sm:text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 truncate"
                  >
                    <option value="newest">Newest First</option>
                    <option value="amount-high-low">Total Amount (High to Low)</option>
                    <option value="amount-low-high">Total Amount (Low to High)</option>
                    <option value="balance-high">Highest Balance Due</option>
                  </select>
                </div>

                {activeFilterCount > 0 && (
                  <div className="flex items-end sm:col-span-1">
                    <button
                      onClick={clearFilters}
                      className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400 border border-red-200 dark:border-red-800/50 rounded-xl text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <X className="w-4 h-4" />
                      Reset All Filters
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Courses</div>
                <BookOpen className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.count}</div>
            </div>
            
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Amount</div>
                <DollarSign className="w-5 h-5 text-gray-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                LKR {formatCurrency(stats.total)}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Paid</div>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                LKR {formatCurrency(stats.paid)}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Balance</div>
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
          <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 mb-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">Error Loading Payments</h3>
                <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
                <button
                  onClick={handleRefresh}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filter summary bar */}
        {!loading && !error && data && data.length > 0 && activeFilterCount > 0 && (
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4 px-1">
            <span>
              Showing <strong className="text-gray-900 dark:text-white">{filteredData.length}</strong> of {data.length} payments
            </span>
            <button
              onClick={clearFilters}
              className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium hover:underline cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Success State */}
        {!loading && !error && (
          <div className="space-y-6">
            {filteredData && filteredData.length > 0 ? (
              filteredData.map((payment) => (
                <PaymentCard
                  key={payment.paymentID}
                  payment={payment}
                  expanded={expandedId === payment.paymentID}
                  onToggle={toggle}
                />
              ))
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center border border-gray-100 dark:border-gray-700">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CreditCard className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-3">
                  {data && data.length > 0 ? "No Matching Payments" : "No Payments Found"}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                  {data && data.length > 0 
                    ? "No payment records match your search or filter criteria. Try clearing your filters."
                    : "You don't have any payment records yet. Payments will appear here once they are processed."
                  }
                </p>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all cursor-pointer shadow-md"
                  >
                    Clear Filters
                  </button>
                )}
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