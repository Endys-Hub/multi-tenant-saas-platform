import type { ReactNode } from "react";
import { useAuth } from "../auth/useAuth";

export function RequireRole({
  role,
  children,
}: {
  role: "ORG_ADMIN" | "MEMBER";
  children: ReactNode;
}) {
  const { auth } = useAuth();

  if (auth.role !== role) return null;

  return <>{children}</>;
}


Usage:

<RequireRole role="ORG_ADMIN">
  <button>Invite User</button>
</RequireRole>
