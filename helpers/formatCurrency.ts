const formatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
});

export const formatCurrency = (value: number) => {
  return formatter.format(value);
};
