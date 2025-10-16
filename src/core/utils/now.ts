interface NowRequest {
  minus?: number;
  plus?: number;
}

export const now = ({ minus, plus }: NowRequest = {}) => {
  const date = new Date();

  date.setHours(date.getHours() - 3);

  if (minus) {
    date.setMinutes(date.getMinutes() - minus);
  }
  if (plus) {
    date.setMinutes(date.getMinutes() + plus);
  }

  return date;
};
