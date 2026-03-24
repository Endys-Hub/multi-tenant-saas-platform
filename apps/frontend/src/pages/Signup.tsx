import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupRequest } from "../api/auth";
import { useAuth } from "../auth/useAuth";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await signupRequest(email, password, organizationName);

      const { token, role, organizationId, userId } = res;

      // Save auth state
      login(token, role, organizationId, userId);

      // Redirect
      navigate("/dashboard", { replace: true });
    } catch {
      setError("Signup failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-80 space-y-4"
      >
        <h2 className="text-xl font-semibold">Create Account</h2>

        <input
          className="border p-2 w-full rounded"
          placeholder="Organization Name"
          value={organizationName}
          onChange={(e) => setOrganizationName(e.target.value)}
          required
        />

        <input
          className="border p-2 w-full rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="border p-2 w-full rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="bg-black text-white py-2 rounded w-full">
          Create Account
        </button>

        {error && <p className="text-red-500">{error}</p>}

        <p className="text-sm text-gray-600 text-center">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-black cursor-pointer underline"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}