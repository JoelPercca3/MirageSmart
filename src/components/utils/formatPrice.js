export const formatPrice = (amount) => {
  if (amount === null || amount === undefined) return "S/ 0.00";
  return `S/ ${Number(amount).toFixed(2)}`;
};

export const formatDiscount = (original, oferta) => {
  if (!oferta || oferta >= original) return null;
  return Math.round((1 - oferta / original) * 100);
};
