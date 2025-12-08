import { Activity } from "@/shared/types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface ActivityTimelineProps {
  activities: Activity[];
}

const COLORS = [
  "#8B5CF6", // purple
  "#EC4899", // pink
  "#3B82F6", // blue
  "#10B981", // green
  "#F59E0B", // amber
  "#EF4444", // red
  "#14B8A6", // teal
  "#F97316", // orange
  "#6366F1", // indigo
  "#84CC16", // lime
];

export default function ActivityTimeline({ activities }: ActivityTimelineProps) {
  const data = activities.map((activity, index) => ({
    name: activity.activity_name.length > 15 
      ? activity.activity_name.substring(0, 15) + "..."
      : activity.activity_name,
    minutes: activity.duration_minutes,
    hours: (activity.duration_minutes / 60).toFixed(1),
    color: COLORS[index % COLORS.length],
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-2 rounded-lg shadow-lg border-2 border-purple-200">
          <p className="font-semibold text-gray-800">{payload[0].payload.name}</p>
          <p className="text-sm text-gray-600">
            {payload[0].payload.hours}h ({payload[0].value} min)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="name" 
            angle={-45} 
            textAnchor="end"
            height={100}
            tick={{ fill: "#6B7280", fontSize: 12 }}
          />
          <YAxis 
            label={{ value: "Minutes", angle: -90, position: "insideLeft" }}
            tick={{ fill: "#6B7280" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="minutes" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
