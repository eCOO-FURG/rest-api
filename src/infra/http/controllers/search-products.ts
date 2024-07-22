// Use-cases
import { SearchProductsUseCase } from '@/core/use-cases/search-products'

// Container
import container from '@/infra/container'

// Libs
import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'

// Presenters
import { ProductPresenter } from '@/infra/http/presenters/product-presenter'

const searchProductsSchemas = {
  query: z.object({
    page: z.coerce.number(),
    name: z.string().optional()
  })
}

export async function searchProductsController(
  request: Request,
  response: Response,
  next: NextFunction
){
  try{
    const { page, name } = searchProductsSchemas.query.parse(request.query)

    const searchProductsUseCase = container.resolve<SearchProductsUseCase>('searchProductsUseCase')

    const { products } = await searchProductsUseCase.execute({
      page,
      name
    })

    

    return response.status(200).send(products.map((product) => ProductPresenter.toHTTP(product)))
  } catch(error){
    next(error)
  }
}