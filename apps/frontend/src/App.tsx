import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { Members } from "./pages/Members";
import AcceptInvite from "./pages/AcceptInvite";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { RequireRole } from "./components/RequireRole";
import { DashboardLayout } from "./layouts/DashboardLayout";

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />

      <Route path="/accept-invite" element={<AcceptInvite />} />

      {/* Protected app */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Default dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />

        <Route path="dashboard" element={<Dashboard />} />

        <Route
          path="members"
          element={
            <RequireRole role="ORG_ADMIN">
              <Members />
            </RequireRole>
          }
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}


