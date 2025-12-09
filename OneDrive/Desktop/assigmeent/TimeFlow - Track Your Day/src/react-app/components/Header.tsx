import { useAuth } from "@getmocha/users-service/react";
import { useNavigate } from "react-router";
import { Clock, LogOut, BarChart3, Home } from "lucide-react";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-purple-100 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div 
            onClick={() => navigate("/dashboard")}
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              TimeFlow
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-purple-600 transition-colors rounded-lg hover:bg-purple-50"
            >
              <Home className="w-5 h-5" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>

            <button
              onClick={() => navigate("/analytics")}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-purple-600 transition-colors rounded-lg hover:bg-purple-50"
            >
              <BarChart3 className="w-5 h-5" />
              <span className="hidden sm:inline">Analytics</span>
            </button>

            <div className="flex items-center space-x-3 px-4 py-2 bg-purple-50 rounded-lg">
              {user?.google_user_data?.picture && (
                <img
                  src={user.google_user_data.picture}
                  alt={user.google_user_data.name || "User"}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <span className="text-sm text-gray-700 hidden sm:inline">
                {user?.google_user_data?.name || user?.email}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
