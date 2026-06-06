import { BadgePercent, Plus } from "lucide-react";
import DashboardHeader from "app/dashboard/components/dashboardHeader/DashboardHeader";

interface Props {
  total: number;
  active: number;
  upcoming: number;
  onCreate: () => void;
}

export default function DiscountHero({ total, active, upcoming, onCreate }: Props) {
  return (
    <section className="rounded-2xl p-6 m-4 shadow bg-white">
      <DashboardHeader
        badgeText="Promotions Suite"
        BadgeIcon={BadgePercent}
        title="Discount Management"
        description="Create, manage, and monitor discount campaigns across your store."
        actionLabel="Create Discount"
        ActionIcon={Plus}
        onAction={onCreate}
      />

      <div className="grid grid-cols-3 gap-4 mt-6">
        <Stat label="Total Discounts" value={total} />
        <Stat label="Active Now" value={active} />
        <Stat label="Upcoming" value={upcoming} />
      </div>
    </section>
  );
}

const Stat = ({ label, value }: { label: string; value: number }) => (
  <div className="rounded-md shadow bg-white p-4">
    <div className="text-sm text-gray-500">{label}</div>
    <div className="text-2xl font-semibold mt-1">{value}</div>
  </div>
);
