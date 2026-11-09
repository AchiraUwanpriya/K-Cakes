import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Card from "../../components/common/Card";
import StatusTabs from "../../components/common/StatusTabs";
import AnnouncementList from "../../components/announcements/AnnouncementList";
import {
  getAnnouncementsForStudent,
  isAnnouncementExpired,
} from "../../services/announcementService";

const resolveStudentId = (user) => {
  if (!user || typeof user !== "object") return null;
  return (
    user.StudentID ??
    user.studentID ??
    user.studentId ??
    user.Student?.StudentID ??
    user.student?.StudentID ??
    user.UserID ??
    user.userID ??
    user.userId ??
    user.id ??
    null
  );
};

const StudentNoticesPage = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("active");

  useEffect(() => {
    const studentId = resolveStudentId(user);
    if (!studentId) {
      setLoading(false);
      return;
    }

    let isActive = true;
    const load = async () => {
      setLoading(true);
      try {
        const data = await getAnnouncementsForStudent(studentId, {
          includeExpired: true,
        });
        if (!isActive) return;
        setAnnouncements(Array.isArray(data) ? data : []);
        setError("");
      } catch (err) {
        if (!isActive) return;
        console.error("Failed to load notices", err);
        setAnnouncements([]);
        setError(
          err?.response?.data?.message || err?.message || "Network error"
        );
      } finally {
        if (isActive) setLoading(false);
      }
    };
    load();

    return () => {
      isActive = false;
    };
  }, [user]);

  const { activeItems, expiredItems } = useMemo(() => {
    const sorted = [...announcements]
      .filter(Boolean)
      .sort((a, b) => new Date(b.postDate) - new Date(a.postDate));
    return {
      activeItems: sorted.filter((a) => !isAnnouncementExpired(a)),
      expiredItems: sorted.filter((a) => isAnnouncementExpired(a)),
    };
  }, [announcements]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
          Notices
        </h1>
        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
          Updates from your instructors and the academy
        </p>
      </div>

      <Card className="p-6">
        {loading ? (
          <div className="text-sm text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-sm text-red-600">
            {error}. Please verify the backend service is reachable.
          </div>
        ) : (
          <div className="space-y-4">
            <StatusTabs
              active={tab}
              onChange={setTab}
              tabs={[
                {
                  id: "active",
                  label: "Active",
                  dot: "bg-emerald-500",
                  count: activeItems.length,
                },
                {
                  id: "expired",
                  label: "Expired",
                  dot: "bg-gray-400",
                  count: expiredItems.length,
                },
              ]}
            />
            <AnnouncementList
              announcements={tab === "active" ? activeItems : expiredItems}
              showDates={false}
              emptyTitle={
                tab === "active" ? "No active notices" : "No expired notices"
              }
              emptyDescription={
                tab === "active"
                  ? "There are no notices for you right now."
                  : "Notices move here after their expiry date and time."
              }
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default StudentNoticesPage;