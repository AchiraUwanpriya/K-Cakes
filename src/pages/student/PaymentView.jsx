import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { 
  CreditCard, 
  DollarSign, 
  Calendar, 
  User, 
  BookOpen,
  ChevronDown,
  ChevronUp,
  Filter,
  RefreshCw,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Search,
  X
} from "lucide-react";
import StatsCard from "../../components/common/StatsCard";

const formatDate = (iso) => {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    return iso;
  }
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0);
};

const StatusBadge = ({ status }) => {
  const normalizedStatus = (status || "").toUpperCase();
  const config = {
    PAID: {
      icon: <CheckCircle className="w-3 h-3" />,
      bg: "bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800/50",
      text: "text-green-800 dark:text-green-300",
    },
    PARTIAL: {
      icon: <Clock className="w-3 h-3" />,
      bg: "bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800/50",
      text: "text-amber-800 dark:text-amber-300",
    },
    UNPAID: {
      icon: <AlertCircle className="w-3 h-3" />,
      bg: "bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50",
      text: "text-red-800 dark:text-red-300",
    },
  };

  const statusConfig = config[normalizedStatus] || config.UNPAID;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold ${statusConfig.bg} ${statusConfig.text}`}
    >
      {statusConfig.icon}
      <span className="capitalize">{normalizedStatus}</span>
    </span>
  );
};

const PaymentHistoryItem = ({ history }) => {
  return (
    <div className="p-2 sm:p-2.5 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-xs text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
        <div className="min-w-0">
          <div className="font-semibold text-gray-900 dark:text-white truncate">
            {history.remarks || "Payment Received"}
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-gray-400" />
              {formatDate(history.paymentDate)}
            </span>
            <span>•</span>
            <span className="px-1.5 py-0.2 bg-gray-100 dark:bg-gray-700 rounded font-medium text-gray-600 dark:text-gray-300">
              {history.paymentMethod}
            </span>
            {history.referenceNo && (
              <>
                <span>•</span>
                <span className="font-mono">Ref: {history.referenceNo}</span>
              </>
            )}
          </div>
        </div>

        <div className="text-left sm:text-right pt-1 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-gray-700 shrink-0">
          <div className="text-xs sm:text-sm font-bold text-green-600 dark:text-green-400">
            LKR {formatCurrency(history.amountPaid)}
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentCard = ({ payment, expanded, onToggle }) => {
  const percentage =
    payment.totalAmount > 0
      ? Math.min(100, (payment.paidAmount / payment.totalAmount) * 100)
      : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xs overflow-hidden border border-gray-200/90 dark:border-gray-700 transition-all duration-150">
      {/* Card Header */}
      <div className="p-2.5 sm:p-3.5 border-b border-gray-100 dark:border-gray-700/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate">
                  {payment.courseName || "Course Enrollment"}
                </h3>
                <StatusBadge status={payment.status} />
              </div>

              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5 text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-400">
                {payment.teacherName && (
                  <span>Teacher: {payment.teacherName}</span>
                )}
                <span className="text-gray-300 dark:text-gray-600">•</span>
                <span>Enroll #{payment.enrollmentID}</span>
                <span className="text-gray-300 dark:text-gray-600">•</span>
                <span>Pay ID #{payment.paymentID}</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 self-end sm:self-auto">
            <button
              onClick={() => onToggle(payment.paymentID)}
              className="flex items-center gap-1 px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
            >
              {expanded ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5" />
                  <span>Hide</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5" />
                  <span>Details ({payment.history?.length || 0})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 3 Metric Tiles (Total, Paid, Balance) */}
      <div className="p-2 sm:p-2.5 m-2.5 sm:m-3 mb-2.5 bg-gray-50/70 dark:bg-gray-900/40 rounded-lg border border-gray-100/80 dark:border-gray-800 space-y-2">
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-center">
          <div className="min-w-0">
            <div className="text-[10px] text-gray-500 uppercase font-semibold">Total</div>
            <div
              className="text-xs sm:text-sm md:text-base font-bold text-gray-900 dark:text-white mt-0.5 truncate"
              title={`LKR ${formatCurrency(payment.totalAmount)}`}
            >
              LKR {formatCurrency(payment.totalAmount)}
            </div>
          </div>

          <div className="min-w-0 border-x border-gray-200 dark:border-gray-700/60 px-1">
            <div className="text-[10px] text-gray-500 uppercase font-semibold">Paid</div>
            <div
              className="text-xs sm:text-sm md:text-base font-bold text-green-600 dark:text-green-400 mt-0.5 truncate"
              title={`LKR ${formatCurrency(payment.paidAmount)}`}
            >
              LKR {formatCurrency(payment.paidAmount)}
            </div>
          </div>

          <div className="min-w-0">
            <div className="text-[10px] text-gray-500 uppercase font-semibold">Balance</div>
            <div
              className={`text-xs sm:text-sm md:text-base font-bold mt-0.5 truncate ${
                payment.balanceAmount > 0
                  ? "text-red-500 dark:text-red-400"
                  : "text-green-600 dark:text-green-400"
              }`}
              title={`LKR ${formatCurrency(payment.balanceAmount)}`}
            >
              LKR {formatCurrency(payment.balanceAmount)}
            </div>
          </div>
        </div>

        {/* Mini progress bar */}
        <div>
          <div className="flex justify-between text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">
            <span>Progress</span>
            <span className="font-semibold">{percentage.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Expanded History Section */}
      {expanded && (
        <div className="border-t border-gray-100 dark:border-gray-700/80 bg-gray-50/50 dark:bg-gray-900/30 p-2.5 sm:p-3 space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
              <span>Transaction History</span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400">
                ({payment.history?.length || 0})
              </span>
            </h4>
          </div>

          <div className="space-y-1.5 max-h-44 overflow-y-auto pr-0.5">
            {payment.history && payment.history.length > 0 ? (
              payment.history
                .slice()
                .sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate))
                .map((history) => (
                  <PaymentHistoryItem key={history.paymentHistoryID} history={history} />
                ))
            ) : (
              <div className="text-center py-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 text-xs text-gray-400">
                No payment transactions recorded yet.
              </div>
            )}
          </div>
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

  const fetchPayments = useCallback(
    async (isRefresh = false) => {
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

        const computedStats = paymentData.reduce(
          (acc, payment) => ({
            total: acc.total + (Number(payment.totalAmount) || 0),
            paid: acc.paid + (Number(payment.paidAmount) || 0),
            balance: acc.balance + (Number(payment.balanceAmount) || 0),
            count: acc.count + 1,
          }),
          { total: 0, paid: 0, balance: 0, count: 0 }
        );

        setStats(computedStats);
      } catch (e) {
        setError(e.message || "Failed to fetch payment data");
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    },
    [user]
  );

  useEffect(() => {
    fetchPayments(false);
  }, [fetchPayments]);

  const toggle = (id) => {
    setExpandedId((curr) => (curr === id ? null : id));
  };

  const handleRefresh = () => {
    fetchPayments(true);
  };

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

  const filteredData = useMemo(() => {
    if (!data) return [];

    return data
      .filter((payment) => {
        if (statusFilter !== "ALL") {
          const pStatus = (payment.status || "").toUpperCase();
          if (pStatus !== statusFilter) return false;
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const course = (payment.courseName || "").toLowerCase();
          const teacher = (payment.teacherName || "").toLowerCase();
          const student = (payment.studentName || "").toLowerCase();
          const parent = (payment.parentName || "").toLowerCase();
          const enrollment = String(payment.enrollmentID || "").toLowerCase();
          const paymentId = String(payment.paymentID || "").toLowerCase();

          const historyMatch = (payment.history || []).some(
            (h) =>
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
    <div className="w-full space-y-3 sm:space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-1">
        <div>
          <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            My Payments
          </h1>
          <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Track and manage course fee payments and history
          </p>
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing || loading}
            className="px-2.5 sm:px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-1.5 font-medium shadow-xs disabled:opacity-50 cursor-pointer"
            title="Refresh payments"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 ${
                isRefreshing ? "animate-spin" : ""
              }`}
            />
            <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
          </button>

          <button
            onClick={() => setShowFilterPanel((prev) => !prev)}
            className={`px-2.5 sm:px-3 py-1.5 text-xs rounded-lg transition-colors flex items-center gap-1.5 font-medium shadow-xs cursor-pointer ${
              showFilterPanel || activeFilterCount > 0
                ? "bg-indigo-50 border border-indigo-300 text-indigo-700 dark:bg-indigo-900/40 dark:border-indigo-700 dark:text-indigo-300 font-bold"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filter</span>
            {activeFilterCount > 0 && (
              <span className="bg-indigo-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        <StatsCard
          title="Total Courses"
          value={stats.count}
          icon={<BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500" />}
          valueColor="text-blue-600 dark:text-blue-400"
        />
        <StatsCard
          title="Total Amount"
          value={`LKR ${formatCurrency(stats.total)}`}
          icon={<DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />}
          valueColor="text-gray-900 dark:text-white"
        />
        <StatsCard
          title="Total Paid"
          value={`LKR ${formatCurrency(stats.paid)}`}
          icon={<CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" />}
          valueColor="text-green-600 dark:text-green-400"
        />
        <StatsCard
          title="Total Balance"
          value={`LKR ${formatCurrency(stats.balance)}`}
          icon={<AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500" />}
          valueColor="text-red-500 dark:text-red-400"
        />
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-2.5 sm:p-3 shadow-xs border border-gray-200/90 dark:border-gray-700 space-y-2">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
          {/* Search input */}
          <div className="relative flex-1 min-w-0">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search course, teacher, reference #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1.5 focus:ring-indigo-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Pills */}
          <div className="inline-flex rounded-lg bg-gray-100 dark:bg-gray-900/80 p-0.5 shrink-0 overflow-x-auto text-xs">
            {[
              { key: "ALL", label: "All", count: statusCounts.ALL },
              { key: "PAID", label: "Paid", count: statusCounts.PAID },
              { key: "PARTIAL", label: "Partial", count: statusCounts.PARTIAL },
              { key: "UNPAID", label: "Unpaid", count: statusCounts.UNPAID },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`px-2 sm:px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  statusFilter === tab.key
                    ? "bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-xs"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Filter panel */}
        {showFilterPanel && (
          <div className="pt-2 border-t border-gray-100 dark:border-gray-700/60 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-gray-500 dark:text-gray-400 text-[11px] font-medium shrink-0">
                Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-2 py-1 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="newest">Newest First</option>
                <option value="amount-high-low">Total Amount (High to Low)</option>
                <option value="amount-low-high">Total Amount (Low to High)</option>
                <option value="balance-high">Highest Balance Due</option>
              </select>
            </div>

            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-xs text-red-600 dark:text-red-400 hover:underline font-medium flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3 h-3" />
                Reset Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Loading payment data...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="p-3.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-center">
          <p className="text-xs text-red-600 dark:text-red-400 font-medium">{error}</p>
          <button
            onClick={handleRefresh}
            className="mt-2 px-3 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Payment cards list */}
      {!loading && !error && (
        <div className="space-y-2.5 sm:space-y-3">
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
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 text-center">
              <CreditCard className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-1">
                {data && data.length > 0 ? "No Matching Payments" : "No Payments Found"}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                {data && data.length > 0
                  ? "No payment records match your search or filter criteria."
                  : "You don't have any payment records yet. Payments will appear here once processed."}
              </p>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="mt-3 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition-colors cursor-pointer"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentView;