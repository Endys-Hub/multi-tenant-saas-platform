import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { api } from "../api/client";

export default function AcceptInvite() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!token) {
    return <p className="p-6">Invalid or missing invite token.</p>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await api.post("/invitations/accept", {
        token,
        password, // true value
      });

      navigate("/login");
    } catch {
      setError("Invite is invalid or expired");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-80 space-y-4"
      >
        <h2 className="text-xl font-semibold">Join Organization</h2>

        <input
          type="password"
          className="border p-2 w-full rounded"
          placeholder="Set your password"
          value={password}  // controlled
          onChange={(e) => setPassword(e.target.value)} // bound
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white py-2 rounded w-full"
        >
          {loading ? "Joining..." : "Join Organization"}
        </button>

        {error && <p className="text-red-600">{error}</p>}
      </form>
    </div>
  );
}

