export const now = () => {
  const date = new Date();
  date.setHours(date.getHours() - 3);
  return date;
};
