// Use-cases
import { FetchDescriptionSuggestionUseCase } from "@/core/use-cases/fetch-description-suggestion";

// Repositories
import { InMemoryProductsRepository } from "@/test/repositories/in-memory-products-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// LLM
import { MockedLLM } from "@/test/llm/mocked-llm";
import { Prompt, prompts } from "@/core/llm/prompts";

// Factories
import { makeProductAndCategory } from "@/test/factories/make-product-and-category";

let productsRepository: InMemoryProductsRepository;
let llmProvider: MockedLLM;
let sut: FetchDescriptionSuggestionUseCase;

describe("fetch description suggestion", () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository();
    llmProvider = new MockedLLM();

    sut = new FetchDescriptionSuggestionUseCase(productsRepository, llmProvider);
  });

  it("should be able to fetch description suggestion stream", async () => {
    const product = makeProductAndCategory();

    await productsRepository.create(product);

    const { stream } = await sut.execute({
      product_id: product.id.value,
    });

    const response = [];

    for await (const chunk of stream) {
      response.push(chunk);
    }

    expect(response.join("")).toBe(prompts[Prompt.CREATE_DESCRIPTION]);
  });

  it("should not be able to fetch description suggestion stream if product does not exist", async () => {
    await expect(() =>
      sut.execute({ product_id: "non-existing-product-id" }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
