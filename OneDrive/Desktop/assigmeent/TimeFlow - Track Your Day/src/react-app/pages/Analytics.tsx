import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAuth } from "@getmocha/users-service/react";
import { format } from "date-fns";
import { Activity } from "@/shared/types";
import Header from "@/react-app/components/Header";
import CategoryChart from "@/react-app/components/CategoryChart";
import ActivityTimeline from "@/react-app/components/ActivityTimeline";
import NoDataView from "@/react-app/components/NoDataView";
import { Loader2, ArrowLeft } from "lucide-react";

export default function Analytics() {
  const { user, isPending } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedDate = searchParams.get("date") || format(new Date(), "yyyy-MM-dd");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending && !user) {
      navigate("/");
    }
  }, [user, isPending, navigate]);

  useEffect(() => {
    if (user) {
      fetchActivities();
    }
  }, [selectedDate, user]);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/activities?date=${selectedDate}`);
      const data = await response.json();
      setActivities(data);
    } catch (error) {
      console.error("Failed to fetch activities:", error);
    } finally {
      setLoading(false);
    }
  };

  if (isPending || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const totalMinutes = activities.reduce((sum, activity) => sum + activity.duration_minutes, 0);
  const categoryData = activities.reduce((acc, activity) => {
    const category = activity.category || "Uncategorized";
    acc[category] = (acc[category] || 0) + activity.duration_minutes;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center text-purple-600 hover:text-purple-700 mb-4 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </button>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Analytics</h1>
            <p className="text-gray-600">
              {format(new Date(selectedDate), "MMMM d, yyyy")}
            </p>
          </div>
        </div>

        {activities.length === 0 ? (
          <NoDataView onStartTracking={() => navigate("/dashboard")} />
        ) : (
          <div className="space-y-8">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100">
                <div className="text-gray-600 text-sm font-medium mb-2">Total Time Logged</div>
                <div className="text-3xl font-bold text-purple-600">
                  {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-pink-100">
                <div className="text-gray-600 text-sm font-medium mb-2">Activities</div>
                <div className="text-3xl font-bold text-pink-600">{activities.length}</div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-indigo-100">
                <div className="text-gray-600 text-sm font-medium mb-2">Categories</div>
                <div className="text-3xl font-bold text-indigo-600">
                  {Object.keys(categoryData).length}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 border border-purple-50">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Time Distribution</h2>
              <CategoryChart categoryData={categoryData} />
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 border border-purple-50">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Activity Timeline</h2>
              <ActivityTimeline activities={activities} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
