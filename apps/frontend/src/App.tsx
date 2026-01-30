import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import InviteUser from "./pages/InviteUser";
import { RequireRole } from "./components/RequireRole";
import AcceptInvite from "./pages/AcceptInvite";

function Dashboard() {
  return <h1>Dashboard</h1>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/invite"
        element={
          <RequireRole role="ORG_ADMIN">
            <InviteUser />
          </RequireRole>
        }
      />

      <Route path="/accept-invite" element={<AcceptInvite />} />

    </Routes>
  );
}
