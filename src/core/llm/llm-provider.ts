// LLM
import { Prompt } from "@/core/llm/prompts";

export type LLMProviderGenerateRequest = {
  prompt: Prompt.CREATE_DESCRIPTION;
  props: {
    product: string;
    category: string;
  };
};

export interface LLMProvider {
  generate(data: LLMProviderGenerateRequest): AsyncGenerator<string>;
}
