// Repositories
import { CategoriesRepository } from "@/core/repositories/categories-repository";
import { ProductsRepository } from "@/core/repositories/products-repository";

// Services
import { Storage } from "@/core/storage/storage";

// Errors
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Entities
import { Product } from "@/core/entities/product";
import { UUID } from "@/core/entities/aggregates/uuid";

interface UpdateProductUseCaseRequest {
  product_id: string;
  name?: string;
  image?: Buffer;
  pricing?: Product["pricing"];
  category_id?: string;
  archived?: boolean;
}

export class UpdateProductUseCase {
  constructor(
    private productsRepository: ProductsRepository,
    private categoriesRepository: CategoriesRepository,
    private storage: Storage
  ) {}

  async execute({
    product_id,
    name,
    image,
    pricing,
    category_id,
    archived,
  }: UpdateProductUseCaseRequest) {
    const product = await this.productsRepository.find("basic", {
      id: product_id,
    });

    if (!product) throw new ResourceNotFoundError("Produto", product_id);

    if (category_id) {
      const category = await this.categoriesRepository.find("basic", {
        id: category_id,
      });

      if (!category) throw new ResourceNotFoundError("Categoria", category_id);
    }

    const equal = await this.productsRepository.find("basic", {
      name,
      pricing,
    });

    if (equal && !(equal.archived != archived)) {
      throw new ResourceAlreadyExistsError("Produto", `${name}, ${pricing}`);
    }

    product.name = name ?? product.name;
    product.pricing = pricing ?? product.pricing;
    product.category_id = new UUID(category_id) ?? product.category_id;
    product.archived = archived ?? product.archived;

    if (image) {
      const urls = await this.storage.upload([image], "products");

      product.image = urls[0];
    }

    product.touch();

    await this.productsRepository.update(product);
  }
}
