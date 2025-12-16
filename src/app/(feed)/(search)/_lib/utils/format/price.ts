export const formatPrice = (
  price: number,
  locale = "ru-RU",
  currency = "RUB"
) => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
};
