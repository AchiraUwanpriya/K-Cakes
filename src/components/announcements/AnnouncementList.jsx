import AnnouncementCard from "./AnnouncementCard";
import EmptyState from "../common/EmptyState";

const AnnouncementList = ({ announcements, unreadIds = [], onMarkAsRead }) => {
  return (
    <div className="w-full">
      {announcements.length > 0 ? (
        <div className="space-y-4 stagger-children">
          {announcements.map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
              isUnread={unreadIds.includes(announcement.id)}
              onMarkAsRead={onMarkAsRead}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No announcements"
          description="There are no announcements for this course yet."
        />
      )}
    </div>
  );
};

export default AnnouncementList;
