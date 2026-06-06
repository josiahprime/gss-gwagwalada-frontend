import type { Discount } from "store/discount/discountTypes";

export const formatDiscountValue = (d: Discount) => {
  if (d.type === "PERCENTAGE") return `${d.value ?? 0}%`;

  const safeValue = typeof d.value === "number" ? d.value : Number(d.value) || 0;
  return `₦${safeValue.toLocaleString("en-NG")}`;
};
