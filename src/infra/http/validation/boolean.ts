import Joi from "joi";

export const boolean = Joi.string().valid(...["true", "false"]);
