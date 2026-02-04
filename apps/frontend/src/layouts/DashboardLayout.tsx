import { useAuth } from "../auth/useAuth";
import { NavLink, Outlet } from "react-router-dom";
import { RequireRole } from "../components/RequireRole";

export const DashboardLayout = () => {
  const { auth, logout } = useAuth();

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `block px-3 py-2 rounded ${
      isActive
        ? "bg-gray-200 font-medium text-gray-900"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r p-4">
        <h2 className="text-xl font-bold mb-6">SaaS Dashboard</h2>

        <nav className="space-y-2">
          <NavLink to="/dashboard" className={navClass}>
            Dashboard
          </NavLink>

          <RequireRole role="ORG_ADMIN">
            <NavLink to="/members" className={navClass}>
              Members
            </NavLink>
          </RequireRole>
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="bg-white border-b px-6 py-3 flex justify-between items-center">
          <span className="text-sm text-gray-600">
            Role: {auth.role}
          </span>

          <button
            onClick={logout}
            className="text-sm text-red-600 hover:underline"
          >
            Logout
          </button>
        </header>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};


