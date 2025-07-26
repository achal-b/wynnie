// Currency utility for consistent formatting
export const formatCurrency = (amount: number): string => {
  const converted = amount * 85.82;
  return `${converted.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};

export const formatCurrencyShort = (amount: number): string => {
  const converted = amount * 85.82;
  return `${converted.toLocaleString()}`;

};
