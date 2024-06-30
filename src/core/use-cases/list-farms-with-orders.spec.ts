// Use-cases
import { ListFarmsWithOrdersUsecase } from "./list-farms-with-orders"

// Repositories
import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository"
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository"
import { InMemoryOffersRepository } from "@/test/repositories/in-memory-offers-repository"
import { InMemoryOrdersRepository } from "@/test/repositories/in-memory-orders-repository"
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository"
import { InMemoryProductsRepository } from "@/test/repositories/in-memory-products-repository"

// Services
import { makeFarm } from "@/test/factories/make-farm"
import { makeCycle } from "@/test/factories/make-cycle"
import { makeProduct } from "@/test/factories/make-product"
import { makeOffer } from "@/test/factories/make-offer"
import { makeOrder } from "@/test/factories/make-order"

// Errors
import { ResourceNotFoundError } from "../errors/resource-not-found"

let farmsRepository: InMemoryFarmsRepository
let offersRepository: InMemoryOffersRepository
let ordersRepository: InMemoryOrdersRepository

let sut: ListFarmsWithOrdersUsecase

let repositories: {
  products:InMemoryProductsRepository,
  cycles: InMemoryCyclesRepository,
  users: InMemoryUsersRepository,
}

describe('list farms with orders', () => {
  beforeEach(() => {
    repositories = {
      products: new InMemoryProductsRepository(),
      cycles: new InMemoryCyclesRepository(),
      users: new InMemoryUsersRepository()
    }

    offersRepository = new InMemoryOffersRepository(
      repositories.products, 
      repositories.cycles
    )

    ordersRepository = new InMemoryOrdersRepository(offersRepository)
    farmsRepository = new InMemoryFarmsRepository(
      repositories.users, 
      offersRepository, 
      repositories.products, 
      ordersRepository
    )

    sut = new ListFarmsWithOrdersUsecase(repositories.cycles, farmsRepository)
  })

  it('should not be able to list farms with orders from a cycle that does not exists', async () => {
    await expect(() =>
      sut.execute({
        cycle_id: "123",
        page: 1
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  })

  it('should be able to list farms with orders', async () => {
    const farm = makeFarm({
      name: 'Fazenda 1'
    })

    await farmsRepository.create(farm)

    const cycle = makeCycle()
    await repositories.cycles.create(cycle)

    const product = makeProduct()
    await repositories.products.create(product)

    const offer = makeOffer({
      farm_id: farm.id,
      cycle_id: cycle.id,
      product_id: product.id
    })

    await offersRepository.create(offer)

    const order = makeOrder({
      offer_id: offer.id,
    })

    await ordersRepository.create(order)

    const { farms } = await sut.execute({
      cycle_id: cycle.id.value,
      page: 1
    })

    expect(farms).toHaveLength(1)
    expect(farms).toEqual([
      expect.objectContaining({ name: 'Fazenda 1' }),
    ])
  })

  it('should be able to search farms with orders', async () => {
    const cycle = makeCycle()
    await repositories.cycles.create(cycle)

    const product = makeProduct()
    await repositories.products.create(product)

    for(let i = 1; i <= 10; i++){
      const farm = makeFarm({
        name: `Fazenda ${i}`
      })

      await farmsRepository.create(farm)

      const offer = makeOffer({
        farm_id: farm.id,
        cycle_id: cycle.id,
        product_id: product.id
      })

      await offersRepository.create(offer)

      const order = makeOrder({
        offer_id: offer.id,
      })

      await ordersRepository.create(order)
    }

    const { farms } = await sut.execute({
      cycle_id: cycle.id.value,
      page: 1,
      name: 'Fazenda 8'
    })

    expect(farms).toHaveLength(1)
    expect(farms).toEqual([
      expect.objectContaining({ name: 'Fazenda 8' }),
    ])
  })

  it('should be able to list paginated farms with orders', async () => {
    const cycle = makeCycle()
    await repositories.cycles.create(cycle)

    const product = makeProduct()
    await repositories.products.create(product)

    for(let i = 1; i <= 22; i++){
      const farm = makeFarm({
        name: `Fazenda ${i}`
      })

      await farmsRepository.create(farm)

      const offer = makeOffer({
        farm_id: farm.id,
        cycle_id: cycle.id,
        product_id: product.id
      })

      await offersRepository.create(offer)

      const order = makeOrder({
        offer_id: offer.id,
      })

      await ordersRepository.create(order)
    }

    const { farms } = await sut.execute({
      cycle_id: cycle.id.value,
      page: 2
    })

    expect(farms).toHaveLength(2)
  })
})