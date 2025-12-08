import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@getmocha/users-service/react";
import { format } from "date-fns";
import { Activity } from "@/shared/types";
import Header from "@/react-app/components/Header";
import ActivityForm from "@/react-app/components/ActivityForm";
import ActivityList from "@/react-app/components/ActivityList";
import DateSelector from "@/react-app/components/DateSelector";
import TimeProgress from "@/react-app/components/TimeProgress";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const { user, isPending } = useAuth();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);

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

  const totalMinutes = activities.reduce((sum, activity) => sum + activity.duration_minutes, 0);
  const remainingMinutes = 1440 - totalMinutes;
  const canAnalyze = totalMinutes > 0;

  const handleAnalyze = () => {
    navigate(`/analytics?date=${selectedDate}`);
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Track Your Day</h1>
          <p className="text-gray-600">Log your activities and see how you spend your time</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <DateSelector selectedDate={selectedDate} onDateChange={setSelectedDate} />
          <TimeProgress totalMinutes={totalMinutes} remainingMinutes={remainingMinutes} />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <ActivityForm 
              selectedDate={selectedDate} 
              remainingMinutes={remainingMinutes}
              onActivityAdded={fetchActivities}
            />
          </div>

          <div>
            {loading ? (
              <div className="bg-white rounded-2xl shadow-lg p-8 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
              </div>
            ) : (
              <ActivityList 
                activities={activities} 
                onActivityDeleted={fetchActivities}
                onActivityUpdated={fetchActivities}
              />
            )}
          </div>
        </div>

        {canAnalyze && (
          <div className="mt-8 text-center">
            <button
              onClick={handleAnalyze}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Analyze This Day
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
