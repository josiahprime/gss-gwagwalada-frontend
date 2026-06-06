// utils/formatCurrency.js

export function formatCurrency(amount, locale = undefined, currencySymbol = "₦") {
   if (!Number.isFinite(amount)) return `${currencySymbol}0.00`;

  return (
    currencySymbol +
    amount.toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}
