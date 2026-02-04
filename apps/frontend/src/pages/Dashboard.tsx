import { useAuth } from "../auth/useAuth";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { auth } = useAuth();

  return (
    <div className="space-y-8">
      {/* Page header */}
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Signed in as <span className="font-medium">{auth.role}</span>
        </p>
      </header>

      {/* Admin view */}
      {auth.role === "ORG_ADMIN" && (
        <section className="rounded-lg border bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Admin Panel
          </h2>

          <p className="text-sm text-gray-700 max-w-prose">
            Manage your organization, invite members, and control access
            permissions.
          </p>

          <div>
            <Link
              to="/members"
              className="inline-flex items-center gap-1 text-blue-600 font-medium hover:underline"
            >
              Manage Members
              <span aria-hidden>→</span>
            </Link>
          </div>
        </section>
      )}

      {/* Member view */}
      {auth.role === "MEMBER" && (
        <section className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Welcome
          </h2>

          <p className="text-sm text-gray-700 max-w-prose">
            You’re a member of this organization. Contact an administrator
            if you need additional access.
          </p>
        </section>
      )}
    </div>
  );
}




