import AnnouncementCard from "./AnnouncementCard";
import EmptyState from "../common/EmptyState";

const AnnouncementList = ({
  announcements = [],
  unreadIds = [],
  onMarkAsRead,
  maxHeight = "max-h-[480px]",
  emptyTitle = "No announcements",
  emptyDescription = "There are no announcements available."
}) => {
  return (
    <div className="w-full">
      {announcements.length > 0 ? (
        <div className={`space-y-4 ${maxHeight ? `${maxHeight} overflow-y-auto pr-2 custom-scrollbar` : ""}`}>
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
          title={emptyTitle}
          description={emptyDescription}
        />
      )}
    </div>
  );
};

export default AnnouncementList;
