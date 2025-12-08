import { useState } from "react";
import { Activity } from "@/shared/types";
import { Trash2, Edit2, X, Check } from "lucide-react";

interface ActivityListProps {
  activities: Activity[];
  onActivityDeleted: () => void;
  onActivityUpdated: () => void;
}

export default function ActivityList({
  activities,
  onActivityDeleted,
  onActivityUpdated,
}: ActivityListProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: "", category: "", duration: "" });

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this activity?")) return;

    try {
      await fetch(`/api/activities/${id}`, { method: "DELETE" });
      onActivityDeleted();
    } catch (error) {
      console.error("Failed to delete activity:", error);
    }
  };

  const startEdit = (activity: Activity) => {
    setEditingId(activity.id);
    setEditForm({
      name: activity.activity_name,
      category: activity.category || "",
      duration: activity.duration_minutes.toString(),
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: "", category: "", duration: "" });
  };

  const saveEdit = async (activity: Activity) => {
    try {
      const response = await fetch(`/api/activities/${activity.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activity_name: editForm.name,
          category: editForm.category || null,
          duration_minutes: parseInt(editForm.duration),
          activity_date: activity.activity_date,
        }),
      });

      if (!response.ok) throw new Error("Failed to update");

      setEditingId(null);
      onActivityUpdated();
    } catch (error) {
      console.error("Failed to update activity:", error);
    }
  };

  const getCategoryColor = (category: string | null) => {
    const colors: Record<string, string> = {
      Work: "bg-blue-100 text-blue-700",
      Study: "bg-green-100 text-green-700",
      Sleep: "bg-indigo-100 text-indigo-700",
      Exercise: "bg-red-100 text-red-700",
      Entertainment: "bg-purple-100 text-purple-700",
      Meals: "bg-orange-100 text-orange-700",
      Commute: "bg-yellow-100 text-yellow-700",
      Social: "bg-pink-100 text-pink-700",
      Hobbies: "bg-teal-100 text-teal-700",
      Other: "bg-gray-100 text-gray-700",
    };
    return colors[category || "Other"] || colors.Other;
  };

  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-purple-100 text-center">
        <div className="text-gray-400 mb-4">
          <svg
            className="w-16 h-16 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No Activities Yet</h3>
        <p className="text-gray-500 text-sm">
          Start adding activities to track your day
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Today's Activities ({activities.length})
      </h2>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="border-2 border-gray-100 rounded-xl p-4 hover:border-purple-200 transition-colors"
          >
            {editingId === activity.id ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:outline-none"
                />
                <input
                  type="number"
                  value={editForm.duration}
                  onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:outline-none"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() => saveEdit(activity)}
                    className="flex items-center space-x-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="flex items-center space-x-1 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-gray-800">
                      {activity.activity_name}
                    </h3>
                    {activity.category && (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                          activity.category
                        )}`}
                      >
                        {activity.category}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {Math.floor(activity.duration_minutes / 60)}h{" "}
                    {activity.duration_minutes % 60}m
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => startEdit(activity)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(activity.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
