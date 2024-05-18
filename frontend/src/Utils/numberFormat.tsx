export const NumberFormat = (value: number): string => {
  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    currencyDisplay: "narrowSymbol",
  }).format(value);
};
