import { useState } from "react";
import { inviteUser } from "../api/invitations";

export default function InviteUser() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"MEMBER" | "ORG_ADMIN">("MEMBER");
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await inviteUser(email, role);
      setSuccess("Invitation sent successfully");
      setEmail("");
    } catch {
      setError("Failed to send invitation");
    }
  };

  return (
    <div style={{ padding: 32 }}>
      <h2>Invite User</h2>

      <form onSubmit={handleInvite}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value as any)}
        >
          <option value="MEMBER">Member</option>
          <option value="ORG_ADMIN">Admin</option>
        </select>

        <button type="submit">Send Invite</button>
      </form>

      {success && <p style={{ color: "green" }}>{success}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
