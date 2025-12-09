import { Clock } from "lucide-react";

interface TimeProgressProps {
  totalMinutes: number;
  remainingMinutes: number;
}

export default function TimeProgress({ totalMinutes, remainingMinutes }: TimeProgressProps) {
  const percentage = (totalMinutes / 1440) * 100;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const remainingHours = Math.floor(remainingMinutes / 60);
  const remainingMins = remainingMinutes % 60;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
          <Clock className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Time Progress</h2>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Logged</span>
            <span className="font-semibold">
              {hours}h {minutes}m / 24h
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 rounded-full"
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="bg-purple-50 rounded-xl p-3">
            <div className="text-xs text-purple-600 font-medium mb-1">Remaining</div>
            <div className="text-lg font-bold text-purple-700">
              {remainingHours}h {remainingMins}m
            </div>
          </div>

          <div className="bg-pink-50 rounded-xl p-3">
            <div className="text-xs text-pink-600 font-medium mb-1">Progress</div>
            <div className="text-lg font-bold text-pink-700">
              {percentage.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
