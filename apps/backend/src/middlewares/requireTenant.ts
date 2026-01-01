import { requireAuth } from "./auth";
import { resolveTenant } from "./tenant";

export const requireTenant = [requireAuth, resolveTenant];
