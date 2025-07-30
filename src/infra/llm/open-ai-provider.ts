// LLM
import {
  LLMProvider,
  LLMProviderGenerateRequest,
} from "@/core/llm/llm-provider";
import { Prompt, prompts } from "@/core/llm/prompts";

// Libraries
import { OpenAI } from "openai";

// Environment
import { env } from "@/infra/env";

interface OpenAIProviderFormatRequest {
  sketch: string;
  props: LLMProviderGenerateRequest["props"];
}

export class OpenAIProvider implements LLMProvider {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
    });
  }

  private format({ sketch, props }: OpenAIProviderFormatRequest): string {
    for (const key of Object.keys(props)) {
      sketch = sketch.replace(`{${key}}`, props[key as keyof typeof props]);
    }

    return sketch;
  }

  async *generate({
    prompt,
    props,
  }: LLMProviderGenerateRequest): AsyncGenerator<string> {
    const stream = await this.client.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      stream: true,
      messages: [
        {
          role: "system",
          content: prompts[Prompt.BASIC_INSTRUCTION],
        },
        {
          role: "user",
          content: this.format({
            sketch: prompts[prompt],
            props,
          }),
        },
      ],
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0].delta.content;

      if (content) {
        yield content;
      }
    }
  }
}
