export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
}

export interface Promotion {
  id: string;
  badgeText: string;
  headline: string;
  description: string;
  theme: "christmas" | "black-friday" | "valentines" | "custom";
  startDate: string;
  endDate: string;
  isActive: boolean;
  bannerImage?: string;
  featureOnHomepage?: boolean;
  autoDeactivateOnExpire?: boolean;
  selectedProductIds?: string[];
}

export type PromotionStatus = "Draft" | "Scheduled" | "Active" | "Expired";

export function getPromotionStatus(promotion: Promotion): PromotionStatus {
  const now = new Date();
  const startDate = new Date(promotion.startDate);
  const endDate = new Date(promotion.endDate);

  if (now < startDate) {
    return "Scheduled";
  } else if (now >= startDate && now <= endDate) {
    return promotion.isActive ? "Active" : "Draft";
  } else {
    return "Expired";
  }
}

export function getCountdownText(endDate: string): string {
  const now = new Date();
  const end = new Date(endDate);
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) {
    return "Expired";
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) {
    return `Ends in ${days} day${days > 1 ? "s" : ""}`;
  } else if (hours > 0) {
    return `Ends in ${hours} hour${hours > 1 ? "s" : ""}`;
  } else {
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `Ends in ${minutes} minute${minutes > 1 ? "s" : ""}`;
  }
}
