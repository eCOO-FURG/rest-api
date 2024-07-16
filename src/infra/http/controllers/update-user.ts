// Use-cases
import { UpdateUserUseCase } from "@/core/use-cases/update-user";

// Container
import container from "@/infra/container";

// Libs
import { Request, Response, NextFunction } from "express";
import { z } from "zod";

const updateUserSchema = {
  body: z.object({
    first_name: z.string(),
    last_name: z.string(),
    email: z.string().email(),
    cpf: z.string().min(11).max(14),
    phone: z.string(),
    password: z.string().min(8),
  })
}

export async function updateUserController(
  request: Request, 
  response: Response, 
  next: NextFunction
){
  try{
    const { 
      first_name, 
      last_name, 
      email, 
      cpf, 
      phone, 
      password 
    } = updateUserSchema.body.parse(request.body)

    const updateUserUsecase = container.resolve<UpdateUserUseCase>("updateUserUseCase")

    await updateUserUsecase.execute({
      user_id: request.user_id,
      first_name,
      last_name,
      cpf,
      email,
      password,
      phone
    })

    return response.sendStatus(204)
  } catch(error){
    next(error)
  }
}