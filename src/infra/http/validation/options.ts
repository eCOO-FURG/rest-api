// Libraries
import Joi from "joi";

export const options = (values: readonly string[] | string[]) =>
  Joi.string().custom((value, helpers) => {
    try {
      const splitted = value.split(",").map((s: string) => s.trim());

      for (const status of splitted) {
        if (!values.includes(status)) {
          return helpers.error("any.invalid", {
            message: `Invalid value: "${status}". Allowed values are: ${values.join(
              ", "
            )}`,
          });
        }
      }

      return splitted;
    } catch (error) {
      return helpers.error("any.invalid");
    }
  });
