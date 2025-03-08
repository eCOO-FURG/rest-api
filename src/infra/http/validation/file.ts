// Libraries
import Joi from "joi";

export type JoiFile = Joi.extractType<typeof file>;

export const file = Joi.object({
  fieldname: Joi.string().required(),
  originalname: Joi.string().required(),
  encoding: Joi.string().required(),
  mimetype: Joi.string().required(),
  size: Joi.number().required(),
  destination: Joi.string().optional(),
  filename: Joi.string().required(),
  path: Joi.string().required(),
  buffer: Joi.any().required(),
});

export const files = Joi.array().items(file);
