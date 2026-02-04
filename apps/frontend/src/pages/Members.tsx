import { useEffect, useState } from "react";
import { fetchMembers, type Member } from "../api/members";
import { RequireRole } from "../components/RequireRole";

const formatDate = (date: string | null | undefined) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString();
};

export const Members = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers()
      .then(setMembers)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading members…</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Organization Members</h1>

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
            <tr key={`${member.email}-${member.joinedAt}`}>
              <td>{member.email}</td>
              <td>{member.role}</td>
              <td>{formatDate(member.joinedAt)}</td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
};

//