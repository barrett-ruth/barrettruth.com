const parseEuroDate = (dateStr) => {
  if (!dateStr) return new Date(0);
  const [d, m, y] = (dateStr || "").split("/");
  return new Date(Number(y), Number(m) - 1, Number(d));
};

export const sortItem = (a, b) => {
  const aDate = parseEuroDate(a.data.date).getTime();
  const bDate = parseEuroDate(b.data.date).getTime();

  return aDate === bDate ? a.slug.localeCompare(b.slug) : bDate - aDate;
};
