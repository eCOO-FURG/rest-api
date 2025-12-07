// Libraries
import Joi from "joi";

export function parse<T extends Joi.ObjectSchema>(
  schema: T,
  data: unknown,
  options?: Joi.ValidationOptions,
): Joi.extractType<T> {
  const { error, value } = schema.validate(data, options);

  if (error) {
    throw error;
  }

  return value as Joi.extractType<T>;
}
