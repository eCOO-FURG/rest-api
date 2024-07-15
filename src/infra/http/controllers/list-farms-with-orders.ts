// Use-cases
import { ListFarmsWithOrdersUsecase } from '@/core/use-cases/list-farms-with-orders'

// Container
import container from '@/infra/container'

// Libs
import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'

const listFarmsWithOrdersSchema = {
  query: z.object({
    cycle_id: z.string(),
    page: z.number(),
    name: z.string().optional()
  })
}

export async function listFarmsWithOrdersController(
  request: Request,
  response: Response,
  next: NextFunction
){
  try{
    const { cycle_id, page, name } = listFarmsWithOrdersSchema.query.parse(request.query)

    const listFarmsWithOrdersUsecase = container.resolve<ListFarmsWithOrdersUsecase>('listFarmsWithOrdersUsecase')

    await listFarmsWithOrdersUsecase.execute({
      cycle_id,
      page,
      name
    })

    return response.sendStatus(200)
  } catch(error){
    next(error)
  }
}