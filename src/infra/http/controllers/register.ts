// Libs
import { Request, Response } from "express";
import { z } from "zod";

// Use-cases
import { RegisterUseCase } from "@/core/use-cases/register";

// Container
import container from "@/infra/container";

const registerSchema = {
  body: z.object({
    first_name: z.string(),
    last_name: z.string(),
    cpf: z.string().max(14),
    email: z.string().email(),
    phone: z.string(),
    password: z.string().min(8).optional(),
  }),
};

export class RegisterController {
  static async handle(request: Request, response: Response) {
    try {
      const { first_name, last_name, cpf, email, phone, password } =
        registerSchema.body.parse(request.body);

      const registerUseCase =
        container.resolve<RegisterUseCase>("registerUsecase");

      await registerUseCase.execute({
        first_name,
        last_name,
        cpf,
        email,
        phone,
        password,
      });

      return response.sendStatus(201);
    } catch (err) {
      console.log(err);
      return response.send(500).send();
    }
  }
}
