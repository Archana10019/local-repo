import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@getmocha/users-service/react";
import { Clock, BarChart3, Calendar, TrendingUp } from "lucide-react";

export default function Landing() {
  const { user, isPending, redirectToLogin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  if (isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="animate-pulse text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-lg rounded-full mb-6 shadow-2xl">
            <Clock className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-6xl font-bold text-white mb-4 tracking-tight">
            TimeFlow
          </h1>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">
            Master your day. Track every minute. Visualize your time like never before.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <Calendar className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Daily Tracking
            </h3>
            <p className="text-purple-200">
              Log activities in minutes and ensure you account for all 1440 minutes of your day
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Visual Analytics
            </h3>
            <p className="text-purple-200">
              Beautiful charts and graphs show exactly how you spend your time
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Insights
            </h3>
            <p className="text-purple-200">
              Discover patterns and optimize how you spend your most valuable resource
            </p>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={redirectToLogin}
            className="group relative inline-flex items-center justify-center px-10 py-4 text-lg font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-600 rounded-full shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 hover:scale-105 overflow-hidden"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="relative">Get Started with Google</span>
          </button>
          <p className="text-purple-300 mt-4 text-sm">
            Start tracking your time in seconds
          </p>
        </div>
      </div>
    </div>
  );
}
