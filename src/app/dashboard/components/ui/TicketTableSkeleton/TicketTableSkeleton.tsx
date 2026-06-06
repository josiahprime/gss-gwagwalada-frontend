import TicketRowSkeleton from "./TableSkeleton";

export default function TicketTableSkeleton() {
  return (
    <div className="rounded-xl shadow-sm overflow-hidden border border-gray-200 bg-white">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-3" />
            <th className="px-4 py-3" />
            <th className="hidden md:table-cell px-4 py-3" />
            <th className="hidden sm:table-cell px-4 py-3" />
            <th className="px-4 py-3" />
            <th className="hidden lg:table-cell px-4 py-3" />
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 6 }).map((_, i) => (
            <TicketRowSkeleton key={i} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
