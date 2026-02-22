import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { acceptInvitation } from "../api/invitations";

export default function AcceptInvite() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!token) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">
          Invalid or missing invitation token.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      await acceptInvitation(token, password);

      navigate("/login", {
        replace: true,
        state: { message: "Invitation accepted. Please login." },
      });
    } catch {
      setError("Invitation is invalid, expired, or already used.");
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
        <h2 className="text-xl font-semibold">
          Join Organization
        </h2>

        <input
          type="password"
          className="border p-2 w-full rounded"
          placeholder="Set your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white py-2 rounded w-full hover:bg-gray-800"
        >
          {loading ? "Joining..." : "Join Organization"}
        </button>

        {error && (
          <p className="text-red-600 text-sm">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}

