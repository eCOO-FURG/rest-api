export const optionList = {
  validation: (value: string) => {
    return value.split(",").length > 1;
  },
  warning: "Opções de filtro inválidas. Devem ser separadas por vírgula.",
};
