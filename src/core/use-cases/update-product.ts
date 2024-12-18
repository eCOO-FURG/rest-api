// Repositories
import { ProductsRepository } from "@/core/repositories/products-repository";

// Services
import { Storage } from "@/core/storage/storage";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists";

// Entities
import { Product } from "@/core/entities/product";

interface UpdateProductUseCaseRequest {
  product_id: string;
  name?: string;
  image?: Buffer;
  pricing?: Product["pricing"];
  archived?: boolean;
}

export class UpdateProductUseCase {
  constructor(
    private productsRepository: ProductsRepository,
    private storage: Storage
  ) {}

  async execute({
    product_id,
    name,
    image,
    pricing,
    archived,
  }: UpdateProductUseCaseRequest) {
    const product = await this.productsRepository.find("basic", {
      id: product_id,
    });

    if (!product) throw new ResourceNotFoundError("Produto", product_id);

    const equal = await this.productsRepository.find("basic", {
      name,
      pricing,
    });

    if (equal && !(equal.archived != archived)) {
      throw new ResourceAlreadyExistsError("Produto", `${name}, ${pricing}`);
    }

    product.name = name ?? product.name;
    product.pricing = pricing ?? product.pricing;
    product.archived = archived ?? product.archived;

    if (image) {
      const urls = await this.storage.upload([image], "products");

      product.image = urls[0];
    }

    product.touch();

    await this.productsRepository.update(product);
  }
}
