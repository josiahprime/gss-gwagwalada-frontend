import { Promotion, Product } from "@/types/promotion";

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 7);
const lastWeek = new Date(today);
lastWeek.setDate(lastWeek.getDate() - 7);

export const mockProducts: Product[] = [
  {
    id: "prod-1",
    name: "Premium Wireless Headphones",
    price: 199.99,
    imageUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
  },
  {
    id: "prod-2",
    name: "Smartwatch Pro",
    price: 299.99,
    imageUrl:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
  },
  {
    id: "prod-3",
    name: "4K Webcam",
    price: 149.99,
    imageUrl:
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300&h=300&fit=crop",
  },
  {
    id: "prod-4",
    name: "Mechanical Keyboard",
    price: 129.99,
    imageUrl:
      "https://images.unsplash.com/photo-1587829191301-48e36d7e41b4?w=300&h=300&fit=crop",
  },
  {
    id: "prod-5",
    name: "USB-C Hub 7-in-1",
    price: 79.99,
    imageUrl:
      "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=300&h=300&fit=crop",
  },
  {
    id: "prod-6",
    name: "Portable SSD 2TB",
    price: 249.99,
    imageUrl:
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=300&h=300&fit=crop",
  },
  {
    id: "prod-7",
    name: "Ergonomic Mouse",
    price: 59.99,
    imageUrl:
      "https://images.unsplash.com/photo-1527814050087-3793815479db?w=300&h=300&fit=crop",
  },
  {
    id: "prod-8",
    name: "Laptop Stand",
    price: 49.99,
    imageUrl:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop",
  },
];

export const mockPromotions: Promotion[] = [
  {
    id: "promo-1",
    badgeText: "Today Only",
    headline: "Flash Sale: Tech Essentials",
    description: "Get up to 40% off on selected tech gadgets. Limited time offer!",
    theme: "custom",
    startDate: today.toISOString().split("T")[0],
    endDate: tomorrow.toISOString().split("T")[0],
    isActive: true,
    featureOnHomepage: true,
    autoDeactivateOnExpire: true,
    selectedProductIds: ["prod-1", "prod-2", "prod-3"],
  },
  {
    id: "promo-2",
    badgeText: "Limited Time",
    headline: "Black Friday Deals - Save Big!",
    description:
      "The biggest sale of the year is here. Up to 50% off everything.",
    theme: "black-friday",
    startDate: nextWeek.toISOString().split("T")[0],
    endDate: new Date(nextWeek.getTime() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    isActive: false,
    featureOnHomepage: true,
    autoDeactivateOnExpire: true,
    selectedProductIds: ["prod-4", "prod-5", "prod-6"],
  },
  {
    id: "promo-3",
    badgeText: "Seasonal",
    headline: "Christmas Special Collection",
    description: "Celebrate with exclusive holiday discounts and free shipping.",
    theme: "christmas",
    startDate: lastWeek.toISOString().split("T")[0],
    endDate: today.toISOString().split("T")[0],
    isActive: false,
    featureOnHomepage: false,
    autoDeactivateOnExpire: true,
    selectedProductIds: ["prod-1", "prod-7"],
  },
  {
    id: "promo-4",
    badgeText: "Exclusive",
    headline: "Back to School Essentials",
    description:
      "Gear up for the new semester with our curated student collection.",
    theme: "custom",
    startDate: new Date(lastWeek.getTime() - 14 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    endDate: lastWeek.toISOString().split("T")[0],
    isActive: false,
    featureOnHomepage: false,
    autoDeactivateOnExpire: false,
    selectedProductIds: ["prod-3", "prod-4", "prod-8"],
  },
];
