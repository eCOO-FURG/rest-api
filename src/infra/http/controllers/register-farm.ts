// Libs
import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import multer from "multer";

// Use-cases
import { RegisterFarmUseCase } from "@/core/use-cases/register-farm";

// Container
import container from "@/infra/container";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const registerFarmSchema = {
  body: z.object({
    name: z.string(),
    tally: z.string(),
  }),
};

export const registerFarmController = [
  upload.single("image"),
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const { name, tally } = registerFarmSchema.body.parse(request.body);

      const image = request.file?.buffer;
      if (!image) {
        return response.status(400).json({ error: "Imagem é obrigatória" });
      }

      const registerFarmUseCase = container.resolve<RegisterFarmUseCase>(
        "registerFarmUseCase"
      );

      await registerFarmUseCase.execute({
        user_id: request.user_id,
        tally,
        name,
        image,
      });

      return response.sendStatus(201);
    } catch (error) {
      next(error);
    }
  },
];
