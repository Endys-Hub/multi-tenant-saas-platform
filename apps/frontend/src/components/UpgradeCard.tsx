export const UpgradeCard = () => {
  return (
    <div className="p-6 bg-white border rounded-lg shadow-sm space-y-4">
      <h2 className="text-lg font-semibold">Upgrade Required</h2>
      <p className="text-sm text-gray-600">
        This feature is available on the PRO plan.
      </p>
      <a
        href="/billing"
        className="inline-block px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
      >
        Upgrade to PRO
      </a>
    </div>
  );
};