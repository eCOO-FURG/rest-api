import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository"
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository"
import { InMemoryOffersRepository } from "@/test/repositories/in-memory-offers-repository"
import { InMemoryOrdersRepository } from "@/test/repositories/in-memory-orders-repository"
import { ListFarmsWithOrdersUsecase } from "./list-farms-with-orders"
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository"
import { InMemoryProductsRepository } from "@/test/repositories/in-memory-products-repository"
import { makeFarm } from "@/test/factories/make-farm"
import { makeCycle } from "@/test/factories/make-cycle"
import { makeProduct } from "@/test/factories/make-product"
import { makeOffer } from "@/test/factories/make-offer"
import { makeOrder } from "@/test/factories/make-order"

let repositories: {
  products:InMemoryProductsRepository,
  cycles: InMemoryCyclesRepository,
  users: InMemoryUsersRepository,
}

let farmsRepository: InMemoryFarmsRepository
let offersRepository: InMemoryOffersRepository
let ordersRepository: InMemoryOrdersRepository

let sut: ListFarmsWithOrdersUsecase

describe('list farms with orders', () => {
  beforeEach(() => {
    repositories.products = new InMemoryProductsRepository()
    repositories.cycles = new InMemoryCyclesRepository()
    repositories.users = new InMemoryUsersRepository()
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

  it('should be able list farms', async () => {
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

    
  })
})