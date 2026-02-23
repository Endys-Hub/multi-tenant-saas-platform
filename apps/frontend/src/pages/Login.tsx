import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "../api/auth";
import { useAuth } from "../auth/useAuth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const {
        token,
        organizationId,
        role,
        userId,
      } = await loginRequest(email, password);

      // Finalize auth (AuthProvider stores everything)
      login(token, role, organizationId, userId);

      navigate("/dashboard", { replace: true });
    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-80 space-y-4"
      >
        <h2 className="text-xl font-semibold">Login</h2>

        <input
          className="border p-2 w-full rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="border p-2 w-full rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="bg-black text-white py-2 rounded w-full">
          Login
        </button>

        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
}


