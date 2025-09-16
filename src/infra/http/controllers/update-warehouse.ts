// Libraries
import Joi from "joi";
import { Request, Response, NextFunction } from "express";

// Use-cases
import { UpdateWarehouseUseCase } from "@/core/use-cases/update-warehouse";

// Container
import container from "@/infra/container";

// Validation
import { parse } from "@/infra/http/validation/parse";
import { Warehouse } from "@/core/entities/warehouse";

export const updateWarehouseParams = Joi.object({
  user_id: Joi.string().uuid().required(),
});

export const updateWarehouseSchema = Joi.object({
  name: Joi.string().optional(),
  CNPJ: Joi.string().optional().min(14).max(14).regex(/^\d+$/),
  manager: Joi.string().optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().min(11).max(11).optional(),
  socials: Joi.array()
    .items(
      Joi.object({
        platform: Joi.string()
          .valid(...Warehouse.plataforms)
          .required(),
        value: Joi.string().uri().required(),
      }),
    )
    .optional(),
  address: Joi.object({
    CEP: Joi.string().required().allow(null, ""),
    street: Joi.string().required().allow(null, ""),
    number: Joi.string().required().allow(null, ""),
    neighborhood: Joi.string().required().allow(null, ""),
    complement: Joi.string().required().allow(null, ""),
    city: Joi.string().required(),
    state: Joi.string().required().allow(null, ""),
    link: Joi.string().uri().required().allow(null, ""),
  }).optional(),
  coverage: Joi.array().items(Joi.string()).optional(),
});

export async function updateWarehouseController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { name, CNPJ, manager, email, phone, socials, address, coverage } =
      parse(updateWarehouseSchema, request.body);

    const updateWarehouseUseCase = container.resolve<UpdateWarehouseUseCase>(
      "updateWarehouseUseCase",
    );

    await updateWarehouseUseCase.execute({
      user_id: request.user_id,
      name,
      CNPJ,
      manager,
      email,
      phone,
      socials,
      address,
      coverage,
    });

    return response.sendStatus(204);
  } catch (error) {
    next(error);
  }
}
