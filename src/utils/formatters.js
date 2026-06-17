export const formatCredit = (value) => new Intl.NumberFormat("tr-TR").format(value);

export const formatCurrency = (value, currency = "TRY") => new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency,
  maximumFractionDigits: 0,
}).format(value);

export const formatPercent = (value) => `%${new Intl.NumberFormat("tr-TR").format(value)}`;

export const formatDateShort = (date) => new Intl.DateTimeFormat("tr-TR", {
  day: "numeric",
  month: "short",
  year: "numeric",
}).format(date instanceof Date ? date : new Date(date));
