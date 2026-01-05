export const PERMISSIONS = {
  ORG_READ: "org:read",
  ORG_UPDATE: "org:update",

  USER_READ: "user:read",
  USER_INVITE: "user:invite",

  AUDIT_READ: "audit:read",

  BILLING_READ: "billing:read",
  BILLING_UPDATE: "billing:update",
} as const;

export type Permission =
  (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
