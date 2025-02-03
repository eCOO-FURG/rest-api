// Entities
import { Product } from "@/core/entities/product";

// Repositories
import { CategoriesRepository } from "@/core/repositories/categories-repository";
import { ProductsRepository } from "@/core/repositories/products-repository";

// Services
import { Storage } from "@/core/storage/storage";

// Errors
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Types
import { File } from "@/core/types/file";

interface RegisterProductUseCaseRequest {
  name: string;
  pricing: Product["pricing"];
  image: File;
  category_id: string;
}

export class RegisterProductUseCase {
  constructor(
    private productsRepository: ProductsRepository,
    private categoriesRepository: CategoriesRepository,
    private storage: Storage
  ) {}

  async execute({
    name,
    image,
    pricing,
    category_id,
  }: RegisterProductUseCaseRequest) {
    const equal = await this.productsRepository.find("basic", {
      name,
      pricing,
    });

    if (!equal) {
      const urls = await this.storage.upload([image], "products");

      const category = await this.categoriesRepository.find("basic", {
        id: category_id,
      });

      if (!category) throw new ResourceNotFoundError("Categoria", category_id);

      const product = Product.create({
        name,
        pricing,
        image: urls[0],
        archived: false,
        category_id: category.id,
      });

      return await this.productsRepository.create(product);
    }

    if (!equal.archived)
      throw new ResourceAlreadyExistsError("Produto", equal.id.value);

    equal.unarchive();

    return await this.productsRepository.update(equal);
  }
}
