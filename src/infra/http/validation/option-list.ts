export const optionList = {
  validation: (value: string, options: readonly unknown[]) => {
    const values = value.split(",");

    return values.every((item) => options.includes(item));
  },
  warning: "Opções de filtro inválidas.",
};
