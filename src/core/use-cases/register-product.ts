import { pricings, Product } from "@/core/entities/product"
import { ProductsRepository } from "../repositories/products-repository";
import { UsersRepository } from "../repositories/users-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found";

import { Storage } from "@/core/storage/storage";

// Errors
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
    const user = await this.usersRepository.find("basic", { id: user_id });

    if (!user) throw new ResourceNotFoundError("Usuário", user_id);

    const existingProduct = await this.productsRepository.find("basic", { name, pricing });

    if (existingProduct) {
      if (existingProduct.archived === true) {
        existingProduct.unarchive();
    
        await this.productsRepository.update(existingProduct);

        return;
      }
    
      throw new ResourceAlreadyExistsError('Produto', existingProduct.id.value);  
    }
    

    const urls = await this.storage.upload([image], "products");

    const product = Product.create({
      name,
      image: urls[0],
      pricing,
      archived: false,
    })

    await this.productsRepository.create(product);
  }
}