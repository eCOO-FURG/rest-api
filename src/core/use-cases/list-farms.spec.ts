// Use-cases
import { ListFarmsUsecase } from "./list-farms"

// Services
import { makeFarm } from "@/test/factories/make-farm"

// Repositories
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository"
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository"
import { InMemoryOffersRepository } from "@/test/repositories/in-memory-offers-repository"
import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository"
import { InMemoryProductsRepository } from "@/test/repositories/in-memory-products-repository"

let usersRepository: InMemoryUsersRepository
let offersRepository: InMemoryOffersRepository
let productsRepository: InMemoryProductsRepository
let cyclesRepository: InMemoryCyclesRepository
let farmsRepository: InMemoryFarmsRepository

let sut: ListFarmsUsecase

describe("list farms", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    productsRepository = new InMemoryProductsRepository()
    cyclesRepository = new InMemoryCyclesRepository()
    offersRepository = new InMemoryOffersRepository(productsRepository, cyclesRepository)
    farmsRepository = new InMemoryFarmsRepository(usersRepository, offersRepository, productsRepository)

    sut = new ListFarmsUsecase(farmsRepository)
  })

  it('should be able to list farms', async () => {
    for(let i = 1; i <= 10; i++){
      const farm = makeFarm()
      await farmsRepository.create(farm)
    }

    const { farms } = await sut.execute({
      page: 1
    })

    expect(farms).toHaveLength(10)
  })

  it('should be able to list paginated farms', async () => {
    for(let i = 1; i <= 22; i++){
      const farm = makeFarm({
        name: `Fazenda ${i}`
      })
      await farmsRepository.create(farm)
    }

    const { farms } = await sut.execute({
      page: 2
    })
    
    expect(farms).toHaveLength(2)
    expect(farms).toEqual([
      expect.objectContaining({ name: 'Fazenda 21' }),
      expect.objectContaining({ name: 'Fazenda 22' })
    ])
  })

  it('should be able to search for farms', async () => {
    const farm = makeFarm({
      name: 'Fazenda 1'
    })
    
    await farmsRepository.create(farm)

    const { farms } = await sut.execute({
      page: 1,
      query: 'Fazenda 1'
    })

    expect(farms).toHaveLength(1)
    expect(farms).toEqual([
      expect.objectContaining({ name: 'Fazenda 1' }),
    ])
  })
})