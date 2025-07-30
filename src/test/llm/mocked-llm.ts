// LLM
import {
  LLMProvider,
  LLMProviderGenerateRequest,
} from "@/core/llm/llm-provider";
import { prompts } from "@/core/llm/prompts";

export class MockedLLM implements LLMProvider {
  async *generate({
    prompt,
  }: LLMProviderGenerateRequest): AsyncGenerator<string> {
    const sketch = prompts[prompt];

    for (const word of sketch) {
      yield word;
    }
  }
}
