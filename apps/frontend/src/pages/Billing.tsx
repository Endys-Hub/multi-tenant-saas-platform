import { useEffect, useState } from "react";
import { openBillingPortal, createCheckoutSession } from "../api/billing";
import { getCurrentSubscription } from "../services/billing";
import { RequireRole } from "../components/RequireRole";

type SubscriptionStatus = "ACTIVE" | "TRIALING" | "CANCELED";
type Plan = "FREE" | "PRO";

type Subscription = {
  plan: Plan;
  status: SubscriptionStatus;
};

export default function Billing() {
  const [subscription, setSubscription] =
    useState<Subscription | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getCurrentSubscription();
        setSubscription(data);
      } catch (err) {
        console.error("Failed to load subscription");
      }
    };

    load();
  }, []);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const url = await createCheckoutSession();
      window.location.href = url;
    } catch (err) {
      console.error("Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  const handleManageBilling = async () => {
    try {
      setLoading(true);
      const url = await openBillingPortal();
      window.location.href = url;
    } catch (err) {
      console.error("Portal failed");
    } finally {
      setLoading(false);
    }
  };

  if (!subscription) {
    return (
      <div className="text-sm text-gray-500">
        Loading billing...
      </div>
    );
  }

  return (
    <RequireRole role="ORG_ADMIN">
      <div className="space-y-6 max-w-lg">
        <h1 className="text-xl font-semibold">Billing</h1>

        <div className="p-6 bg-white rounded-lg border shadow-sm space-y-4">
          <div>
            <p className="text-sm text-gray-500">Current Plan</p>
            <p className="text-lg font-semibold">
              {subscription.plan}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className="text-lg font-semibold">
              {subscription.status}
            </p>
          </div>

          {subscription.plan === "FREE" ? (
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              {loading ? "Redirecting..." : "Upgrade to PRO"}
            </button>
          ) : (
            <button
              onClick={handleManageBilling}
              disabled={loading}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              {loading ? "Opening..." : "Manage Subscription"}
            </button>
          )}
        </div>
      </div>
    </RequireRole>
  );
}