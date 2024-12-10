import { pricings, Product } from "@/core/entities/product"
import { ProductsRepository } from "../repositories/products-repository";
import { UsersRepository } from "../repositories/users-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found";

import { Storage } from "@/core/storage/storage";

// Errors
import { UnauthorizedError } from "@/core/errors/unauthorized";
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists";

interface RegisterProductUseCaseRequest {
  user_id: string;
  name: string;
  image: Buffer;
  pricing: pricings;
}

export class RegisterProductUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private productsRepository: ProductsRepository,
    private storage: Storage,
  ){}

  async execute({ user_id, name, image, pricing }: RegisterProductUseCaseRequest) {
    const user = await this.usersRepository.findById(user_id);

    if (!user) throw new ResourceNotFoundError("Usuário", user_id);

    const productWithSameName = await this.productsRepository.findByName(name);

    if (productWithSameName) 
      throw new ResourceAlreadyExistsError('Produto', productWithSameName.id.value);

    const urls = await this.storage.upload([image], "products");

    const product = Product.create({
      name,
      image: urls[0],
      pricing
    })

    await this.productsRepository.create(product);
  }
}