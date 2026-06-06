'use client';

import { Edit, Trash2, BadgeCheck, X } from "lucide-react";
import { format } from "date-fns";
import type { Discount } from "store/discount/discountTypes";
import { formatDiscountValue } from "utils/discountFormatters";

interface Props {
  discount: Discount;
  onEdit: (d: Discount) => void;
  onDelete: (id: string) => void;
}

export default function DiscountRow({ discount, onEdit, onDelete }: Props) {
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 last:border-b-0 transition-colors">
      <td className="p-4 font-medium">{discount.label}</td>

      <td className="p-4">
        <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-violet-100 text-violet-700">
          {discount.type}
        </span>
      </td>

      <td className="p-4">
        {formatDiscountValue(discount)}
      </td>

      <td className="p-4">
        {discount.isActive ? (
          <span className="inline-flex items-center gap-1 text-emerald-700 text-xs">
            <BadgeCheck className="w-4 h-4" /> Active
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-gray-600 text-xs">
            <X className="w-4 h-4" /> Inactive
          </span>
        )}
      </td>

      <td className="p-4 text-gray-500 text-sm">
        {discount.startDate && discount.endDate
          ? `${format(new Date(discount.startDate), "MMM dd, yyyy")} → ${format(
              new Date(discount.endDate),
              "MMM dd, yyyy"
            )}`
          : "-"}
      </td>

      <td className="p-4 text-right">
        <div className="inline-flex gap-2">
          <button
            onClick={() => onEdit(discount)}
            className="text-amber-600 hover:text-amber-700 inline-flex items-center gap-1 text-sm"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>

          <button
            onClick={() => onDelete(discount.id)}
            className="text-red-600 hover:text-red-700 inline-flex items-center gap-1 text-sm"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
