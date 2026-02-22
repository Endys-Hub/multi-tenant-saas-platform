import { useEffect, useState } from "react";
import { useAuth } from "../auth/useAuth";
import { NavLink, Outlet } from "react-router-dom";
import { RequireRole } from "../components/RequireRole";
import { getCurrentSubscription } from "../services/billing";

/* -----------------------------
   Types
------------------------------ */

type SubscriptionStatus = "ACTIVE" | "TRIALING" | "CANCELED";

type Plan = "FREE" | "PRO";

type Subscription = {
  plan: Plan;
  status: SubscriptionStatus;
  trialEndsAt: string | null;
  startedAt: string;
  canceledAt: string | null;
};

export const DashboardLayout = () => {
  const { auth, logout } = useAuth();
  const [subscription, setSubscription] =
    useState<Subscription | null>(null);

  useEffect(() => {
    const loadSubscription = async () => {
      try {
        const data = await getCurrentSubscription();
        setSubscription(data);
      } catch (err) {
        console.error("Failed to load subscription");
      }
    };

    loadSubscription();
  }, []);

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `block px-3 py-2 rounded ${
      isActive
        ? "bg-gray-200 font-medium text-gray-900"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  const statusColor: Record<SubscriptionStatus, string> = {
    ACTIVE: "text-green-600",
    TRIALING: "text-orange-500",
    CANCELED: "text-red-600",
  };

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

          <RequireRole role="ORG_ADMIN">
            <NavLink to="/billing" className={navClass}>
              Billing
            </NavLink>
          </RequireRole>
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="bg-white border-b px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Role: {auth.role}
            </span>

            {subscription && (
              <div className="px-3 py-1 rounded-full bg-gray-100 text-sm font-medium">
                {subscription.plan} •{" "}
                <span className={statusColor[subscription.status]}>
                  {subscription.status}
                </span>
              </div>
            )}
          </div>

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

