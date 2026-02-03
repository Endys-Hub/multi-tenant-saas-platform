import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { Members } from "./pages/Members";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { RequireRole } from "./components/RequireRole";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/members"
        element={
          <ProtectedRoute>
            <RequireRole role="ORG_ADMIN">
              <Members />
            </RequireRole>
          </ProtectedRoute>
        }
      />

      {/* Redirect root → dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

