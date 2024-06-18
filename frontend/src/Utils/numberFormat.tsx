export const NumberFormat = (value: number | undefined): string | undefined => {
  if (value === undefined) {
    return undefined;
  }
  return Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

export const DateFormat = (dateString: string): string => {
  return new Date(dateString).toISOString().split('T')[0];
};