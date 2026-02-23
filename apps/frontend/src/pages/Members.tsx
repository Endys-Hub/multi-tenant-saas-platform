import { useEffect, useState } from "react";
import {
  fetchMembers,
  removeMember,
  type Member,
} from "../api/members";
import {
  inviteUser,
  getPendingInvitations,
  revokeInvitation,
} from "../api/invitations";
import { RequireRole } from "../components/RequireRole";
import { useAuth } from "../auth/useAuth";

const formatDate = (date: string | null | undefined) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString();
};

export const Members = () => {
  const { auth } = useAuth();

  const [members, setMembers] = useState<Member[]>([]);
  const [pending, setPending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"MEMBER" | "ORG_ADMIN">("MEMBER");
  const [inviting, setInviting] = useState(false);

  const loadData = async () => {
    const [memberData, pendingData] = await Promise.all([
      fetchMembers(),
      getPendingInvitations(),
    ]);

    setMembers(memberData);
    setPending(pendingData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviting(true);

    await inviteUser(email, role);

    setEmail("");
    await loadData();

    setInviting(false);
  };

  const handleRevoke = async (id: string) => {
    if (!window.confirm("Revoke this invitation?")) return;

    await revokeInvitation(id);
    await loadData();
  };

  const handleRemoveMember = async (userId: string) => {
    if (!window.confirm("Remove this member from the organization?"))
      return;

    await removeMember(userId);
    await loadData();
  };

  if (loading) return <p>Loading members…</p>;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-xl font-semibold">
        Organization Members
      </h1>

      {/* Invite Section */}
      <RequireRole role="ORG_ADMIN">
        <div className="bg-white p-6 rounded shadow space-y-4 max-w-lg">
          <h2 className="font-medium">Invite Member</h2>

          <form onSubmit={handleInvite} className="space-y-3">
            <input
              type="email"
              placeholder="Email address"
              className="border p-2 w-full rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <select
              className="border p-2 w-full rounded"
              value={role}
              onChange={(e) =>
                setRole(e.target.value as "MEMBER" | "ORG_ADMIN")
              }
            >
              <option value="MEMBER">Member</option>
              <option value="ORG_ADMIN">Org Admin</option>
            </select>

            <button
              disabled={inviting}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              {inviting ? "Sending..." : "Send Invitation"}
            </button>
          </form>
        </div>
      </RequireRole>

      {/* Active Members */}
      <div>
        <h2 className="font-medium mb-3">Active Members</h2>

        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Joined</th>
              <RequireRole role="ORG_ADMIN">
                <th className="p-2">Actions</th>
              </RequireRole>
            </tr>
          </thead>

          <tbody>
            {members.map((member) => (
              <tr key={member.userId}>
                <td className="p-2">{member.email}</td>
                <td className="p-2">{member.role}</td>
                <td className="p-2">
                  {formatDate(member.joinedAt)}
                </td>

                <RequireRole role="ORG_ADMIN">
                  <td className="p-2">
                    {member.userId !== auth?.userId && (
                      <button
                        onClick={() =>
                          handleRemoveMember(member.userId)
                        }
                        className="text-red-600 text-sm hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </RequireRole>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pending Invitations */}
      <RequireRole role="ORG_ADMIN">
        <div>
          <h2 className="font-medium mb-3">
            Pending Invitations
          </h2>

          {pending.length === 0 && (
            <p className="text-sm text-gray-500">
              No pending invitations.
            </p>
          )}

          {pending.length > 0 && (
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2">Email</th>
                  <th className="p-2">Role</th>
                  <th className="p-2">Expires</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pending.map((invite) => (
                  <tr key={invite.id}>
                    <td className="p-2">{invite.email}</td>
                    <td className="p-2">{invite.role}</td>
                    <td className="p-2">
                      {formatDate(invite.expiresAt)}
                    </td>
                    <td className="p-2">
                      <button
                        onClick={() => handleRevoke(invite.id)}
                        className="text-red-600 text-sm hover:underline"
                      >
                        Revoke
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </RequireRole>
    </div>
  );
};

//