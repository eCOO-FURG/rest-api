export const notEmpty = {
  validation: (object: Object) => {
    return Object.values(object).some((value) => value);
  },
  warning: "Pelo menos um campo é obrigatório",
};
