// Libs
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Use-cases
import { RequestOtpUseCase } from "@/core/use-cases/request-otp";

// Container
import container from "@/infra/container";

const requestOtpSchema = {
  body: z.object({
    email: z.string()
  })
}

export async function requestOtpController(request: Request, response: Response, next: NextFunction) {
  try {
    const { email } = requestOtpSchema.body.parse(request.body)

    container.resolve("onOtpRequestEvent")

    const requestOtpUseCase = container.resolve<RequestOtpUseCase>(
      'requestOtpUseCase'
    )

    await requestOtpUseCase.execute({
      email
    })

    return response.sendStatus(201)
  } catch (error) {
    next(error)
  }
}