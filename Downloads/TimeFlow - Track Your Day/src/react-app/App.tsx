import { BrowserRouter as Router, Routes, Route } from "react-router";
import { AuthProvider } from "@getmocha/users-service/react";
import LandingPage from "@/react-app/pages/Landing";
import DashboardPage from "@/react-app/pages/Dashboard";
import AuthCallbackPage from "@/react-app/pages/AuthCallback";
import AnalyticsPage from "@/react-app/pages/Analytics";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
