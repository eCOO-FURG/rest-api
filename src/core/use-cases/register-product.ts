// Entities
import { Product } from "@/core/entities/product";

// Repositories
import { ProductsRepository } from "@/core/repositories/products-repository";

// Services
import { Storage } from "@/core/storage/storage";

// Errors
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists";

// Types
import { File } from "@/core/types/file";

interface RegisterProductUseCaseRequest {
  name: string;
  pricing: Product["pricing"];
  image: File;
}

export class RegisterProductUseCase {
  constructor(
    private productsRepository: ProductsRepository,
    private storage: Storage
  ) {}

  async execute({ name, image, pricing }: RegisterProductUseCaseRequest) {
    const equal = await this.productsRepository.find("basic", {
      name,
      pricing,
    });

    if (!equal) {
      const urls = await this.storage.upload([image], "products");

      const product = Product.create({
        name,
        pricing,
        image: urls[0],
        archived: false,
      });

      return await this.productsRepository.create(product);
    }

    if (!equal.archived)
      throw new ResourceAlreadyExistsError("Produto", equal.id.value);

    equal.unarchive();

    return await this.productsRepository.update(equal);
  }
}
