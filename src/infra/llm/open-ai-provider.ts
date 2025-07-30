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

    return prompts[Prompt.BASIC_INSTRUCTION] + "\n" + sketch;
  }

  async generate({
    prompt,
    props,
  }: LLMProviderGenerateRequest): Promise<string> {
    const { output_text } = await this.client.responses.create({
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      input: this.format({
        sketch: prompts[prompt],
        props,
      }),
    });

    return output_text;
  }
}
