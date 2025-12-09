import { Calendar, Plus } from "lucide-react";

interface NoDataViewProps {
  onStartTracking: () => void;
}

export default function NoDataView({ onStartTracking }: NoDataViewProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-purple-100">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full mb-4">
            <Calendar className="w-12 h-12 text-purple-600" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          No Data Available
        </h2>

        <p className="text-gray-600 mb-8 text-lg">
          You haven't logged any activities for this date yet. Start tracking your time to see beautiful analytics and insights about how you spend your day.
        </p>

        <button
          onClick={onStartTracking}
          className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          <span>Start Logging Your Day</span>
        </button>

        <div className="mt-12 grid grid-cols-3 gap-4 text-sm text-gray-500">
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="font-semibold text-purple-600 mb-1">24 Hours</div>
            <div>Total time to track</div>
          </div>
          <div className="p-4 bg-pink-50 rounded-lg">
            <div className="font-semibold text-pink-600 mb-1">1440 Minutes</div>
            <div>Every minute counts</div>
          </div>
          <div className="p-4 bg-indigo-50 rounded-lg">
            <div className="font-semibold text-indigo-600 mb-1">Unlimited</div>
            <div>Categories to choose</div>
          </div>
        </div>
      </div>
    </div>
  );
}
