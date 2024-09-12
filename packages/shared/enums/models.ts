import { Model } from "../schema/model";

type modelDefinitions = {
  [model: string]: Model[];
};

export enum MODEL_SOURCE {
  OpenAI = "OpenAI",
  Mistral = "Mistral",
  Anthropic = "Anthropic",
}

export const DEFAULT_MODEL = {
  source: MODEL_SOURCE.OpenAI,
  model: "OPENAI_GPT4o",
  display_name: "GPT 4o",
  key: 2,
};

export const MODELS: modelDefinitions = {
  OpenAI: [
    {
      source: MODEL_SOURCE.OpenAI,
      model: "OPENAI_GPT3_5_TURBO",
      display_name: "GPT 3.5 TURBO",
      key: 0,
    },
    {
      source: MODEL_SOURCE.OpenAI,
      model: "OPENAI_GPT4_TURBO",
      display_name: "GPT 4 TURBO",
      key: 1,
    },
    {
      source: MODEL_SOURCE.OpenAI,
      model: "OPENAI_GPT4o",
      display_name: "GPT 4o",
      key: 2,
    },
  ],
  Mistral: [
    {
      source: MODEL_SOURCE.Mistral,
      model: "MISTRAL_NEMO",
      display_name: "Mistral Nemo",
      key: "open-mistral-nemo",
    },
    {
      source: MODEL_SOURCE.Mistral,
      model: "MISTRAL_LARGE_2",
      display_name: "Mistral Large 2",
      key: "mistral-large-latest",
    },
    {
      source: MODEL_SOURCE.Mistral,
      model: "MISTRAL_MEDIUM",
      display_name: "Mistral Medium",
      key: "mistral-medium-latest",
    },
  ],
  Anthropic: [
    {
      source: MODEL_SOURCE.Anthropic,
      model: "CLAUDE_3_5_SONNET",
      display_name: "Claude 3.5 Sonnet",
      key: "claude-3-5-sonnet-20240620",
    },
    {
      source: MODEL_SOURCE.Anthropic,
      model: "CLAUDE_3_OPUS",
      display_name: "Claude 3 Opus",
      key: "claude-3-opus-20240229",
    },
    {
      source: MODEL_SOURCE.Anthropic,
      model: "CLAUDE_3_SONNET",
      display_name: "Claude 3 Sonnet",
      key: "claude-3-sonnet-20240229",
    },
    {
      source: MODEL_SOURCE.Anthropic,
      model: "CLAUDE_3_HAIKU",
      display_name: "Claude 3 Haiku",
      key: "claude-3-haiku-20240307",
    },
  ],
};
