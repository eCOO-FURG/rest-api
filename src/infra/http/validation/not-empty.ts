export const notEmpty = {
  validation: (object: Object) => {
    return Object.values(object).some((value) => {
      if (Array.isArray(value)) return value.length;
      return value;
    });
  },
  warning: "Pelo menos um campo é obrigatório",
};
