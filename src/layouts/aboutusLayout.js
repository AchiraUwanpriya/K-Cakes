import { Link, Outlet } from "react-router-dom";
import {useAuth} from "../contexts/AuthContext";
import {INSTITUTE_INFO} from "../services/aboutService";

const AboutusLayout = () => {
    const {isAuthenticated} = useAuth();

    return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link to="/website" className="flex items-center gap-3">
            <img
              src="/Logo.png"
              alt={`${INSTITUTE_INFO.name} logo`}
              className="h-10 w-auto"
            />
            <span className="font-bold text-gray-900 dark:text-white">
              {INSTITUTE_INFO.name}
            </span>
          </Link>

          <Link
            to={isAuthenticated ? "/" : "/login"}
            className="inline-flex items-center px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold shadow-sm transition-colors"
          >
            {isAuthenticated ? "My dashboard" : "Log in"}
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-gray-900 dark:bg-black py-4 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} {INSTITUTE_INFO.name}
      </footer>
    </div>
  );

};

export default AboutusLayout;