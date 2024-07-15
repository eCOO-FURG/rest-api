// Use-cases
import { UpdateOfferUseCase } from "@/core/use-cases/update-offer"

// Container
import container from "@/infra/container"

// Libs
import { Request, Response, NextFunction } from "express"
import { z } from "zod"

const updateOfferSchema = {
  body: z.object({
    offer_id: z.string(),
    amount: z.number().optional(),
    price: z.number().optional()
  }).refine((data) => {
    return Object.values(data).some((value) => value !== undefined)
  })
}

export async function updateOfferController(
  request: Request, 
  response: Response, 
  next: NextFunction
) {
  try{
    const { offer_id, amount, price } = updateOfferSchema.body.parse(request.body)

    const updateOfferUsecase = container.resolve<UpdateOfferUseCase>('updateOfferUsecase')
  
    await updateOfferUsecase.execute({
      farm_id: request.farm_id,
      offer_id,
      amount,
      price
    })
  
    return response.sendStatus(204)
  } catch(error){
    next(error)
  }
}