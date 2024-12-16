// Entities
import { pricings } from "@/core/entities/product"

// Repositories
import { UsersRepository } from "@/core/repositories/users-repository";
import { ProductsRepository } from "@/core/repositories/products-repository";

// Services
import { Storage } from "@/core/storage/storage";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists";

interface UpdateProductUseCaseRequest {
  user_id: string;
  product_id: string;
  name?: string;
  image?: Buffer;
  pricing?: pricings;
  archived?: boolean;
}

export class UpdateProductUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private productsRepository: ProductsRepository,
    private storage: Storage,
  ){}

  async execute({ 
    user_id,
    product_id,
    name,
    image,
    pricing,
    archived
  }: UpdateProductUseCaseRequest) {
    const user = await this.usersRepository.find("basic", { id: user_id });

    if (!user) throw new ResourceNotFoundError("Usuário", user_id);

    const product = await this.productsRepository.find("basic", { id: product_id })

    if (!product) throw new ResourceNotFoundError("Produto", product_id);

    const existingProduct = await this.productsRepository.find("basic", { name, pricing });

    if (existingProduct && existingProduct.id.value !== product_id) {
      throw new ResourceAlreadyExistsError("Produto", existingProduct.id.value);
    }

    Object.assign(product, {
      name: name ?? product.name,
      pricing: pricing ?? product.pricing,
      archived: archived ?? product.archived,
    });

    if (image) {
      const urls = await this.storage.upload([image], "users");

      product.image = urls[0];
    }

    product.touch();

    await this.productsRepository.update(product);
  }
}