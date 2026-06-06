import StatCard from "./StatCard";
import { AlertCircle, Clock, CheckCircle } from "lucide-react";

export default function SupportStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="Open Tickets" value="12" icon={AlertCircle} />
      <StatCard label="Pending Replies" value="5" icon={Clock} />
      <StatCard label="Resolved" value="48" icon={CheckCircle} />
      <StatCard label="Avg Response" value="2h 14m" icon={Clock} />
    </div>
  );
}
