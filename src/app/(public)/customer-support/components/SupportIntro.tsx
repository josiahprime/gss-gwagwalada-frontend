import { Info } from "lucide-react";

export function SupportIntro() {
  return (
    <div className="flex gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
      <Info className="text-green-600 mt-0.5" size={18} />
      <p className="text-sm text-gray-700">
        Use this form to report order issues, delivery problems, payments,
        refunds, or general inquiries. Please provide accurate details so we
        can help faster.
      </p>
    </div>
  );
}
