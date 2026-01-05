import { prisma } from "./prisma";

type AuditMetadata =
  | string
  | number
  | boolean
  | AuditMetadata[]
  | { [key: string]: AuditMetadata };

interface AuditInput {
  organizationId: string;
  userId?: string;
  action: string;
  entity: string;
  entityId?: string;
  metadata?: AuditMetadata;
}

export const logAudit = async ({
  organizationId,
  userId,
  action,
  entity,
  entityId,
  metadata,
}: AuditInput) => {
  await prisma.auditLog.create({
    data: {
      organizationId,
      userId,
      action,
      entity,
      entityId,
      ...(metadata !== undefined ? { metadata } : {}), // KEY FIX
    },
  });
};
