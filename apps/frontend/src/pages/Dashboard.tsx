import { useAuth } from "../auth/useAuth";

export default function Dashboard() {
  const { auth } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <p className="mb-4">Role: {auth.role}</p>

      {auth.role === "ORG_ADMIN" && (
        <section className="border p-4 rounded bg-gray-50">
          <h2 className="text-lg font-semibold">Admin Panel</h2>
          <p>You can manage users, billing, and settings.</p>
        </section>
      )}

      {auth.role === "MEMBER" && (
        <section className="border p-4 rounded bg-gray-50">
          <p>Welcome! You have limited access.</p>
        </section>
      )}
    </div>
  );
}

