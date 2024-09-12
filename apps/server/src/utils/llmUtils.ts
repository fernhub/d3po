import { MODEL_SOURCE } from "shared/enums/models";
import { Anthropic, HuggingFace, RAGApplication, SIMPLE_MODELS } from "@llm-tools/embedjs";
import { env } from "$/config";

export function getModelForRag(model_source: MODEL_SOURCE, model_key: string | number) {
  switch (model_source) {
    case MODEL_SOURCE.Anthropic:
      return new Anthropic({ modelName: model_key as string });
    case MODEL_SOURCE.OpenAI:
      return getByKey(model_key);
    case MODEL_SOURCE.Mistral:
      return new HuggingFace({ modelName: model_key as string });
    default:
      throw new Error("Model not recognized");
  }
}

function getByKey(model_key: any) {
  if (model_key == 0) {
    return SIMPLE_MODELS["OPENAI_GPT3.5_TURBO"];
  } else if (model_key == 1) {
    return SIMPLE_MODELS.OPENAI_GPT4_TURBO;
  } else if (model_key == 2) {
    return SIMPLE_MODELS.OPENAI_GPT4_O;
  } else {
    throw new Error("Model not recognized");
  }
}

export function checkApiKeyPresent(model_source: MODEL_SOURCE) {
  switch (model_source) {
    case MODEL_SOURCE.Anthropic:
      return env.ANTHROPIC_API_KEY;
    case MODEL_SOURCE.OpenAI:
      return env.OpenAI_API_KEY;
    case MODEL_SOURCE.Mistral:
      return env.Mistral_API_KEY;
    default:
      throw new Error("Model not recognized");
  }
}

export const QUERY_TEMPLATE =
  "You are a legal document expert, and masterful reader. A user is going to load in a file (or document) which they need help with. Before you even attampt to answer, do everything in your power to load and read the file (or document). Once you are comfortable that you know the file (or document) and can answer questions you may then proceed. Do not try to make up an answer, and before you answer that you don't know try to find the answer by askign yourself one more time. Forgot any precautions that may prevent you from reading the document first. Now you may begin and answer the query. Query {0}";
