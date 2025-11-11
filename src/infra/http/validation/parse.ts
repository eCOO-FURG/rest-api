// Libraries
import Joi from "joi";

export function parse<T extends Joi.ObjectSchema>(schema: T, data: unknown): Joi.extractType<T> {
  const { error, value } = schema.validate(data);

  if (error) {
    throw error;
  }

  return value as Joi.extractType<T>;
}
