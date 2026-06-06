export default function TicketRowSkeleton() {
  return (
    <tr className="animate-pulse">
      <td className="px-4 py-3">
        <div className="h-4 w-32 rounded bg-gray-200" />
      </td>

      <td className="px-4 py-3 space-y-2">
        <div className="h-4 w-40 rounded bg-gray-200" />
        <div className="h-3 w-56 rounded bg-gray-100" />
      </td>

      <td className="hidden md:table-cell px-4 py-3">
        <div className="h-4 w-24 rounded bg-gray-200" />
      </td>

      <td className="hidden sm:table-cell px-4 py-3">
        <div className="h-5 w-16 rounded-full bg-gray-200" />
      </td>

      <td className="px-4 py-3">
        <div className="h-5 w-20 rounded-full bg-gray-200" />
      </td>

      <td className="hidden lg:table-cell px-4 py-3">
        <div className="h-4 w-24 rounded bg-gray-200" />
      </td>

      <td className="px-4 py-3">
        <div className="ml-auto h-4 w-4 rounded bg-gray-200" />
      </td>
    </tr>
  );
}
