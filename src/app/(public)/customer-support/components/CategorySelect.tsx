// import type { TicketCategory } from "store/ticket/ticketTypes";
import type { TicketCategory } from "@/store/ticket/ticketTypes";

interface Props {
  value: TicketCategory;
  onChange: (value: TicketCategory) => void;
}

export function CategorySelect({ value, onChange }: Props) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">Category</label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value as TicketCategory)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
      >
        <option value="order_issue">Order Issue</option>
        <option value="payment">Payment</option>
        <option value="delivery">Delivery</option>
        <option value="product_quality">Product Quality</option>
        <option value="refund">Refund</option>
        <option value="account">Account</option>
        <option value="general">General</option>
      </select>
    </div>
  );
}
