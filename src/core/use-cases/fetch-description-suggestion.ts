// Repositories
import { ProductsRepository } from "@/core/repositories/products-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// LLM
import { LLMProvider } from "@/core/llm/llm-provider";
import { Prompt } from "@/core/llm/prompts";

interface FetchDescriptionSuggestionUseCaseRequest {
  product_id: string;
}

export class FetchDescriptionSuggestionUseCase {
  constructor(
    private productsRepository: ProductsRepository,
    private llmProvider: LLMProvider,
  ) {}

  async execute({ product_id }: FetchDescriptionSuggestionUseCaseRequest) {
    const product = await this.productsRepository.find("product-and-category", {
      id: product_id,
    });

    if (!product) throw new ResourceNotFoundError("Produto", product_id);

    const stream = this.llmProvider.generate({
      prompt: Prompt.CREATE_DESCRIPTION,
      props: {
        product: product.name,
        category: product.category.name,
      },
    });

    return { stream };
  }
}
