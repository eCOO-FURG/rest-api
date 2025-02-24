import { toDate } from "@/infra/utils/to-date";

export const notPast = {
  validation: (dateString?: string) => {
    if (!dateString) return true;

    const date = toDate(dateString);

    if (!date) return true;

    return date >= new Date();
  },
  warning: "A data não pode estar no passado",
};
