import { useRef, useState } from "react";
import {useAuth} from "../contexts/AuthContext";
import {USER_GUIDE} from "../utils/userGuideData";

const UserGuide = () => {
    const {user} = useAuth();
    const [videoFailed, setVideoFailed] = useState(false);
    const videoRef = useRef(null);

    // Jump the video to a given second and play it
    const seekTo = (seconds) => {
      const video = videoRef.current;
      if (!video) return;
      video.currentTime = seconds;
      video.play().catch(() => {});
      video.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    const formatTime = (seconds) => {
      const m = Math.floor(seconds / 60);
      const s = String(Math.floor(seconds % 60)).padStart(2, "0");
      return `${m}:${s}`;
    };

    const role = String(user?.userType || "").toLowerCase();
    const guide = USER_GUIDE[role] || USER_GUIDE.student;
    
     return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 page-enter">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        {guide.title}
      </h1>
      <p className="mt-1 text-gray-600 dark:text-gray-300">
        Watch the video, then use the written steps below whenever you need a
        reminder.
      </p>

      {/* Video */}
      <div className="mt-6 rounded-2xl overflow-hidden bg-black shadow-lg">
        {videoFailed ? (
          <div className="aspect-video flex items-center justify-center px-6 text-center text-sm text-gray-300">
            The guide video is not available right now. Please use the written
            steps below.
          </div>
        ) : (
          <video
            key={guide.video}
            ref={videoRef}
            className="w-full aspect-video"
            controls
            preload="metadata"
            onError={() => setVideoFailed(true)}
          >
            <source src={guide.video} type="video/mp4" />
            Your browser does not support video playback.
          </video>
        )}
      </div>

      {/* Written steps */}
      <h2 className="mt-10 mb-4 text-xl font-bold text-gray-900 dark:text-white">
        Written steps
      </h2>
      <div className="space-y-3">
        {guide.sections.map((section, index) => (
          <details
            key={section.title}
            open={index === 0}
            className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            <summary className="cursor-pointer select-none list-none flex items-center justify-between px-5 py-4 font-semibold text-gray-900 dark:text-white">
              {section.title}
              <span className="text-rose-600 dark:text-rose-400 transition-transform group-open:rotate-45 text-xl leading-none">
                +
              </span>
            </summary>
            {section.time !== undefined && (
              <div className="px-5 pb-3">
                <button
                  type="button"
                  onClick={() => seekTo(section.time)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 text-xs font-semibold hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors"
                >
                  &#9654; Watch this part ({formatTime(section.time)})
                </button>
              </div>
            )}
            <ol className="list-decimal list-inside space-y-2 px-5 pb-5 text-sm text-gray-700 dark:text-gray-300">
              {section.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </details>
        ))}
      </div>
    </div>
  );
};

export default UserGuide;