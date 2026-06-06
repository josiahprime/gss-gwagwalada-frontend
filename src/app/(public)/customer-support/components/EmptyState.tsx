import { Inbox } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 py-12 text-center">
      <Inbox className="text-gray-400 mb-3" />
      <p className="text-sm text-gray-600">
        You haven’t opened any support tickets yet
      </p>
    </div>
  );
}
