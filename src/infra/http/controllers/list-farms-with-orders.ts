// Use-cases
import { ListFarmsWithOrdersUsecase } from '@/core/use-cases/list-farms-with-orders'

// Container
import container from '@/infra/container'

// Presenters
import { FarmPresenter } from '@/infra/http/presenters/farm-presenter'

// Libs
import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'

const listFarmsWithOrdersSchema = {
  query: z.object({
    cycle_id: z.string(),
    page: z.coerce.number(),
    name: z.string().optional()
  }),
}

export async function listFarmsWithOrdersController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { cycle_id, page, name } = listFarmsWithOrdersSchema.query.parse(request.query)

    const listFarmsWithOrdersUseCase = container.resolve<ListFarmsWithOrdersUsecase>('listFarmsWithOrdersUseCase')

    const { farms } = await listFarmsWithOrdersUseCase.execute({
      cycle_id,
      page,
      name
    })

    return response.status(200).send(farms.map((farm) => FarmPresenter.toHttp(farm)))
  } catch (error) {
    next(error)
  }
}