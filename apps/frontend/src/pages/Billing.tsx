import { openBillingPortal } from "../api/billing";
import { RequireRole } from "../components/RequireRole";

export default function Billing() {
  const handleManageBilling = async () => {
    const url = await openBillingPortal();
    window.location.href = url;
  };

  return (
    <RequireRole role="ORG_ADMIN">
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">Billing</h1>

        <p className="text-sm text-gray-600">
          Manage your subscription, payment method, and invoices.
        </p>

        <button
          onClick={handleManageBilling}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          Open Billing Portal
        </button>
      </div>
    </RequireRole>
  );
}