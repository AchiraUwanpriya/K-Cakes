import {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import axios from 'axios';
import {useAuth} from './AuthContext';

const norm = (v) => (v === null || v === undefined ? "" : String(v).trim());
const normName = (v) => norm(v).toLowerCase();

const PaymentAccessContext = createContext({
    loading: false,
    access: [],
    locked: [],
    reminders: [],
    lockKey: "",
    isLocked: () => false,
    isLockedByName: () => false,
});

export const PaymentAccessProvider = ({ children }) => {
    const {user} = useAuth();
    const [access, setAccess] = useState([]);
    const [loading, setLoading] = useState(true);

    const studentId = 
        user?.StudentID ?? user?.studentID ?? user?.studentId ??
        user?.UserID ?? user?.userID ?? user?.userId ?? user?.id;

    const load = useCallback(async() => {
        if(!studentId){
            setAccess([]);
            setLoading(false);
            return;
        }
        try{
            const resp = await axios.get(`/Payments/student/${studentId}/access`);
            const list = Array.isArray(resp.data) ? resp.data : [];
            setAccess(
                list.map((a) =>({
                    courseId: a.courseID ?? a.CourseID ?? a.courseId ?? null,
                    subjectId: a.subjectID ?? a.SubjectID ?? a.subjectId ?? null,
                    courseName: a.courseName ?? a.CourseName ?? "",
                    subjectName: a.subjectName ?? a.SubjectName ?? "",
                    blocked: Boolean(a.blocked ?? a.Blocked),
                    showReminder: Boolean(a.showReminder ?? a.ShowReminder),
                    weeksDue: Number(a.weeksDue ?? a.WeeksDue ?? 0),
                    weeksPaid: Number(a.weeksPaid ?? a.WeeksPaid ?? 0),
                    nextDueDate: a.nextDueDate ?? a.NextDueDate ?? null,
                    message: a.message ?? a.Message ?? "",
                }))
            );
        }catch(e){
            setAccess([]);
        }finally{
            setLoading(false);
        }
    }, [studentId]);

    useEffect(() => {
    load();
    const timer = setInterval(load, 60000);
    const onFocus = () => load();
    window.addEventListener("focus", onFocus);
    return () => {
      clearInterval(timer);
      window.removeEventListener("focus", onFocus);
    };
  }, [load]);

  const isLocked = useCallback(
    (courseId, subjectId) => {
      const c = norm(courseId);
      const s = norm(subjectId);
      const matches = access.filter(
        (a) =>
          (!c || norm(a.courseId) === c) && (!s || norm(a.subjectId) === s)
      );
      return matches.length > 0 && matches.every((a) => a.blocked);
    },
    [access]
  );

  const isLockedByName = useCallback(
    (courseName, subjectName) => {
      const c = normName(courseName);
      const s = normName(subjectName);
      const matches = access.filter(
        (a) =>
          (!c || normName(a.courseName) === c) &&
          (!s || normName(a.subjectName) === s)
      );
      return matches.length > 0 && matches.every((a) => a.blocked);
    },
    [access]
  );

  const value = useMemo(() => {
    const locked = access.filter((a) => a.blocked);
    const reminders = access.filter((a) => a.showReminder);
    return {
      loading,
      access,
      locked,
      reminders,
      lockKey: locked.map((a) => `${a.courseId}-${a.subjectId}`).join(","),
      isLocked,
      isLockedByName,
      refresh: load,
    };
  }, [access, loading, isLocked, isLockedByName, load]);

  return (
    <PaymentAccessContext.Provider value={value}>
      {children}
    </PaymentAccessContext.Provider>
  );
};

export const usePaymentAccess = () => useContext(PaymentAccessContext);
