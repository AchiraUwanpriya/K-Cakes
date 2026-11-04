import { LockClosedIcon, BellAlertIcon } from "@heroicons/react/24/outline";
import { usePaymentAccess } from "../../contexts/PaymentAccessContext";

const className = (a) =>
  [a.courseName, a.subjectName].filter(Boolean).join(" / ") || "Class";

const PaymentBanner = () => {
  const { locked, reminders } = usePaymentAccess();

  if (!locked.length && !reminders.length) return null;

  return (
    <div className="mb-4 space-y-3">
      {locked.length > 0 && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-800/60 dark:bg-rose-900/20">
          <div className="flex items-start gap-3">
            <LockClosedIcon className="mt-0.5 h-5 w-5 shrink-0 text-rose-600 dark:text-rose-300" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-rose-800 dark:text-rose-200">
                Some of your classes are locked
              </p>
              <p className="mt-0.5 text-sm text-rose-700 dark:text-rose-300">
                Courses, materials, attendance, schedule and reports for these
                classes are unavailable until the weekly payment is made. Please
                pay your teacher. Access returns as soon as the payment is
                recorded.
              </p>
              <ul className="mt-2 space-y-1 text-sm text-rose-800 dark:text-rose-200">
                {locked.map((a) => {
                  const behind = Math.max(a.weeksDue - a.weeksPaid, 0);
                  return (
                    <li key={`${a.courseId}-${a.subjectId}`}>
                      <span className="font-medium">{className(a)}</span>
                      {behind > 0
                        ? ` - ${behind} week${behind > 1 ? "s" : ""} unpaid`
                        : ""}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      )}

      {reminders.map((a) => (
        <div
          key={`r-${a.courseId}-${a.subjectId}`}
          className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800/60 dark:bg-amber-900/20"
        >
          <BellAlertIcon className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-300" />
          <p className="text-sm text-amber-800 dark:text-amber-200">
            {a.message || "Your weekly payment is due soon."}
          </p>
        </div>
      ))}
    </div>
  );
};

export default PaymentBanner;