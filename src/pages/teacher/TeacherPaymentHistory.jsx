import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  CreditCard, 
  Calendar, 
  DollarSign, 
  Search, 
  RefreshCw, 
  User, 
  Plus, 
  ChevronDown, 
  ChevronUp, 
  ChevronsUpDown, 
  Clock, 
  CheckCircle2, 
  X
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import CustomSelect from "../../components/common/CustomSelect";
import StatsCard from "../../components/common/StatsCard";

const PAYMENT_METHOD_OPTIONS = [
  { value: "Cash", label: "Cash" },
  { value: "Credit Card", label: "Credit Card" },
  { value: "Debit Card", label: "Debit Card" },
  { value: "Bank Transfer", label: "Bank Transfer" },
  { value: "Cheque", label: "Cheque" },
  { value: "Online Payment", label: "Online Payment" },
];

const TeacherPaymentHistory = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("active");

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
        if (
          st === "inactive" ||
          st === "false" ||
          st === "0" ||
          st === "deactive" ||
          st === "disabled"
        )
          return false;
      }
    }

    if (item.studentIsActive !== undefined && item.studentIsActive !== null)
      return Boolean(item.studentIsActive);
    if (item.isStudentActive !== undefined && item.isStudentActive !== null)
      return Boolean(item.isStudentActive);
    if (item.studentActive !== undefined && item.studentActive !== null)
      return Boolean(item.studentActive);

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

  const totalReceived = currentTabRecords.reduce((s, x) => s + (Number(x.paidAmount) || 0), 0);
  const pendingBalance = currentTabRecords.reduce((s, x) => s + (Number(x.balanceAmount) || 0), 0);
  const totalExpected = currentTabRecords.reduce((s, x) => s + (Number(x.totalAmount) || 0), 0);
  const completionRate = totalExpected > 0 ? Math.round((totalReceived / totalExpected) * 100) : 0;

  const stats = {
    totalStudents: currentTabRecords.length,
    totalReceived,
    pendingBalance,
    completionRate,
  };

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

  const formatCurrency = (n) =>
    `Rs. ${Number(n || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "-";

  const getStatusColor = (status) => {
    switch (String(status || "").toUpperCase()) {
      case "PAID":
        return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-green-200 dark:border-green-800/40";
      case "PARTIAL":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800/40";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600";
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
      const name =
        c.courseName ||
        c.CourseName ||
        c.name ||
        c.Name ||
        c.title ||
        c.Title ||
        c.course_Name;
      if (name) return String(name).trim();
    }

    const ecName =
      p.enrollment?.courseName ||
      p.enrollment?.CourseName ||
      p.enrollment?.course_Name ||
      p.enrollment?.courseTitle ||
      p.enrollment?.CourseTitle;
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
      const name =
        s.subjectName ||
        s.SubjectName ||
        s.name ||
        s.Name ||
        s.title ||
        s.Title ||
        s.subject_Name;
      if (name) return String(name).trim();
    }

    const esName =
      p.enrollment?.subjectName ||
      p.enrollment?.SubjectName ||
      p.enrollment?.subject_Name ||
      p.enrollment?.className ||
      p.enrollment?.ClassName ||
      p.enrollment?.subjectTitle ||
      p.enrollment?.SubjectTitle;
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

  const allExpanded =
    filtered.length > 0 && filtered.every((p) => expanded[p.paymentID]);

  const toggleAll = (expand) => {
    if (expand) {
      const allExp = {};
      filtered.forEach((p) => {
        allExp[p.paymentID] = true;
      });
      setExpanded(allExp);
    } else {
      setExpanded({});
    }
  };

  // Add Installment modal component
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
        const userId =
          window.localStorage.getItem("userId") ||
          window.sessionStorage.getItem("userId") ||
          "101";
        const genRef = `REF-${payment.enrollmentID || payment.paymentID}-${Math.floor(
          Math.random() * 900000 + 100000
        )}`;
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
      let s = String(val).replace(/,/g, "").replace(/[^\d.]/g, "");
      if (s === "") return "";
      const parts = s.split(".");
      const intPartRaw = parts[0] || "0";
      const decPartRaw = parts[1] || "";
      const intPartClean = intPartRaw.replace(/^0+(?=\d)/, "") || "0";
      const intPartNum = Number(intPartClean) || 0;
      const intPart = intPartNum.toLocaleString("en-US");
      const decPart = decPartRaw.slice(0, 2);
      return decPart ? `${intPart}.${decPart}` : intPart;
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      if (name === "AmountPaid") {
        const cleaned = String(value).replace(/,/g, "").replace(/[^\d.]/g, "");
        const parts = cleaned.split(".").slice(0, 2);
        const normalized =
          parts.length === 2 ? `${parts[0]}.${parts[1].slice(0, 2)}` : parts[0];
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
        const token =
          window.localStorage.getItem("token") || window.sessionStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token?.replace(/^"|"$/g, "")}`,
          "Content-Type": "application/json",
        };

        const payload = {
          ...formData,
          AmountPaid: parseFloat(String(formData.AmountPaid).replace(/,/g, "")) || 0,
          PaymentID: parseInt(formData.PaymentID),
          CreatedBy: parseInt(formData.CreatedBy),
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

    const formatBalance = (val) => {
      const num =
        typeof val === "number" ? val : parseFloat(String(val || 0).replace(/,/g, "")) || 0;
      return num.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    };

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-sm w-full max-h-[92vh] overflow-y-auto border border-gray-200 dark:border-gray-700 animate-fadeIn">
          <div className="p-3.5 sm:p-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Add Installment
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {modalError && (
              <div className="mt-2.5 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-[11px] text-red-600 dark:text-red-400">{modalError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-3 space-y-2.5 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-0.5">
                    Payment ID
                  </label>
                  <input
                    type="text"
                    value={formData.PaymentID}
                    disabled
                    className="w-full px-2.5 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-0.5">
                    Balance (LKR)
                  </label>
                  <input
                    type="text"
                    value={formatBalance(payment?.balanceAmount)}
                    disabled
                    className="w-full px-2.5 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-amber-600 dark:text-amber-400 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-700 dark:text-gray-300 mb-0.5">
                  Amount Paid (LKR) *
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  name="AmountPaid"
                  value={formData.AmountPaid}
                  onChange={handleChange}
                  required
                  placeholder="0.00"
                  className="w-full px-2.5 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-medium focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-700 dark:text-gray-300 mb-0.5">
                  Payment Method
                </label>
                <CustomSelect
                  name="PaymentMethod"
                  value={formData.PaymentMethod}
                  onChange={(val) =>
                    setFormData((p) => ({ ...p, PaymentMethod: val }))
                  }
                  options={PAYMENT_METHOD_OPTIONS}
                  placeholder="Select method"
                  searchable={false}
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-700 dark:text-gray-300 mb-0.5">
                  Reference Number
                </label>
                <input
                  type="text"
                  name="ReferenceNo"
                  value={formData.ReferenceNo}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-700 dark:text-gray-300 mb-0.5">
                  Remarks
                </label>
                <textarea
                  name="Remarks"
                  value={formData.Remarks}
                  onChange={handleChange}
                  rows="2"
                  placeholder="Optional note"
                  className="w-full px-2.5 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loadingModal}
                  className="flex-1 px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loadingModal || isFullyPaid}
                  className="flex-1 px-3 py-1.5 bg-indigo-600 text-white rounded-lg disabled:opacity-50 text-xs font-medium hover:bg-indigo-700 transition-colors shadow-xs"
                >
                  {loadingModal ? "Processing..." : "Add Installment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full space-y-3 sm:space-y-4">
      <AddInstallmentModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedPayment(null);
        }}
        payment={selectedPayment}
        onSuccess={fetchPayments}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-1">
        <div>
          <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            Student Payments
          </h1>
          <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Track and manage student fee payments and installments
          </p>
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0">
          <button
            onClick={fetchPayments}
            className="px-2.5 sm:px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-1.5 font-medium shadow-xs"
            title="Refresh payments"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        <StatsCard
          title="Total Students"
          value={stats.totalStudents}
          icon={<User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500" />}
          valueColor="text-blue-600 dark:text-blue-400"
        />
        <StatsCard
          title="Total Received"
          value={formatCurrency(stats.totalReceived)}
          icon={<DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" />}
          valueColor="text-green-600 dark:text-green-400"
        />
        <StatsCard
          title="Pending Balance"
          value={formatCurrency(stats.pendingBalance)}
          icon={<Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />}
          valueColor="text-amber-600 dark:text-amber-400"
        />
        <StatsCard
          title="Completion Rate"
          value={`${stats.completionRate}%`}
          icon={<CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-500" />}
          valueColor="text-indigo-600 dark:text-indigo-400"
        />
      </div>

      {/* Search & Tabs Controls Box */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-2.5 sm:p-3 shadow-xs border border-gray-200/90 dark:border-gray-700 space-y-2">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student, course, class, enrollment ID..."
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1.5 focus:ring-indigo-500"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
            {filtered.length > 0 && (
              <button
                onClick={() => toggleAll(!allExpanded)}
                className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 py-1 px-1.5"
              >
                <ChevronsUpDown className="w-3.5 h-3.5" />
                <span>{allExpanded ? "Collapse All" : "Expand All"}</span>
              </button>
            )}
            <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
              {filtered.length} record{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center justify-between pt-1 border-t border-gray-100 dark:border-gray-700/60 text-xs">
          <div className="inline-flex rounded-lg bg-gray-100 dark:bg-gray-900/80 p-0.5 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab("active")}
              className={`px-2 sm:px-2.5 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === "active"
                  ? "bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-xs"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              <span>Active Students</span>
              <span
                className={`ml-1 px-1.5 py-0.2 text-[10px] rounded-full font-bold ${
                  activeTab === "active"
                    ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300"
                    : "bg-gray-200/80 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                }`}
              >
                {activeRecords.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("inactive")}
              className={`px-2 sm:px-2.5 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === "inactive"
                  ? "bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-xs"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
              <span>Inactive Students</span>
              <span
                className={`ml-1 px-1.5 py-0.2 text-[10px] rounded-full font-bold ${
                  activeTab === "inactive"
                    ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300"
                    : "bg-gray-200/80 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                }`}
              >
                {inactiveRecords.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Loading payments...</p>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <p className="text-xs text-red-700 dark:text-red-300">{String(error)}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <DollarSign className="w-10 h-10 mx-auto text-gray-400 dark:text-gray-600 mb-2" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
            No {activeTab === "active" ? "active" : "inactive"} student payments found
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            {search
              ? `No payment records match "${search}".`
              : `No payment records available for ${activeTab} students at the moment.`}
          </p>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="mt-2 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            >
              Clear search
            </button>
          )}
        </div>
      )}

      {/* Payment Cards List */}
      {!loading && !error && filtered.length > 0 && (
        <div className="space-y-2.5 sm:space-y-3">
          {filtered.map((p) => {
            const isExpanded = !!expanded[p.paymentID];
            const courseTitle = getCourseName(p);
            const classTitle = getSubjectName(p);
            const isFullyPaid =
              String(p.status || "").toUpperCase() === "PAID" ||
              Number(p.balanceAmount || 0) <= 0;

            return (
              <div
                key={p.paymentID}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200/90 dark:border-gray-700 shadow-xs overflow-hidden transition-all duration-150"
              >
                {/* Header */}
                <div className="p-2.5 sm:p-3.5 border-b border-gray-100 dark:border-gray-700/80">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                        <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate">
                            {p.studentName}
                          </h3>
                          <span
                            className={`px-1.5 py-0.2 rounded-full text-[10px] font-medium border ${getStatusColor(
                              p.status
                            )}`}
                          >
                            {p.status}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">
                          {courseTitle !== "—" && (
                            <span className="text-indigo-600 dark:text-indigo-400 font-medium truncate max-w-[140px] sm:max-w-none">
                              {courseTitle}
                            </span>
                          )}
                          {classTitle !== "—" && (
                            <>
                              <span className="text-gray-300 dark:text-gray-600">•</span>
                              <span className="text-purple-600 dark:text-purple-400 truncate max-w-[120px] sm:max-w-none">
                                {classTitle}
                              </span>
                            </>
                          )}
                          <span className="text-gray-300 dark:text-gray-600">•</span>
                          <span>Enroll #{p.enrollmentID || "—"}</span>
                          <span className="text-gray-300 dark:text-gray-600">•</span>
                          <span>Pay ID #{p.paymentID}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                      {!isFullyPaid && (
                        <button
                          onClick={() => {
                            setSelectedPayment(p);
                            setShowModal(true);
                          }}
                          className="flex items-center gap-1 px-2.5 py-1 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition-colors shadow-xs"
                          title="Add Installment"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add</span>
                        </button>
                      )}

                      <button
                        onClick={() => toggle(p.paymentID)}
                        className="flex items-center gap-1 px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Hide</span>
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Details</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3 Metric Tiles (Total, Paid, Balance) */}
                <div className="p-2 sm:p-2.5 m-2.5 sm:m-3 mb-2.5 bg-gray-50/70 dark:bg-gray-900/40 rounded-lg grid grid-cols-3 gap-1.5 sm:gap-2 border border-gray-100/80 dark:border-gray-800">
                  <div className="text-center min-w-0">
                    <div className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold uppercase">
                      Total
                    </div>
                    <div
                      className="text-xs sm:text-sm md:text-base font-bold text-gray-900 dark:text-white mt-0.5 truncate"
                      title={formatCurrency(p.totalAmount)}
                    >
                      {formatCurrency(p.totalAmount)}
                    </div>
                  </div>

                  <div className="text-center min-w-0 border-x border-gray-200 dark:border-gray-700/60 px-1">
                    <div className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold uppercase">
                      Paid
                    </div>
                    <div
                      className="text-xs sm:text-sm md:text-base font-bold text-green-600 dark:text-green-400 mt-0.5 truncate"
                      title={formatCurrency(p.paidAmount)}
                    >
                      {formatCurrency(p.paidAmount)}
                    </div>
                  </div>

                  <div className="text-center min-w-0">
                    <div className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold uppercase">
                      Balance
                    </div>
                    <div
                      className={`text-xs sm:text-sm md:text-base font-bold mt-0.5 truncate ${
                        p.balanceAmount > 0
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-green-600 dark:text-green-400"
                      }`}
                      title={formatCurrency(p.balanceAmount)}
                    >
                      {formatCurrency(p.balanceAmount)}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-2.5 sm:p-3 bg-gray-50/50 dark:bg-gray-900/30 border-t border-gray-100 dark:border-gray-700/80 space-y-2.5 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Payment History</span>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400">
                          ({p.history?.length || 0})
                        </span>
                      </h4>
                    </div>

                    {!p.history || p.history.length === 0 ? (
                      <div className="text-center py-3 text-xs text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                        No installment records available
                      </div>
                    ) : (
                      <div className="space-y-1.5 max-h-44 overflow-y-auto pr-0.5">
                        {p.history.map((h, index) => (
                          <div
                            key={h.paymentHistoryID || index}
                            className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 text-xs"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="flex items-center justify-center w-4 h-4 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 font-bold text-[9px] shrink-0">
                                    {index + 1}
                                  </span>
                                  <span className="font-semibold text-gray-800 dark:text-gray-200 truncate text-[11px] sm:text-xs">
                                    {formatDate(h.paymentDate)}
                                  </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                                  <span className="px-1.5 py-0.2 bg-gray-100 dark:bg-gray-700 rounded font-medium text-gray-600 dark:text-gray-300">
                                    {h.paymentMethod}
                                  </span>
                                  {h.referenceNo && (
                                    <>
                                      <span>•</span>
                                      <span>Ref: {h.referenceNo}</span>
                                    </>
                                  )}
                                  {h.createdBy && (
                                    <>
                                      <span>•</span>
                                      <span>By: #{h.createdBy}</span>
                                    </>
                                  )}
                                </div>
                                {h.remarks && (
                                  <p className="mt-1 text-[10px] text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 p-1.5 rounded">
                                    Note: {h.remarks}
                                  </p>
                                )}
                              </div>

                              <div className="text-left sm:text-right pt-1 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-gray-700 shrink-0">
                                <span className="text-xs sm:text-sm font-bold text-green-600 dark:text-green-400">
                                  {formatCurrency(h.amountPaid)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Mini Progress Card */}
                    <div className="p-2 sm:p-2.5 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                      <div className="flex items-center justify-between text-[11px] text-gray-600 dark:text-gray-400 mb-1">
                        <span>Payment Progress</span>
                        <span className="font-bold text-gray-900 dark:text-white">
                          {Math.round(
                            (p.paidAmount / (p.totalAmount || 1)) * 100
                          )}
                          %
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.max(
                                0,
                                (p.paidAmount / (p.totalAmount || 1)) * 100
                              )
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TeacherPaymentHistory;