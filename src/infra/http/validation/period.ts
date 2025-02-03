export const period = {
  validation: (start?: Date, end?: Date) => {
    return !start || !end || start < end;
  },
  warning: "Período inválido",
};
